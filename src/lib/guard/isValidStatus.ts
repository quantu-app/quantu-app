import type { LoadOutput } from '@sveltejs/kit';

export function isValidStatus(response: void | LoadOutput) {
	return response && (!response.status || (response.status > 199 && response.status < 300));
}
