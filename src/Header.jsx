import React, { useContext } from "react";
import logo from "./assets/logo.png";
import { CourseContext } from "./App";

export default function Header() {
  const { enrolledCourses } = useContext(CourseContext);

  return (
    <div className="header">
      <img src={logo} alt="logo" className="logo" />
      <div className="enrollment">
        Classes Enrolled: {enrolledCourses.length}
      </div>
    </div>
  );
}
