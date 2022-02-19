import type { Topic } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';

const topicsWritable = writable<Topic[]>([]);

export const topics = derived(topicsWritable, (topics) => topics);

export const topicsById = derived(topicsWritable, (topics) =>
	topics.reduce((byId, topic) => {
		byId[topic.id] = topic;
		return byId;
	}, {} as { [id: string]: Topic })
);
export const topicsByParentId = derived(topicsWritable, (topics) =>
	topics.reduce((byParentId, topic) => {
		const parentTopics = byParentId[topic.parentId] || (byParentId[topic.parentId] = []);
		parentTopics.push(topic);
		return byParentId;
	}, {} as { [parentId: string]: Topic[] })
);
export const topicsByParentIdUrl = derived(topicsWritable, (topics) =>
	topics.reduce((byParentId, topic) => {
		const parentTopics = byParentId[topic.parentId] || (byParentId[topic.parentId] = {});
		parentTopics[topic.url] = topic;
		return byParentId;
	}, {} as { [parentId: string]: { [url: string]: Topic } })
);
export const topicsByPath = derived(topicsById, (topicsById) => {
	const idsToPath: { [id: string]: string[] } = {};

	return Object.values(topicsById).reduce((topicsByPath, topic) => {
		topicsByPath[getPath(topic, topicsById, idsToPath).join('/')] = topic;
		return topicsByPath;
	}, {} as { [path: string]: Topic });
});

function getPath(
	topic: Topic,
	topicsById: { [id: string]: Topic },
	idsToPath: { [id: string]: string[] }
): string[] {
	let path: string[] = [];
	if (topic.parentId) {
		const parentPath = idsToPath[topic.parentId];
		if (!parentPath) {
			const parent = topicsById[topic.parentId];
			if (parent) {
				path = getPath(parent, topicsById, idsToPath);
				idsToPath[topic.parentId] = path;
			}
		}
	}
	return path.concat([topic.url]);
}

export async function showTopicsByUrls(...urls: string[]) {
	const res = await fetch(`${base}/api/creator/topics/url/${urls.join('/')}`);
	if (!res.ok) {
		throw await res.json();
	}
	const topics: Topic[] = await res.json();
	topicsWritable.update((state) => {
		topics.forEach((topic) => {
			addOrUpdate(state, topic);
		});
		return state;
	});
	return topics;
}

export async function showTopics(parentId?: string) {
	const res = await fetch(`${base}/api/creator/topics${parentId ? `?parentId=${parentId}` : ''}`);
	if (!res.ok) {
		throw await res.json();
	}
	const topics: Topic[] = await res.json();
	topicsWritable.update((state) => {
		topics.forEach((topic) => addOrUpdate(state, topic));
		return state;
	});
	return topics;
}

export async function createTopic(body: Partial<Topic>) {
	const res = await fetch(`${base}/api/creator/topics`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const topic: Topic = await res.json();
	topicsWritable.update((topics) => {
		topics.push(topic);
		return topics;
	});
	return topic;
}

export async function updateTopic(id: string, body: Partial<Topic>) {
	const res = await fetch(`${base}/api/creator/topics/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const topic: Topic = await res.json();
	topicsWritable.update((topics) => addOrUpdate(topics, topic));
	return topic;
}

export async function deleteTopic(id: string) {
	const res = await fetch(`${base}/api/creator/topics/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	topicsWritable.update((topics) => {
		const index = topics.findIndex((topic) => topic.id === id);
		if (index !== -1) {
			topics.splice(index, 1);
		}
		return topics;
	});
}

function addOrUpdate(topics: Topic[], topic: Topic): Topic[] {
	const index = topics.findIndex((t) => t.id === topic.id);
	if (index === -1) {
		topics.push(topic);
	} else {
		topics[index] = topic;
	}
	return topics;
}
