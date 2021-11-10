import { Graph } from '@aicacia/graph';
import { Peer, Mesh } from '@aicacia/mesh';
import { browser } from '$app/env';
import type { INodeJSON, IEdgeJSON, IRefJSON } from '@aicacia/graph/types/Graph';

export enum QuestionState {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Current = 'current'
}
export type IQuestionResults = { [questionId: string]: QuestionState };
export type IResults = { [userId: string]: IQuestionResults };

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
	results: IResults;
	started: boolean;
};

export type IPlays = {
	[roomId: string]: IPlay;
};

export type IState = {
	rooms: IPlays;
};

export const playGraph = new Graph<IState>();

type IPlayMessage = { path: string; json: IRefJSON | IEdgeJSON | INodeJSON } | { path: string };

let mesh: Mesh;

if (browser) {
	const peer = new Peer(window.SimplePeer, {
		namespace: 'app-quantu'
	});

	mesh = new Mesh(peer);
	mesh.on('data', (data: IPlayMessage) => {
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
