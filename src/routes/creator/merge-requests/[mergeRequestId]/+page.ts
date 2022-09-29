import { creatorGuard } from '$lib/guard/creatorGuard';
import { showChangeAt, showChangeById } from '$lib/state/creator/changes';
import { showMergeRequestById } from '$lib/state/creator/mergeRequests';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const mergeRequestId = input.params.mergeRequestId;
	const mergeRequest = await showMergeRequestById(mergeRequestId, input.fetch);
	await showChangeById(mergeRequest.changeId, input.fetch);
	const prevChangeValue = mergeRequest.change.prevChangeId
		? await showChangeAt(mergeRequest.change.prevChangeId, input.fetch)
		: null;

	return {
		mergeRequestId,
		prevChangeValue
	};
};
