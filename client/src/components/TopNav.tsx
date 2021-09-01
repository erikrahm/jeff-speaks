import React, { useContext } from "react";
import styled from "styled-components";

import { AppContext } from "../appState";

const TopNavContainer = styled.div`
  width: 1024px;
  max-width: 1024px;
  background: steelblue;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  box-sizing: border-box;
`;

const Button = styled.button`
  cursor: pointer;
  color: #ffffff;
  background-color: steelblue;
  font-size: 1em;
  padding: 0.5em 1em;
  border: 2px solid #ffffff;
  border-radius: 3px;
  display: block;

  &:hover {
    background-color: #ffffff;
    color: steelblue;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direciton: row;
  justify-content: space-between;
`;

const OptionsHeader = styled.h1`
  color: #ffffff;
  font-size: 22px !important;
  text-transform: uppercase;
  margin: 0;
`;

const TopNavWrapper = styled.div`
  width: 1024px;
  background: #ffffff;
  position: fixed;
`;

const TopNav: React.FC = () => {
  const { dispatch } = useContext(AppContext);

  const saveToJSON = () => {
    dispatch({ type: "saveFiles", payload: "" });
  };

  return (
    <TopNavWrapper>
      <TopNavContainer>
        <OptionsHeader>Jeff Speaks</OptionsHeader>
        <OptionsContainer>
          <Button onClick={saveToJSON}>Export to JSON</Button>
        </OptionsContainer>
      </TopNavContainer>
    </TopNavWrapper>
  );
};

export default TopNav;
