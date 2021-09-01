import { map } from "lodash";
import React, { useContext, useState } from "react";
import styled from "styled-components";

import { AppContext } from "../appState";

const SidebarContainer = styled.div`
  background: #f1f1f1;
  padding: 10px 15px;
  border-radius: 8px;
  width: 200px;
  display: flex;
  flex-direction: column;
  height: fit-content;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  pre {
    font-size: 14px;
    color: darkgray;
    margin: 0;
    padding: 0;

    span {
      cursor: hover;
    }

    &:hover {
      color: steelblue;
    }
  }
`;

const SidebarHeader = styled.h4`
  margin: 0;
  padding: 0;
  color: steelblue;
`;

const SidebarTop = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid darkgray;
  color: steelblue;
  margin: 10px 0;
  padding-bottom: 5px;
`;

const AddButton = styled.button`
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
`;

const CharacterLink = styled.a`
  color: darkgray;

  &:focus,
  &:active {
    color: blue;
  }

  &:hover {
    color: steelblue;
  }
`;

const CharacterIDInput = styled.input`
  text-transform: uppercase;
`;

const AddingCharacter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  input {
    padding: 2px 5px;
    margin-bottom: 2px;
  }

  button {
    text-transform: uppercase;
    background: steelblue;
    color: #ffffff;
    cursor: pointer;
    font-size: 12px;
    border: none;
    padding: 5px;
    font-weight: bold;
  }
`;

const emptyCharacter = {
  name: "",
  displayName: "",
};

const Sidebar: React.FC = () => {
  const [editing, updateEditing] = useState("");
  const [adding, updateAdding] = useState(false);
  const [addingCharacter, updateAddingCharacter] = useState(false);
  const [characterShit, updateCharacterShit] = useState(emptyCharacter);
  const { state, dispatch } = useContext(AppContext);

  const addCategory = () => {
    updateAdding(true);
  };

  const confirmCharacter = () => {
    console.log("UGH", characterShit);
    const newCharacter = {
      name: characterShit.name,
      displayName: characterShit.displayName,
      default: `DLG_${characterShit.name}1`,
    };

    const newDialogue = {
      name: `DLG_${characterShit.name}1`,
      character: characterShit.name,
      dialogue: `Hey here's a first bit of dialogue for '${characterShit.displayName}' to say!`,
      default: true,
    };
    dispatch({ type: "addCharacter", payload: newCharacter });
    dispatch({ type: "addDialogue", payload: newDialogue });
    cancelCharacter();
  };

  const addCharacter = () => {
    updateAddingCharacter(true);
  };

  const confirmAdd = (event: any) => {
    const newCategory = event.currentTarget.value;
    if (newCategory.length)
      dispatch({ type: "addCategory", payload: newCategory });
    updateAdding(false);
  };

  const handleEnter = (event: any) => {
    if (event.keyCode == 13) confirmAdd(event);
  };

  const updateCategory = (event: any) => {
    if (event.currentTarget.innerText === editing) return;
    dispatch({
      type: "editCategory",
      payload: event.currentTarget.innerText,
      edit: editing,
    });
    updateEditing("");
  };

  const cancelCharacter = () => {
    updateAddingCharacter(false);
    updateCharacterShit(emptyCharacter);
  };

  return (
    <SidebarContainer>
      <SidebarTop>
        <SidebarHeader>Categories</SidebarHeader>
        <AddButton onClick={addCategory}>+</AddButton>
      </SidebarTop>
      <OptionsContainer>
        {adding && (
          <input
            type="text"
            onBlur={confirmAdd}
            onKeyDown={handleEnter}
            autoFocus
          />
        )}
        {state.categories.map((category) => (
          <pre>
            {editing === category ? (
              <span onBlur={updateCategory} role="textbox" contentEditable>
                {category}
              </span>
            ) : (
              <span onMouseDown={() => updateEditing(category)}>
                {category}
              </span>
            )}
          </pre>
        ))}
      </OptionsContainer>
      <SidebarTop>
        <SidebarHeader>Characters</SidebarHeader>
        {addingCharacter ? (
          <AddButton onClick={cancelCharacter}>X</AddButton>
        ) : (
          <AddButton onClick={addCharacter}>+</AddButton>
        )}
      </SidebarTop>
      <OptionsContainer>
        {addingCharacter && (
          <AddingCharacter>
            <CharacterIDInput
              type="text"
              value={characterShit.name}
              onKeyDown={handleEnter}
              autoFocus
              placeholder="ID"
              onChange={(event) =>
                updateCharacterShit({
                  ...characterShit,
                  name: event.currentTarget.value.toUpperCase(),
                })
              }
            />
            <input
              type="text"
              value={characterShit.displayName}
              onKeyDown={handleEnter}
              placeholder="Character Name"
              onChange={(event) =>
                updateCharacterShit({
                  ...characterShit,
                  displayName: event.currentTarget.value,
                })
              }
            />
            <button onClick={confirmCharacter}>Save</button>
          </AddingCharacter>
        )}
        {map(state.characters, (character) => (
          <pre>
            <CharacterLink href={`#${character.name}`}>
              {character.displayName}
            </CharacterLink>
          </pre>
        ))}
      </OptionsContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
