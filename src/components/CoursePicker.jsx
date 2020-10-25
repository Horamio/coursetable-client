import React from "react";
import styled from "@emotion/styled";
import CourseTable from "./CourseTable";
import CourseFilter from "./CourseFilter";

const StyledDiv = styled.div`
  display: flex;
  padding: 50px;
`;

export default function CoursePicker() {
  return (
    <StyledDiv>
      <CourseFilter />
      <CourseTable />
    </StyledDiv>
  );
}
