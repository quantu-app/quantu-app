import type { Section } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

export type StateSection = Section & {
	lesson: { url: string; name: string };
};

const sectionsWritable = writable<Array<StateSection>>([]);

export const sections = derived(sectionsWritable, (sections) => sections);

export const sectionsById = derived(sectionsWritable, (sections) =>
	sections.reduce((byId, section) => {
		byId[section.id] = section;
		return byId;
	}, {} as { [id: string]: StateSection })
);
export const sectionsByLessonId = derived(sectionsWritable, (sections) =>
	sections.reduce((byParentId, section) => {
		const parentStateSections = byParentId[section.lessonId] || (byParentId[section.lessonId] = []);
		parentStateSections.push(section);
		return byParentId;
	}, {} as { [lessonId: string]: Array<StateSection> })
);

export async function showSectionById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/sections/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const section: StateSection = sectionFromJSON(await res.json());
	sectionsWritable.update((state) => addOrUpdate(state.slice(), section));
	return section;
}

export async function validSectionUrl(
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	url: string
) {
	const res = await fetch(
		`${base}/api/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${lessonUrl}/sections/${url}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		return true;
	} else {
		return false;
	}
}

export async function showSections(lessonId: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/lessons/${lessonId}/sections`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const sections: Array<StateSection> = (await res.json()).map(sectionFromJSON);
	sectionsWritable.update((state) =>
		sections.reduce((state, section) => addOrUpdate(state, section), state.slice())
	);
	return sections;
}

export async function createSection(lessonId: string, body: Partial<StateSection>) {
	const res = await fetch(`${base}/api/creator/lessons/${lessonId}/sections`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const section: StateSection = sectionFromJSON(await res.json());
	sectionsWritable.update((state) => addOrUpdate(state.slice(), section));
	return section;
}

export async function updateSection(id: string, body: Partial<StateSection>) {
	const res = await fetch(`${base}/api/creator/sections/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const section: StateSection = sectionFromJSON(await res.json());
	sectionsWritable.update((state) => addOrUpdate(state.slice(), section));
	return section;
}

export async function deleteSection(id: string) {
	const res = await fetch(`${base}/api/creator/sections/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	sectionsWritable.update((state) => {
		const index = state.findIndex((section) => section.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(sections: StateSection[], section: StateSection): StateSection[] {
	const index = sections.findIndex((t) => t.id === section.id);
	if (index === -1) {
		sections.push(section);
	} else {
		sections[index] = section;
	}
	return sections;
}

function sectionFromJSON(section: StateSection): StateSection {
	return {
		...section,
		releasedAt: section.releasedAt ? new Date(section.releasedAt) : null,
		createdAt: new Date(section.createdAt),
		updatedAt: new Date(section.updatedAt)
	};
}
