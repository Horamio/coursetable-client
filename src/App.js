import React from "react";
import styled from "@emotion/styled";

// Components
import CoursePicker from "./components/CoursePicker";

const StyledContainer = styled.div`
  padding: 0px 40px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
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
