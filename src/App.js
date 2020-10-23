import styled from "@emotion/styled";
import React from "react";
import CourseDetails from "./components/CourseDetails";
import CoursePicker from "./components/CoursePicker";
import CourseCalendar from "./components/CourseCalendar";
import CourseTable from "./components/CourseTable";

const StyledDiv = styled.div`
  display: flex;
  padding: 50px;
`;

function App() {
  return (
    <div className="App">
      <h1>Horamio</h1>

      <StyledDiv>
        <CoursePicker />
        <CourseDetails />
      </StyledDiv>
      <StyledDiv>
        <CourseTable />
        <CourseCalendar />
      </StyledDiv>
    </div>
  );
}

export default App;
