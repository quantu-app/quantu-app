import { creatorGuard } from '$lib/guard/creatorGuard';
import { showChangesByIds } from '$lib/state/creator/changes';
import { showMergeRequests } from '$lib/state/creator/mergeRequests';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const mergeRequests = await showMergeRequests(undefined, undefined, undefined, input.fetch);
	await showChangesByIds(
		mergeRequests.map((mergeRequest) => mergeRequest.changeId),
		input.fetch
	);
};
