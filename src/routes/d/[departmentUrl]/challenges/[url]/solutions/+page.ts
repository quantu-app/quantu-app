import { authGuard } from '$lib/guard/authGuard';
import { showChallengeByUrl } from '$lib/state/challenges';
import { showChallengeSolutions, type StateChallengeSolution } from '$lib/state/challengeSolutions';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);

	const departmentUrl = input.params.departmentUrl;
	const url = input.params.url;

	await showChallengeByUrl(departmentUrl, url, input.fetch);
	await showChallengeSolutions(departmentUrl, url, input.fetch);

	return {
		departmentUrl,
		url
	};
};
