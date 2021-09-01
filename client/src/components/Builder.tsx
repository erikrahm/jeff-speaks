import { map } from "lodash";
import React, { useContext } from "react";
import styled from "styled-components";

import { AppContext } from "../appState";
import CharacterBuilder from "./CharacterBuilder";

const BuilderContainer = styled.div`
  margin-right: 20px;
  border-radius: 8px;
  width: 200px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BuilderHeader = styled.h2`
  color: steelblue;
  margin: 0 0 10px 0;
`;

const Builder: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <BuilderContainer>
      {map(state.characters, (character) => (
        <CharacterBuilder character={character} />
      ))}
    </BuilderContainer>
  );
};

export default Builder;
