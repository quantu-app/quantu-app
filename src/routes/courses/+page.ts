import { authGuard } from '$lib/guard/authGuard';
import type { PageLoad } from './$types';
import { showAllCourses } from '$lib/state/courses';

export const load: PageLoad = async (input) => {
	await authGuard(input);
	await showAllCourses(input.fetch);
};
