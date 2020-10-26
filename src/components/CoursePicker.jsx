import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";
import SettingsPopover from "./SettingsPopover";

// Helpers
import { getCourses } from "../utils";

const StyledCoursePicker = styled.div`
  width: 400px;
`;

const headerCells = [
  { display: "Curso", accessor: "codeName" },
  { display: "Ciclo", accessor: "semester" },
  { display: "Créditos", accessor: "credits" },
  { display: "Sección", accessor: "settings" },
];

const formatCourses = (courses) => {
  return courses.map((course) => ({
    codeName: `${course.name} (${course.code})`,
    settings: <SettingsPopover key={course.id} course={course} />,
    ...course,
  }));
};

export default function CoursePicker() {
  const [courses, setCourses] = useState([]);

  const onAddCourse = (newCourse) => {
    if (
      !newCourse ||
      !newCourse.id ||
      courses.some((course) => course.id === newCourse.id)
    )
      return null;
    setCourses((prevState) => [newCourse, ...prevState]);
  };

  return (
    <StyledCoursePicker>
      <CourseFilter onAddCourse={onAddCourse} />
      <div className="table-container">
        <CourseTable
          change={courses.length}
          isLoading={false}
          courses={formatCourses(courses)}
          headerCells={headerCells}
        />
      </div>
    </StyledCoursePicker>
  );
}
