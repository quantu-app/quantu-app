import type { LoadOutput } from '@sveltejs/kit';

export function isValidStatus(response: LoadOutput) {
	return !response.status || (response.status > 199 && response.status < 300);
}
