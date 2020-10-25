import React from "react";
import styled from "@emotion/styled";

// Components
import CoursePicker from "./components/CoursePicker";

const StyledContainer = styled.div`
  padding: 0px 40px;
`;

function App() {
  return (
    <StyledContainer className="App">
      <h1>Horamio</h1>

      <CoursePicker />
    </StyledContainer>
  );
}

export default App;
