import type { Section } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '../utils';

export type StateSection = Section & {
	lesson: {
		url: string;
		name: string;
		chapter: {
			url: string;
			name: string;
			course: { url: string; name: string; department: { url: string; name: string } };
		};
	};
};

export const sectionsWritable = writable<Array<StateSection>>([]);

export const sections = derived(sectionsWritable, (sections) => sections.slice());
export const sectionsById = derived(sectionsWritable, (sections) =>
	sections.reduce((byId, section) => {
		byId[section.id] = section;
		return byId;
	}, {} as { [id: string]: StateSection })
);
export const sectionsByUrl = derived(sectionsWritable, (sections) =>
	sections.reduce((byUrl, section) => {
		const byDepartmentUrl =
			byUrl[section.lesson.chapter.course.department.url] ||
			(byUrl[section.lesson.chapter.course.department.url] = {});
		const byCourseUrl =
			byDepartmentUrl[section.lesson.chapter.course.url] ||
			(byDepartmentUrl[section.lesson.chapter.course.url] = {});
		const byChapterUrl =
			byCourseUrl[section.lesson.chapter.url] || (byCourseUrl[section.lesson.chapter.url] = {});
		const byLessonUrl = byChapterUrl[section.lesson.url] || (byChapterUrl[section.lesson.url] = []);
		byLessonUrl.push(section);
		return byUrl;
	}, {} as { [departmentUrl: string]: { [courseUrl: string]: { [chapterUrl: string]: { [lessonId: string]: StateSection[] } } } })
);

export async function showSections(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/departments/${departmentUrl}/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${lessonUrl}/sections`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const sections: Array<StateSection> = (await res.json()).map(sectionFromJSON);
	sectionsWritable.update((state) =>
		sections.reduce((state, section) => addOrUpdate(state, section), state.slice())
	);
	return sections;
}

function addOrUpdate(state: Array<StateSection>, section: StateSection): Array<StateSection> {
	const index = state.findIndex((c) => c.id === section.id);
	if (index === -1) {
		state.push(section);
	} else {
		state[index] = section;
	}
	return state;
}

export function sectionFromJSON(section: StateSection): StateSection {
	return {
		...section,
		releasedAt: section.releasedAt ? new Date(section.releasedAt) : section.releasedAt,
		createdAt: new Date(section.createdAt),
		updatedAt: new Date(section.updatedAt)
	};
}
