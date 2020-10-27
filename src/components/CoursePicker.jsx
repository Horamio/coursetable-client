import React, { useState } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";
import SettingsPopover from "./SettingsPopover";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";

const StyledCoursePicker = styled.div`
  width: 470px;
`;

const headerCells = [
  { display: "Curso", accessor: "codeName" },
  { display: "Ciclo", accessor: "semester" },
  { display: "Créditos", accessor: "credits" },
  { display: "Sección", accessor: "settings" },
  { display: "", accessor: "remove" },
];

const formatCourses = (courses) => {
  return courses.map((course) => ({
    codeName: `${course.name} (${course.code})`,
    settings: ({ onCourseChange }) => (
      <SettingsPopover
        key={course.id}
        course={course}
        onCourseChange={onCourseChange}
      />
    ),
    remove: ({ onClick }) => (
      <IconButton onClick={onClick} edge="end" aria-label="comments">
        <RemoveIcon />
      </IconButton>
    ),
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

    newCourse.sections = newCourse.sections.map((section) => ({
      selected: true,
      ...section,
    }));

    setCourses((prevState) => [newCourse, ...prevState]);
  };

  const onRemoveCourse = (removedCourse) => {
    setCourses((prevState) => {
      return prevState.filter((course) => course.id !== removedCourse.id);
    });
  };

  const onCourseChange = (course) => {
    setCourses((prevState) => {
      let courseIndex = prevState.findIndex(
        (courseDup) => courseDup.id === course.id
      );
      return update(prevState, { [courseIndex]: { $set: course } });
    });
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
          onRemoveCourse={onRemoveCourse}
          onCourseChange={onCourseChange}
        />
      </div>
    </StyledCoursePicker>
  );
}
