import { Graph } from '@aicacia/graph';
import { Peer, Mesh } from '@aicacia/mesh';
import { browser } from '$app/env';

export type IUser = {
	id: string;
	username: string;
	ready: boolean;
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

export const graph = new Graph<IState>();

let mesh: Mesh;

graph
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

if (browser) {
	const peer = new Peer(window.SimplePeer, {
		namespace: 'app-quantu'
	});

	mesh = new Mesh(peer);
	mesh.on('data', (data) => {
		if ('json' in data) {
			graph.merge(data.path, data.json);
		} else {
			const node = graph.getNodeAtPath(data.path);

			if (node) {
				mesh.broadcast({
					path: node.getPath(),
					json: node.toJSON()
				});
			}
		}
	});
}
