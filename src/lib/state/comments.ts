import type { Comment, CommentVote } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';

export type StateComment = Comment & {
	user: { id: string; username: string };
	votes: CommentVote[];
};

export type StateCommentWithChildren = StateComment & {
	children: StateCommentWithChildren[];
};

export interface StateCommentTree {
	[referenceType: string]: {
		[referenceId: string]: StateCommentWithChildren[];
	};
}

export const commentsWritable = writable<Array<StateComment>>([]);

export const commentsById = derived(commentsWritable, (comments) =>
	comments.reduce((byId, comment) => {
		byId[comment.id] = comment;
		return byId;
	}, {} as { [id: string]: StateComment })
);
export const commentsTree = derived(commentsWritable, (comments) => {
	const commentsById = comments.reduce((byId, comment) => {
		byId[comment.id] = { ...comment, children: [] } as StateCommentWithChildren;
		return byId;
	}, {} as { [id: string]: StateCommentWithChildren });

	Object.values(commentsById).reduce((commentTree, comment) => {
		const referenceType =
			commentTree[comment.referenceType] || (commentTree[comment.referenceType] = {});
		const referenceComments =
			referenceType[comment.referenceId] || (referenceType[comment.referenceId] = []);
		if (comment.commentId) {
			const parentComment = commentsById[comment.commentId];
			if (parentComment) {
				parentComment.children.push(comment);
			}
		} else {
			referenceComments.push(comment);
		}
		return commentTree;
	}, {} as StateCommentTree);
});

export async function showCommentById(referenceType: string, referenceId: string, id: string) {
	const res = await fetch(`${base}/api/comments/${referenceType}/${referenceId}/${id}`);
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((comments) => addOrUpdate(comments, comment));
	return comment;
}

export async function showComments(referenceType: string, referenceId: string) {
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
	commentsWritable.update((comments) => addOrUpdate(comments, comment));
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
	commentsWritable.update((comments) => addOrUpdate(comments, comment));
	return comment;
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
		const comment = state.find((c) => c.id === commentVote.commentId);
		if (comment) {
			const index = comment.votes.findIndex((v) => v.id === comment.id);
			if (index === -1) {
				comment.votes.push(commentVote);
			} else {
				comment.votes[index] = commentVote;
			}
		}
		return state;
	});
	return commentVote;
}

export function addComments(comments: Array<StateComment>) {
	commentsWritable.update((state) =>
		comments.reduce((state, comment) => addOrUpdate(state, comment), state)
	);
}

function addOrUpdate(state: Array<StateComment>, comment: StateComment): Array<StateComment> {
	const index = state.findIndex((c) => c.id === comment.id);
	if (index === -1) {
		state.push(comment);
	} else {
		state[index] = comment;
	}
	return state;
}

function commentFromJSON(comment: StateComment): StateComment {
	return {
		...comment,
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
