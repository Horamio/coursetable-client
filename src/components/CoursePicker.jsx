import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useQuery } from "react-query";

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
  const [params, setParams] = useState([]);

  const {
    isLoading: isCoursesLoading,
    data: courses,
    refetch,
  } = useQuery("courses", () => getCourses(...params));

  const onParamsChange = (college, faculty, speciality, semester) => {
    const collegeId = college && college.id;
    const facultyId = faculty && faculty.id;
    const specialityId = speciality && speciality.id;

    setParams(() => [collegeId, facultyId, specialityId, semester]);
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);

  if (isCoursesLoading) return null;

  return (
    <StyledCoursePicker>
      <CourseFilter onParamsChange={onParamsChange} />
      <div className="table-container">
        <CourseTable
          change={JSON.stringify(params)}
          isLoading={isCoursesLoading}
          courses={formatCourses(courses)}
          headerCells={headerCells}
        />
      </div>
    </StyledCoursePicker>
  );
}
