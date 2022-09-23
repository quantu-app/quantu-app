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
    apiDepartmentChallengePath,
    apiDepartmentChallengesPath,
    apiDepartmentCourseChapterLessonPath,
    apiDepartmentCourseChapterLessonsPath,
    apiAssetPath,
    apiChallengesPath,
    apiResultsChallengePath,
    apiResultsChallengeExplainPath,
    apiDepartmentPath,
    apiDepartmentsPath,
    apiDepartmentCourseChapterPath,
    apiDepartmentCourseChaptersPath
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

    describe("departments", () => {

        test('apiDepartmentsPath', () => {
            expect(apiDepartmentsPath()).toEqual("/api/departments");
        });

        test('apiDepartmentPath', () => {
            expect(apiDepartmentPath("mathematics")).toEqual("/api/departments/mathematics");
        });

        test('apiDepartmentCourseChapterPath', () => {
            expect(apiDepartmentCourseChapterPath("math", "functions", "one-to-one")).toEqual(
                "/api/departments/math/courses/functions/chapters/one-to-one"
            );
        });

        test('apiDepartmentCourseChaptersPath', () => {
            expect(apiDepartmentCourseChaptersPath("math", "functions")).toEqual(
                "/api/departments/math/courses/functions/chapters"
            );
        })

        test('apiDepartmentCourseChapterLessonLessonBlockPath', () => {
            expect(apiDepartmentCourseChapterLessonLessonBlockPath(
                "123",
                "456",
                "789",
                "111",
                "222"
            )).toEqual("/api/departments/123/courses/456/chapters/789/lessons/111/lesson-blocks/222");
        });

        test("apiDepartmentChallengePath", () => {
            expect(apiDepartmentChallengePath("math", "integrate-two-numbers")).toEqual(
                "/api/departments/math/challenges/integrate-two-numbers"
            )
        });

        test("apiDepartmentChallengesPath", () => {
            expect(apiDepartmentChallengesPath("math")).toEqual(
                "/api/departments/math/challenges"
            )
        });

        test("apiDepartmentCourseChapterLessonPath", () => {
            expect(apiDepartmentCourseChapterLessonPath("math", "calculus-1", "limits", "concept-of-limit")).toEqual(
                "/api/departments/math/courses/calculus-1/chapters/limits/lessons/concept-of-limit"
            )
        });

        test("apiDepartmentCourseChapterLessonsPath", () => {
            expect(apiDepartmentCourseChapterLessonsPath("math", "calculus-1", "limits")).toEqual(
                "/api/departments/math/courses/calculus-1/chapters/limits/lessons"
            )
        });
    });

    test("apiChallengesPath", () => {
        expect(apiChallengesPath()).toEqual("/api/challenges");
    });

    test("apiResultsChallengePath", () => {
        expect(apiResultsChallengePath("123")).toEqual("/api/results/challenge/123");
    });

    test("apiResultsChallengeExplainPath", () => {
        expect(apiResultsChallengeExplainPath("123")).toEqual("/api/results/challenge/123/explain");
    });

    test('apiAssetPath', () => {
        expect(apiAssetPath("1001")).toEqual("/api/assets/1001");
    });
});