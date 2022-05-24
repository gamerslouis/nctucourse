export const makeKey = (course) => `${course.sem}_${course.id}`;

export const shouldMerge = (course, oldCourses) =>
  oldCourses.hasOwnProperty(makeKey(course)) &&
  oldCourses[makeKey(course)].score !== "" &&
  course.score !== oldCourses[makeKey(course)].score;
