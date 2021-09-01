import { filter, keyBy, pickBy, reduce } from "lodash";
import React, { useContext, useState, useEffect, useRef } from "react";
import Select from "react-virtualized-select";
import styled from "styled-components";

import { AppContext, structureData } from "../appState";

const CharacterContainer = styled.div`
  background: #f1f1f1;
  padding: 10px 15px 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const CharacterName = styled.h4`
  margin: 5px 0 0 0;
`;

const DialogueHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid darkgray;
  margin-bottom: 10px;

  pre {
    color: darkgray;
    border-right: 1px solid darkgray;
    padding: 10px;
    margin: 0;

    &:last-of-type {
      border: none;
    }

    &:first-of-type {
      border-right: 1px solid darkgray;
    }
  }
`;

const DialogueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid darkgray;
  margin-top: 20px;
`;

const ResponsesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 20px 10px;
  align-items: center;
`;

const ResponseContainer = styled.div`
  margin-top: 10px;
  border: 1px solid darkgray;
  width: 100%;

  &:last-of-type {
    margin-bottom: 10px;
  }
`;

const True = styled.span`
  color: darkolivegreen;

  /* If you want to implement it in very old browser-versions */
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* The rule below is not implemented in browsers yet */
  -o-user-select: none;

  /* The rule below is implemented in most browsers by now */
  user-select: none;
`;

const False = styled.span`
  color: palevioletred;

  /* If you want to implement it in very old browser-versions */
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* The rule below is not implemented in browsers yet */
  -o-user-select: none;

  /* The rule below is implemented in most browsers by now */
  user-select: none;
`;

const DialogueParagraph = styled.p`
  padding: 10px;
  margin: 0;
`;

const DialogueID = styled.pre`
  cursor: text;
`;

const EditButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 10px;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 1px;

  &:hover {
    color: #ffffff;
    background: steelblue;
  }
`;

const FakeInput = styled.span`
  background: #ffffff;
  border-right: 1px solid darkgray;
  text-align: left;
  align-items: center;
  padding: 12px 10px;
  font-size: 12px;
  text-transform: uppercase;
  min-width: 50px;
  letter-spacing: 0.5px;
`;

const DialogueEditArea = styled.textarea`
  width: 100%;
  border: 1px solid darkgray;
  font-family: "Helvetica Neue" !important;
  font-size: 16px;
`;

const SelectContainer = styled(Select)`
  width: 200px;
`;

const Selections = styled.div`
  position: absolute;
  background: #ffffff;
  display: flex;
  border: 1px solid darkgray;
  flex-direction: column;
  font-size: 12px;
  padding: 9px 8px 8px;
  top: -1px;
  right: 100%;

  .selectionLabel {
    display: flex;
    width: 280px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;

    span {
      font-weight: bold;
      color: steelblue;
    }

    .Select-value-label {
      color: #aaaaaa !important;
      font-weight: 500;
    }
  }
`;

const EditWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const DefaultLael = styled.label`
  display: flex;
  align-items: center;

  input {
    margin-left: 5px;
  }
`;

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h4 {
    margin: 0;
  }
`;

const AddButton = styled.button`
  background: steelblue;
  color: #ffffff;
  border: 2px solid steelblue;
  padding: 5px 20px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background: #ffffff;
    color: steelblue;
  }
`;

const EditableWrapper = styled.div`
  position: relative;
`;

const ResponseNameWrapper = styled.div`
  display: flex;
`;

interface ResponseRender extends DialogueResponse {
  conditionMet: boolean;
}

interface DialogueRender extends Dialogue {
  responses: ResponseRender[];
}

interface CharacterProps {
  character: Character;
}

const CharacterBuilder: React.FC<CharacterProps> = ({ character }) => {
  const { state, dispatch } = useContext(AppContext);
  const [editing, updateEditing] = useState("");
  const [characterState, updateCharacterState] = useState<DialogueRender[]>();

  useEffect(() => {
    updateCharacterState(getDialogue());
  }, [state]);

  const getConditional = (cID: string) =>
    state.conditions[cID] || {
      name: "NONE",
      met: true,
    };

  const getResponses = (dID: string): DialogueResponse[] =>
    Object.values(pickBy(state.responses, (res) => res.parent === dID));

  const getDialogue = () =>
    reduce(
      state.dialogue,
      (results, dialogue, key) => {
        if (dialogue.character === character.name) {
          results = [
            ...results,
            {
              ...dialogue,
              responses: getResponses(dialogue.name).map((resp) => ({
                ...resp,
                conditionMet: getConditional(resp.condition).met,
              })),
            },
          ];
        }
        return results;
      },
      [] as unknown as DialogueRender[]
    );

  const editSection = (section: any) => {
    updateEditing(section.name);
  };

  const saveDialogue = (
    ID: string,
    payload: Dialogue | DialogueResponse,
    isResponse: boolean
  ) => {
    updateEditing("");
    dispatch({
      type: isResponse ? "editResponse" : "editDialogue",
      payload,
      edit: ID,
    });
  };

  const addDialogue = () => {
    const newID = `DLG_${character.name}${characterState!.length + 1}`;
    const newDialogue: Dialogue = {
      name: newID,
      character: character.name,
      dialogue: "Placeholder dialogue.",
      default: character.default.length ? false : true,
    };
    dispatch({
      type: "addDialogue",
      payload: newDialogue,
    });
    updateEditing(newID);
  };

  const addResponse = (parent: string, current: number) => {
    const newID = `RES_${character.name}${current + 1}`;
    const newDialogue: DialogueResponse = {
      name: newID,
      parent: parent,
      category: "Generic",
      next: parent,
      condition: "",
      dialogue: "Placeholder dialogue.",
    };
    dispatch({
      type: "addResponse",
      payload: newDialogue,
    });
    updateEditing(newID);
  };

  return characterState ? (
    <CharacterContainer>
      <CharacterHeader id={character.name}>
        <CharacterName>{character.displayName}</CharacterName>
        <AddButton onClick={addDialogue}>Add Dialogue</AddButton>
      </CharacterHeader>
      {characterState.map((dialogue) => (
        <DialogueWrapper id={dialogue.name}>
          {editing === dialogue.name ? (
            <DialogueBuilder
              characterID={character.name}
              dialogue={dialogue}
              handleSave={saveDialogue}
            />
          ) : (
            <>
              <DialogueHeader>
                <DialogueID>{dialogue.name}</DialogueID>
                <EditWrapper>
                  <pre>{dialogue.default && <True>DEFAULT</True>}</pre>
                  <EditButton onClick={() => editSection(dialogue)}>
                    Edit
                  </EditButton>
                </EditWrapper>
              </DialogueHeader>
              <DialogueParagraph>"{dialogue.dialogue}"</DialogueParagraph>
            </>
          )}
          <ResponsesWrapper>
            {dialogue.responses.map((resp) => (
              <ResponseContainer id={resp.name}>
                {editing === resp.name ? (
                  <DialogueBuilder
                    characterID={character.name}
                    dialogue={resp}
                    handleSave={saveDialogue}
                    isResponse
                  />
                ) : (
                  <>
                    <DialogueHeader>
                      <ResponseNameWrapper>
                        <DialogueID>{resp.name}</DialogueID>
                        <pre>
                          <a href={`#${resp.next}`}>Next: {resp.next}</a>
                        </pre>
                      </ResponseNameWrapper>
                      <EditWrapper>
                        <pre>
                          Condition:{" "}
                          {resp.conditionMet ? (
                            <True>{resp.condition}</True>
                          ) : (
                            <False>{resp.condition}</False>
                          )}
                        </pre>
                        <EditButton onClick={() => editSection(resp)}>
                          Edit
                        </EditButton>
                      </EditWrapper>
                    </DialogueHeader>
                    <DialogueParagraph>
                      "[{resp.category}] {resp.dialogue}"
                    </DialogueParagraph>
                  </>
                )}
              </ResponseContainer>
            ))}
            <AddButton
              onClick={() =>
                addResponse(dialogue.name, dialogue.responses.length)
              }
            >
              Add Response
            </AddButton>
          </ResponsesWrapper>
        </DialogueWrapper>
      ))}
    </CharacterContainer>
  ) : null;
};

interface DialogueBuilderProps {
  characterID: string;
  dialogue: Dialogue | DialogueResponse;
  handleSave: (
    ID: string,
    payload: Dialogue | DialogueResponse,
    isResponse: boolean
  ) => void;
  isResponse?: boolean;
}

const DialogueBuilder: React.FC<DialogueBuilderProps> = ({
  characterID,
  dialogue,
  handleSave,
  isResponse = false,
}) => {
  const { state } = useContext(AppContext);
  const [editedDialogue, updateEditedDialogue] = useState(dialogue);

  const handleChange = (value: any, propertyName: string) => {
    updateEditedDialogue({
      ...editedDialogue,
      [propertyName]: value,
    });
  };

  const save = () => {
    handleSave(dialogue.name, editedDialogue, isResponse);
  };

  const preventNewLine = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode == 13) event.preventDefault();
  };

  const getNames = <
    T extends { [key: string]: Dialogue | DialogueResponse | Condition }
  >(
    section: T
  ): { key: string; label: string; value: T[keyof T] }[] => {
    const keys: Array<keyof T> = Object.keys(section) as Array<keyof T>;
    return Object.values(section).map((item, index) => ({
      key: item.name,
      label: item.name,
      value: section[keys[index]],
    }));
  };

  return (
    <EditableWrapper>
      <DialogueHeader>
        <FakeInput
          role="textbox"
          contentEditable
          onInput={(event) =>
            handleChange(event.currentTarget.innerText, "name")
          }
        >
          {dialogue.name}
        </FakeInput>

        <EditWrapper>
          {"default" in editedDialogue && !isResponse ? (
            <pre>
              <DefaultLael htmlFor={`${dialogue.name}-default-toggle`}>
                {editedDialogue.default ? (
                  <True>DEFAULT</True>
                ) : (
                  <False>DEFAULT</False>
                )}
                <input
                  id={`${dialogue.name}-default-toggle`}
                  type="checkbox"
                  checked={editedDialogue.default}
                  onChange={(event) =>
                    handleChange(event.currentTarget.checked, "default")
                  }
                />
              </DefaultLael>
            </pre>
          ) : (
            // lmao I'm so lazy to do this just to get a border, but whatever
            <pre></pre>
          )}
          <EditButton onClick={save}>save</EditButton>
        </EditWrapper>
      </DialogueHeader>
      {"parent" in editedDialogue && isResponse && (
        <Selections>
          <div className="selectionLabel">
            <span>PARENT:</span>
            <SelectContainer
              value={editedDialogue.parent}
              placeholder={editedDialogue.parent}
              options={getNames<{ [key: string]: Dialogue }>(
                structureData(
                  filter(
                    state.dialogue,
                    (item: Dialogue) => item.character === characterID
                  )
                )
              )}
              onChange={(option: any) => handleChange(option.key, "parent")}
            />
          </div>
          <div className="selectionLabel">
            <span>NEXT:</span>
            <SelectContainer
              options={getNames<{ [key: string]: Dialogue }>(
                structureData(
                  filter(
                    state.dialogue,
                    (item: Dialogue) => item.character === characterID
                  )
                )
              )}
              placeholder={editedDialogue.next}
              value={editedDialogue.next}
              onChange={(option: any) => handleChange(option.key, "next")}
            />
          </div>
          <div className="selectionLabel">
            <span>CATEGORY:</span>
            <SelectContainer
              backspaceRemoves={false}
              clearable={false}
              value={editedDialogue.category}
              placeholder={editedDialogue.category}
              options={state.categories.map((value) => ({
                key: value,
                label: `[${value}]`,
                value: value,
              }))}
              onChange={(option: any) => handleChange(option.key, "category")}
            />
          </div>
          <div className="selectionLabel">
            <span>CONDITION:</span>
            <SelectContainer
              value={editedDialogue.condition}
              placeholder={editedDialogue.condition}
              options={getNames<{ [key: string]: Condition }>(state.conditions)}
              onChange={(option: any) => handleChange(option.key, "condition")}
            />
          </div>
        </Selections>
      )}
      <DialogueParagraph>
        <DialogueEditArea
          className="input"
          onChange={(event) =>
            handleChange(event.currentTarget.value, "dialogue")
          }
          onKeyDown={preventNewLine}
          rows={5}
        >
          {editedDialogue.dialogue}
        </DialogueEditArea>
      </DialogueParagraph>
    </EditableWrapper>
  );
};

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default CharacterBuilder;
