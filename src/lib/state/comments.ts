import type { Comment, CommentVote } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';

export type StateComment = Comment & {
	loaded: boolean;
	user: { id: string; username: string };
	votes: CommentVote[];
	comments: StateComment[];
	children: StateComment[];
};

export interface StateCommentTree {
	[referenceType: string]: {
		[referenceId: string]: { [commentId: string]: StateComment };
	};
}

export const commentsWritable = writable<Array<StateComment>>([]);

export const comments = derived(commentsWritable, (comments) => comments.slice());

export const commentsById = derived(commentsWritable, (comments) =>
	comments.reduce((byId, comment) => {
		comment.children = [];
		byId[comment.id] = comment;
		return byId;
	}, {} as { [id: string]: StateComment })
);
export const commentsTree = derived(commentsById, (commentsById) => {
	return Object.values(commentsById).reduce((commentTree, comment) => {
		comment = { ...comment };
		const referenceType =
			commentTree[comment.referenceType] || (commentTree[comment.referenceType] = {});
		const referenceComments =
			referenceType[comment.referenceId] || (referenceType[comment.referenceId] = {});
		if (comment.commentId) {
			const parentComment = commentsById[comment.commentId];
			if (parentComment) {
				parentComment.children.push(comment);
			}
		}
		referenceComments[comment.id] = comment;
		return commentTree;
	}, {} as StateCommentTree);
});

export async function showCommentById(referenceType: string, referenceId: string, id: string) {
	const cachedComment = get(commentsById)[id];
	if (cachedComment) {
		return cachedComment;
	}
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}/${id}`);
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((comments) => addOrUpdate(comments.slice(), comment));
	return comment;
}

export async function showCommentsById(referenceType: string, referenceId: string, id: string) {
	const cachedComment = ((get(commentsTree)[referenceType] || {})[referenceId] || {})[id];
	if (cachedComment && cachedComment.children.length) {
		return cachedComment.children;
	}
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}/${id}/children`);
	if (!res.ok) {
		throw await res.json();
	}
	const comments: Array<StateComment> = (await res.json()).map(commentFromJSON);
	commentsWritable.update((state) => {
		const index = state.findIndex((c) => c.id === id);
		const comment = state[index];
		if (comment) {
			state[index] = { ...comment, loaded: true };
		}
		state = comments.reduce((state, comment) => addOrUpdate(state, comment), state.slice());
		return state;
	});
	return comments;
}

export async function showComments(referenceType: string, referenceId: string) {
	const cachedComments = Object.values(
		(get(commentsTree)[referenceType] || {})[referenceId] || {}
	).filter((comment) => comment.commentId === null);
	if (cachedComments.length) {
		return cachedComments;
	}
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}`);
	if (!res.ok) {
		throw await res.json();
	}
	const comments: Array<StateComment> = (await res.json()).map(commentFromJSON);
	addComments(comments);
	return comments;
}

export async function createComment(
	referenceType: string,
	referenceId: string,
	data: Partial<Comment>
) {
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}`, {
		method: 'POST',
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((comments) => addOrUpdate(comments.slice(), comment));
	return comment;
}

export async function updateComment(
	referenceType: string,
	referenceId: string,
	id: string,
	data: Partial<Comment>
) {
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((comments) => addOrUpdate(comments.slice(), comment));
	return comment;
}

export async function deleteComment(referenceType: string, referenceId: string, id: string) {
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((state) => deleteCommentRecur(state.slice(), comment.id));
	return comment;
}

export function deleteCommentsByReference(referenceType: string, referenceId: string) {
	commentsWritable.update((state) =>
		state.filter(
			(comment) => comment.referenceType !== referenceType || comment.referenceId !== referenceId
		)
	);
}

function deleteCommentRecur(state: StateComment[], id: string): StateComment[] {
	const index = state.findIndex((c) => c.id === id);
	const comment = state[index];

	if (comment) {
		state.splice(index, 1);
		for (const child of state.filter((c) => c.commentId !== id)) {
			deleteCommentRecur(state, child.id);
		}
	}

	return state;
}

export async function voteOnComment(
	referenceType: string,
	referenceId: string,
	id: string,
	data: boolean | null
) {
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}/${id}/vote`, {
		method: 'PATCH',
		body: JSON.stringify(data)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const commentVote: CommentVote = commentVoteFromJSON(await res.json());
	commentsWritable.update((state) => {
		const commentIndex = state.findIndex((comment) => comment.id === commentVote.commentId);
		const comment = state[commentIndex];

		if (comment) {
			const commentVoteIndex = comment.votes.findIndex((v) => v.id === commentVote.id);
			const votes = comment.votes.slice();
			if (commentVoteIndex === -1) {
				votes.push(commentVote);
			} else {
				votes[commentVoteIndex] = commentVote;
			}
			state = state.slice();
			state[commentIndex] = { ...comment, votes };
		}
		return state;
	});
	return commentVote;
}

export function addComments(comments: Array<StateComment>) {
	commentsWritable.update((state) =>
		comments.reduce((state, comment) => addOrUpdate(state, comment), state.slice())
	);
}

function addOrUpdate(state: Array<StateComment>, comment: StateComment): Array<StateComment> {
	const index = state.findIndex((c) => c.id === comment.id);
	if (index === -1) {
		state.push(comment);
	} else {
		state[index] = comment;
	}
	for (const child of comment.comments) {
		addOrUpdate(state, child);
	}
	return state;
}

export function commentFromJSON(comment: StateComment): StateComment {
	const comments = (comment.comments || []).map(commentFromJSON);
	return {
		...comment,
		children: [],
		loaded: !!comments.length,
		comments,
		votes: comment.votes.map(commentVoteFromJSON),
		createdAt: new Date(comment.createdAt),
		updatedAt: new Date(comment.updatedAt)
	};
}

function commentVoteFromJSON(commentVote: CommentVote): CommentVote {
	return {
		...commentVote,
		createdAt: new Date(commentVote.createdAt),
		updatedAt: new Date(commentVote.updatedAt)
	};
}
