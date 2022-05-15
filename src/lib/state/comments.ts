import type { Comment, CommentVote } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

export type StateComment = Comment & {
	loaded: boolean;
	user: { id: string; username: string };
	votes: CommentVote[];
	comments: StateComment[];
};

export const commentsWritable = writable<Array<StateComment>>([]);

export const comments = derived(commentsWritable, (comments) => comments);

export const commentsById = derived(commentsWritable, (comments) =>
	comments.reduce((byId, comment) => {
		byId[comment.id] = comment;
		return byId;
	}, {} as { [id: string]: StateComment })
);

export const commentsByReference = derived(commentsById, (commentsById) =>
	Object.values(commentsById).reduce((byReference, comment) => {
		const byReferenceType =
			byReference[comment.referenceType] || (byReference[comment.referenceType] = {});
		const byReferenceId =
			byReferenceType[comment.referenceId] || (byReferenceType[comment.referenceId] = []);
		byReferenceId.push(comment);
		return byReference;
	}, {} as { [referenceType: string]: { [referenceId: string]: StateComment[] } })
);

export async function showCommentById(
	referenceType: string,
	referenceId: string,
	id: string,
	fetchFn: IFetch = fetch
) {
	const cachedComment = get(commentsById)[id];
	if (cachedComment) {
		return cachedComment;
	}
	const res = await fetchFn(`${base}/api/comments/${referenceType}/${referenceId}/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((comments) => addOrUpdate(comments.slice(), comment));
	return comment;
}

export async function showCommentsById(
	referenceType: string,
	referenceId: string,
	id: string,
	fetchFn: IFetch = fetch
) {
	const cachedComment = get(commentsById)[id];
	if (cachedComment && cachedComment.loaded && cachedComment.comments.length) {
		return cachedComment.comments;
	}
	const res = await fetchFn(`${base}/api/comments/${referenceType}/${referenceId}/${id}/comments`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
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

export async function showComments(
	referenceType: string,
	referenceId: string,
	fetchFn: IFetch = fetch
) {
	const cachedComments = (
		(get(commentsByReference)[referenceType] || {})[referenceId] || []
	).filter((comment) => comment.commentId === null);
	if (cachedComments.length) {
		return cachedComments;
	}
	const res = await fetchFn(`${base}/api/comments/${referenceType}/${referenceId}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
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
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const comment: StateComment = commentFromJSON(await res.json());
	commentsWritable.update((state) => addOrUpdate(state.slice(), comment));
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
	commentsWritable.update((state) => addOrUpdate(state.slice(), comment));
	return comment;
}

export function deleteCommentsByReference(referenceType: string, referenceId: string) {
	commentsWritable.update((state) =>
		state.filter(
			(comment) => comment.referenceType !== referenceType || comment.referenceId !== referenceId
		)
	);
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

function addOrUpdate(
	state: Array<StateComment>,
	comment: StateComment,
	isTopLevel = true
): Array<StateComment> {
	if (comment.commentId) {
		const parentIndex = state.findIndex((c) => c.id === comment.commentId);
		if (parentIndex !== -1) {
			const parent = state[parentIndex];
			const parentComments = parent.comments.slice();
			const commentParentIndex = parentComments.findIndex((c) => c.id === comment.id);
			if (commentParentIndex === -1) {
				parentComments.push(comment);
			} else {
				parentComments[commentParentIndex] = comment;
			}
			state[parentIndex] = { ...parent, comments: parentComments };
		}
	}
	const comments = state.filter((c) => c.commentId === comment.id);
	if (comments.length || comment.comments.length) {
		for (const child of comment.comments) {
			const childIndex = comments.findIndex((c) => c.id === child.id);
			if (childIndex === -1) {
				comments.push(child);
			} else {
				comments[childIndex] = child;
			}
			addOrUpdate(state, child, false);
		}
		comment.comments = comments;
		comment.loaded = true;
	}
	if (isTopLevel) {
		comment.loaded = true;
	}
	const index = state.findIndex((c) => c.id === comment.id);
	if (index === -1) {
		state.push(comment);
	} else {
		state[index] = comment;
	}
	return state;
}

export function commentFromJSON(comment: StateComment): StateComment {
	return {
		...comment,
		loaded: false,
		comments: (comment.comments || []).map(commentFromJSON),
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
