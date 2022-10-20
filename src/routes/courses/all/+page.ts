import { authGuard } from '$lib/guard/authGuard';
import { showAllCourses } from '$lib/state/courses';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await authGuard(input);
	await showAllCourses(input.fetch);
};
