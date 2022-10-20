import { authGuard } from '$lib/guard/authGuard';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => authGuard(input);
