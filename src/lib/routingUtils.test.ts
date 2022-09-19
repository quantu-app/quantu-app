import {
    // frontend imports
    departmentPath,
    departmentCoursePath,
    departmentCourseChapterLessonPath,
    departmentCourseChapterLessonLessonBlockPath,
    departmentChallengePath,
    departmentChallengeReviewPath,
    challengesPath,
    challengesAllPath,
    coursesPath,

    // api imports
    apiDepartmentCourseChapterLessonLessonBlockPath,
    apiAssetPath
} from './routingUtils';

describe('departments', () => {
    test('departmentPath', () => {
        expect(departmentPath("mathematics")).toEqual("/d/mathematics");
    });
    test('departmentCoursePath', () => {
        expect(departmentCoursePath("mathematics", "intro-to-functions")).toEqual(
            "/d/mathematics/c/intro-to-functions"
        );
    });
    test('departmentCourseChapterLessonPath', () => {
        expect(departmentCourseChapterLessonPath(
            "mathematics",
            "intro-to-functions",
            "functions",
            "function-notation"
        )).toEqual(
            "/d/mathematics/c/intro-to-functions/ch/functions/lessons/function-notation"
        );
    });

    test('departmentCourseChapterLessonLessonBlockPath', () => {
        expect(departmentCourseChapterLessonLessonBlockPath(
            "mathematics",
            "intro-to-functions",
            "functions",
            "function-notation",
            "mappings"
        )).toEqual(
            "/d/mathematics/c/intro-to-functions/ch/functions/lessons/function-notation/lb/mappings"
        );
    });

    test('departmentChallengePath', () => {
        expect(departmentChallengePath("mathematics", "a-puzzling-integral")).toEqual(
            "/d/mathematics/challenges/a-puzzling-integral"
        )
    });

    test('departmentChallengeReviewPath', () => {
        expect(departmentChallengeReviewPath("mathematics", "a-puzzling-integral")).toEqual(
            "/d/mathematics/challenges/a-puzzling-integral/review"
        )
    });
});

describe("challenges", () => {
    test('challengesPath', () => {
        expect(challengesPath()).toEqual("/challenges");
    });

    test('challengesAllPath', () => {
        expect(challengesAllPath()).toEqual("/challenges/all");
    });
});

describe("courses", () => {
    test('coursesPath', () => {
        expect(coursesPath()).toEqual("/courses");
    })
});


/**
 * API PATHS
 */

describe("api", () => {
    test('apiDepartmentCourseChapterLessonLessonBlockPath', () => {
        expect(apiDepartmentCourseChapterLessonLessonBlockPath(
            "123",
            "456",
            "789",
            "111",
            "222"
        )).toEqual("/api/departments/123/courses/456/chapters/789/lessons/111/lesson-blocks/222");
    });

    test('apiAssetPath', () => {
        expect(apiAssetPath("1001")).toEqual("/api/assets/1001");
    });
});