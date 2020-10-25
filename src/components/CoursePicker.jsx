import React from "react";
import styled from "@emotion/styled";
import { useQuery } from "react-query";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";

// Helpers
import { getCourses } from "../utils";

const StyledCoursePicker = styled.div`
  display: flex;
  justify-content: space-between;
  .table-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

export default function CoursePicker() {
  const { isLoading: isCoursesLoading, data: courses } = useQuery(
    "courses",
    () => getCourses()
  );

  if (isCoursesLoading) return null;

  return (
    <StyledCoursePicker>
      <CourseFilter />
      <div className="table-container">
        <CourseTable isLoading={isCoursesLoading} courses={courses} />
      </div>
    </StyledCoursePicker>
  );
}
