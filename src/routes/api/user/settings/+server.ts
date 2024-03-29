import { authenticated } from '$lib/api/auth';
import { run } from '$lib/prisma';

export const PATCH = authenticated((event) =>
	event.request.json().then((data) =>
		run((client) =>
			client.applicationSettings.upsert({
				create: {
					...data,
					userId: event.locals.token?.userId
				},
				update: {
					...data,
					userId: event.locals.token?.userId
				},
				where: {
					userId: event.locals.token?.userId
				}
			})
		).then((settings) =>
			settings
				? new Response(JSON.stringify(settings), {
						status: 200
				  })
				: new Response(null, {
						status: 404
				  })
		)
	)
);
