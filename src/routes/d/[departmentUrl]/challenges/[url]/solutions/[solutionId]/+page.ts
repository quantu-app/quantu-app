import { authGuard } from '$lib/guard/authGuard';
import { showChallengeByUrl } from '$lib/state/challenges';
import { showChallengeSolutionById } from '$lib/state/challengeSolutions';

import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const url = input.params.url;
	const solutionId = input.params.solutionId;

	await showChallengeByUrl(departmentUrl, url, input.fetch);
	await showChallengeSolutionById(departmentUrl, url, solutionId, input.fetch);

	return {
		departmentUrl,
		url,
		solutionId
	};
};
