import { Graph } from '@aicacia/graph';
import { Peer, Mesh } from '@aicacia/mesh';
import { browser } from '$app/env';

export type IUser = {
	id: string;
	username: string;
	ready: boolean;
	results: { [questionId: string]: boolean };
};

export type IUsers = {
	[userId: string]: IUser;
};

export type IPlay = {
	users: IUsers;
	started: boolean;
};

export type IPlays = {
	[roomId: string]: IPlay;
};

export type IState = {
	rooms: IPlays;
};

export const playGraph = new Graph<IState>();

let mesh: Mesh;

if (browser) {
	const peer = new Peer(window.SimplePeer, {
		namespace: 'app-quantu'
	});

	mesh = new Mesh(peer);
	mesh.on('data', (data) => {
		if ('json' in data) {
			playGraph.merge(data.path, data.json);
		} else {
			const node = playGraph.getNodeAtPath(data.path);

			if (node) {
				mesh.broadcast({
					path: node.getPath(),
					json: node.toJSON()
				});
			}
		}
	});

	playGraph
		.on('set', (path, json) => {
			mesh.broadcast({
				path,
				json
			});
		})
		.on('get', (path) => {
			mesh.broadcast({
				path
			});
		});
}
