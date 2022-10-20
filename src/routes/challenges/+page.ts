import { authGuard } from '$lib/guard/authGuard';
import { showAllChallenges } from '$lib/state/challenges';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	console.log(await input.parent());
	await authGuard(input);
	await showAllChallenges(input.fetch);
};
