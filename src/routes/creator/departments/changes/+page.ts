import { creatorGuard } from '$lib/guard/creatorGuard';
import { showChanges } from '$lib/state/creator/changes';
import { showDepartments } from '$lib/state/creator/departments';
import type { PageLoad } from './$types';

export const load: PageLoad = async (input) => {
	await creatorGuard(input);

	const changes = await showChanges('DEPARTMENT', undefined, false, true, undefined, input.fetch);
	await showDepartments(
		changes.map((change) => change.referenceId).filter((referenceId) => !!referenceId) as string[],
		input.fetch
	);
};
