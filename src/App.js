import React from "react";
import styled from "@emotion/styled";

// Components
import CoursePicker from "./components/CoursePicker";
import WeekScheduler from "./components/WeekScheduler";

const StyledContainer = styled.div`
  padding: 0px 40px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  .schedule-container {
    display: flex;
  }
`;

function App() {
  return (
    <StyledContainer className="App">
      <h1>Horamio</h1>
      <div className="schedule-container">
        <CoursePicker />
        <WeekScheduler />
      </div>
    </StyledContainer>
  );
}

export default App;
