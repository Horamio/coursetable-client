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
  course: {
    key: "id",
    serializers: {
      toSend: (item, serialize) => ({
        id: item.id,
        code: item.code,
        sections: serialize("section", "toSend", item.sections),
        // sections: item.sections, // this should not be possible, we are adding sections to db
      }),
      toShow: (item, serialize) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        credits: item.credits,
        semester: item.semester,
        // sections: serialize("section", "toShow", item.sections),
        sections: item.sections,
      }),
    },
  },
  section: {
    key: "id",
    references: [{ tableName: "course", key: "course_id" }],
    serializers: {
      toSend: (item) => ({
        id: item.id,
        code: item.code,
      }),
      toShow: (item) => ({
        id: item.id, // is necesary to have the key, solve this, we are modifying state on setting, should be merge if aready exist
        code: item.code,
        selected: item.selected,
      }),
    },
  },
};

export default function CoursePicker() {
  const coursesData = useRelatedState(entities, serializers);

  // useEffect(() => {
  //   let coursesObject = coursesData.serialize("course", "toSend");
  //   getSchedules(coursesObject);
  // }, [JSON.stringify(coursesData.serialize("course"))]);

  console.log({
    db: coursesData.database,
    ser: formatCourses(coursesData.serialize("course", "toShow")),
  });

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
          change={coursesData.serialize("course", "toShow").length}
          isLoading={false}
          // courses={formatCourses(coursesData.serialize("course"))}
          courses={formatCourses(coursesData.serialize("course", "toShow"))}
          // courses={[]}
          headerCells={headerCells}
          onRemoveCourse={onRemoveCourse}
          onCourseChange={onCourseChange}
        />
      </div>
    </StyledCoursePicker>
  );
}
