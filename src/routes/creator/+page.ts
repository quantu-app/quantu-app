import { creatorGuard } from '$lib/guard/creatorGuard';
import { showDepartments } from '$lib/state/creator/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);
	await showDepartments([], input.fetch);
};
