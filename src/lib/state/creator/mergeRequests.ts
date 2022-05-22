import type { ChangeType, Department, MergeRequest, MergeRequestApproval } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import { createQueryParams, type IFetch } from '$lib/utils';

export type StateMergeRequest = MergeRequest & {
	reference?: Department;
	approvals: MergeRequestApproval[];
	user: {
		id: string;
		username: string;
	};
	change: {
		referenceId: string;
		referenceType: ChangeType;
	};
};

const mergeRequestsWritable = writable<StateMergeRequest[]>([]);

export const mergeRequests = derived(mergeRequestsWritable, (mergeRequests) => mergeRequests);

export const mergeRequestsById = derived(mergeRequestsWritable, (mergeRequests) =>
	mergeRequests.reduce((byId, mergeRequest) => {
		byId[mergeRequest.id] = mergeRequest;
		return byId;
	}, {} as { [id: string]: StateMergeRequest })
);

export const mergeRequestsByChangeId = derived(mergeRequestsWritable, (mergeRequests) =>
	mergeRequests.reduce((byId, mergeRequest) => {
		byId[mergeRequest.changeId] = mergeRequest;
		return byId;
	}, {} as { [changeId: string]: StateMergeRequest })
);

export async function showMergeRequestById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/merge-requests/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const mergeRequest: StateMergeRequest = mergeRequestFromJSON(await res.json());
	mergeRequestsWritable.update((state) => addOrUpdate(state.slice(), mergeRequest));
	return mergeRequest;
}

export async function showMergeRequestByChangeId(changeId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/changes/${changeId}/merge-request`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const mergeRequest: StateMergeRequest = mergeRequestFromJSON(await res.json());
	mergeRequestsWritable.update((state) => addOrUpdate(state.slice(), mergeRequest));
	return mergeRequest;
}

export async function showMergeRequests(
	referenceType?: ChangeType,
	currentUser?: boolean,
	merged?: boolean,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/creator/merge-requests${createQueryParams({
			referenceType,
			merged: typeof merged === 'boolean' ? merged.toString() : undefined,
			currentUser: currentUser ? 'true' : undefined
		})}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const mergeRequests: StateMergeRequest[] = (await res.json()).map(mergeRequestFromJSON);
	mergeRequestsWritable.update((state) =>
		mergeRequests.reduce((state, mergeRequest) => addOrUpdate(state, mergeRequest), state.slice())
	);
	return mergeRequests;
}

export async function createMergeRequest(changeId: string) {
	const res = await fetch(`${base}/api/creator/changes/${changeId}/merge-request`, {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const mergeRequest: StateMergeRequest = mergeRequestFromJSON(await res.json());
	mergeRequestsWritable.update((state) => addOrUpdate(state.slice(), mergeRequest));
	return mergeRequest;
}

export async function approveMergeRequest(id: string, approved: boolean | null) {
	const res = await fetch(`${base}/api/creator/merge-requests/${id}/approve`, {
		method: 'PATCH',
		body: JSON.stringify(approved)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const mergeRequestApproval: MergeRequestApproval = mergeRequestApprovalFromJSON(await res.json());
	mergeRequestsWritable.update((state) => {
		const mergeRequestIndex = state.findIndex(
			(mergeRequest) => mergeRequestApproval.mergeRequestId === mergeRequest.id
		);
		const mergeRequest = state[mergeRequestIndex];
		if (mergeRequest) {
			const mergeRequestApprovals = mergeRequest.approvals.slice();
			const mergeRequestApprovalIndex = mergeRequestApprovals.findIndex(
				(approval) => approval.id === mergeRequestApproval.id
			);

			if (mergeRequestApprovalIndex === -1) {
				mergeRequestApprovals.push(mergeRequestApproval);
			} else {
				mergeRequestApprovals[mergeRequestApprovalIndex] = mergeRequestApproval;
			}

			state = state.slice();
			state[mergeRequestIndex] = { ...mergeRequest, approvals: mergeRequestApprovals };
		}
		return state;
	});
	return mergeRequestApproval;
}

export async function mergeMergeRequest(mergeRequestId: string) {
	const res = await fetch(`${base}/api/creator/merge-requests/${mergeRequestId}/merge`, {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const mergeRequest: StateMergeRequest = mergeRequestFromJSON(await res.json());
	mergeRequestsWritable.update((state) => addOrUpdate(state.slice(), mergeRequest));
	return mergeRequest;
}

function addOrUpdate(
	mergeRequests: StateMergeRequest[],
	mergeRequest: StateMergeRequest
): StateMergeRequest[] {
	const index = mergeRequests.findIndex((t) => t.id === mergeRequest.id);
	if (index === -1) {
		mergeRequests.push(mergeRequest);
	} else {
		mergeRequests[index] = mergeRequest;
	}
	return mergeRequests;
}

function mergeRequestFromJSON(mergeRequest: StateMergeRequest): StateMergeRequest {
	return {
		...mergeRequest,
		approvals: mergeRequest.approvals.map(mergeRequestApprovalFromJSON),
		createdAt: new Date(mergeRequest.createdAt),
		updatedAt: new Date(mergeRequest.updatedAt)
	};
}

function mergeRequestApprovalFromJSON(
	mergeRequestApproval: MergeRequestApproval
): MergeRequestApproval {
	return {
		...mergeRequestApproval,
		createdAt: new Date(mergeRequestApproval.createdAt),
		updatedAt: new Date(mergeRequestApproval.updatedAt)
	};
}
