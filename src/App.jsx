import React, { createContext, useState } from "react";
import SchoolCatalog from "./SchoolCatalog";
import Header from "./Header";
import ClassSchedule from "./ClassSchedule";

export const CourseContext = createContext();

export default function App() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const enrollCourse = (course) => {
    setEnrolledCourses([...enrolledCourses, course]);
  };

  const dropCourse = (courseNumber) => {
    setEnrolledCourses(
      enrolledCourses.filter((course) => course.courseNumber !== courseNumber)
    );
  };

  return (
    <CourseContext.Provider
      value={{ enrolledCourses, enrollCourse, dropCourse }}
    >
      <div>
        <Header courseCount={enrolledCourses.length} />
        <SchoolCatalog />
        <ClassSchedule />
      </div>
    </CourseContext.Provider>
  );
}
