import React, { useState, useEffect, useContext } from "react";
import { CourseContext } from "./App";

export default function SchoolCatalog() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const { enrolledCourses, enrollCourse } = useContext(CourseContext);

  const isEnrolled = (courseNumber) => {
    return enrolledCourses.some(
      (course) => course.courseNumber === courseNumber
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses.json");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase();
    return (
      course.courseNumber.toLowerCase().includes(search) ||
      course.courseName.toLowerCase().includes(search)
    );
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (
      ["trimester", "semesterCredits", "totalClockHours"].includes(
        sortConfig.key
      )
    ) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return "";
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1 || totalPages === 0;

  const currentCourses = sortedCourses.slice(startIndex, endIndex);

  if (error) {
    return (
      <div className="school-catalog">
        <h1>School Catalog</h1>
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="school-catalog">
        <h1>School Catalog</h1>
        <div>Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="school-catalog">
      <h1>School Catalog</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th
              onClick={() => sortData("trimester")}
              style={{ cursor: "pointer" }}
            >
              Trimester{getSortIndicator("trimester")}
            </th>
            <th
              onClick={() => sortData("courseNumber")}
              style={{ cursor: "pointer" }}
            >
              Course Number{getSortIndicator("courseNumber")}
            </th>
            <th
              onClick={() => sortData("courseName")}
              style={{ cursor: "pointer" }}
            >
              Course Name{getSortIndicator("courseName")}
            </th>
            <th
              onClick={() => sortData("semesterCredits")}
              style={{ cursor: "pointer" }}
            >
              Semester Credits{getSortIndicator("semesterCredits")}
            </th>
            <th
              onClick={() => sortData("totalClockHours")}
              style={{ cursor: "pointer" }}
            >
              Total Clock Hours{getSortIndicator("totalClockHours")}
            </th>
            <th>Enroll</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course) => (
            <tr key={course.courseNumber}>
              <td>{course.trimester}</td>
              <td>{course.courseNumber}</td>
              <td>{course.courseName}</td>
              <td>{course.semesterCredits}</td>
              <td>{course.totalClockHours}</td>
              <td>
                <button
                  onClick={() => enrollCourse(course)}
                  disabled={isEnrolled(course.courseNumber)}
                >
                  {isEnrolled(course.courseNumber) ? "Enrolled" : "Enroll"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={isFirstPage}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={isLastPage}>
          Next
        </button>
      </div>
    </div>
  );
}
