import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";
import SettingsPopover from "./SettingsPopover";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";

//Utils
import { getSchedules, useRelatedState } from "../utils";

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

const entities = {
  course: { key: "id", serializers },
  section: {
    key: "id",
    references: [{ tableName: "course", key: "course_id" }],
  },
};

export default function CoursePicker() {
  const coursesData = useRelatedState(entities, serializers);

  useEffect(() => {
    let coursesObject = coursesData.serialize("course", "toSend");
    getSchedules(coursesObject);
  }, [JSON.stringify(coursesData.serialize("course"))]);

  const onAddCourse = (newCourse) => {
    if (!newCourse || !newCourse.id) return null;

    newCourse.sections = newCourse.sections.map((section) => ({
      selected: true,
      ...section,
    }));

    coursesData.setRecord("course", newCourse);
  };

  const onRemoveCourse = (removedCourse) => {
    coursesData.deleteRecord("course", removedCourse.id);
  };

  const onCourseChange = (course) => {
    coursesData.setRecord("course", course);
  };

  return (
    <StyledCoursePicker>
      <CourseFilter onAddCourse={onAddCourse} />
      <div className="table-container">
        <CourseTable
          change={coursesData.serialize("course").length}
          isLoading={false}
          courses={formatCourses(coursesData.serialize("course"))}
          headerCells={headerCells}
          onRemoveCourse={onRemoveCourse}
          onCourseChange={onCourseChange}
        />
      </div>
    </StyledCoursePicker>
  );
}
