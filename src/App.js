import styled from "@emotion/styled";
import React from "react";
import CoursePicker from "./components/CoursePicker";

const StyledDiv = styled.div`
  display: flex;
`;

function App() {
  return (
    <div className="App">
      <h1>Horamio</h1>

      <StyledDiv>
        <CoursePicker />
        <CoursePicker />
      </StyledDiv>
    </div>
  );
}

export default App;
