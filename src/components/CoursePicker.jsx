import React from "react";
import styled from "@emotion/styled";
import { useQuery } from "react-query";

// Components
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";

// Helpers
import request from "../utils/services";

const getCourses = () => {
  return request("/courses");
};

const StyledDiv = styled.div`
  display: flex;
  padding: 50px;
`;

export default function CoursePicker() {
  const { isLoading: isCoursesLoading, data: courses } = useQuery(
    "courses",
    getCourses
  );

  if (isCoursesLoading) return null;

  return (
    <StyledDiv>
      <CourseFilter />
      <CourseTable isLoading={isCoursesLoading} courses={courses} />
    </StyledDiv>
  );
}
