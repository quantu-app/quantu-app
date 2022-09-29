import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = (input) => {
	console.error(input);

	return {
		message: 'Internal Application Error',
		code: (input.error as any).code ?? 'UNKNOWN'
	};
};
