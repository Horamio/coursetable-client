import React, { useState } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";
import SettingsPopover from "./SettingsPopover";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";

//Utils
import { useRelatedState } from "../utils";

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

const serializers = {
  toSend: (item) => ({
    id: item.id,
    code: item.code,
  }),
};

export default function CoursePicker() {
  const courses = useRelatedState([], "id", serializers);

  const onAddCourse = (newCourse) => {
    if (!newCourse || !newCourse.id) return null;

    newCourse.sections = newCourse.sections.map((section) => ({
      selected: true,
      ...section,
    }));

    courses.setRecord(newCourse);
  };

  const onRemoveCourse = (removedCourse) => {
    courses.deleteRecord(removedCourse.id);
  };

  const onCourseChange = (course) => {
    courses.setRecord(course);
  };

  return (
    <StyledCoursePicker>
      <CourseFilter onAddCourse={onAddCourse} />
      <div className="table-container">
        <CourseTable
          change={courses.length}
          isLoading={false}
          courses={formatCourses(courses.serialize())}
          headerCells={headerCells}
          onRemoveCourse={onRemoveCourse}
          onCourseChange={onCourseChange}
        />
      </div>
    </StyledCoursePicker>
  );
}
