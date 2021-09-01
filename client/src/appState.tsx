import { createContext, Dispatch } from "react";
import { cloneDeep, keyBy, update, without } from "lodash";

import categories from "./output/categories.json";
import characters from "./output/characters.json";
import conditions from "./output/conditions.json";
import dialogue from "./output/dialogue.json";
import responses from "./output/responses.json";

export interface AppState {
  categories: string[];
  characters: {
    [key: string]: Character;
  };
  conditions: {
    [key: string]: Condition;
  };
  dialogue: {
    [key: string]: Dialogue;
  };
  responses: {
    [key: string]: DialogueResponse;
  };
}

export type ObjectAppState = Omit<AppState, "categories">;

type ValueOf<T> = T[keyof T];

export type Payload =
  | string
  | Character
  | Condition
  | Dialogue
  | DialogueResponse;

export interface AppAction {
  type: string;
  payload: Payload;
  edit?: string;
}

export const structureData = <T extends Payload>(
  section: T[]
): { [key: string]: T } => keyBy(section, "name");

export const defaultState: AppState = {
  categories,
  characters: structureData<Character>(characters),
  conditions: structureData<Condition>(conditions),
  dialogue: structureData<Dialogue>(dialogue),
  responses: structureData<DialogueResponse>(responses),
};

const replaceID = (state: AppState, newID: string, oldID: string): AppState => {
  const { categories, ...iterableSections } = cloneDeep(state);
  const keys = Object.keys(iterableSections);
  const rebuilt: any = {};

  Object.values(iterableSections).forEach((section, index) => {
    rebuilt[keys[index]] = {};

    let sk: keyof typeof section;
    for (sk in section) {
      const correctKey = sk === oldID ? newID : sk;
      rebuilt[keys[index]][correctKey] = section[sk];
      const item = rebuilt[keys[index]][correctKey];

      let ik: keyof typeof item;
      for (ik in item) {
        if (item[ik] === oldID) {
          item[ik] = newID;
        }
      }
    }
  });
  return { categories, ...rebuilt } as AppState;
};

export const appReducer = (state: AppState, dispatch: AppAction) => {
  const updateState = (update: any) => ({ ...state, ...update });

  switch (dispatch.type) {
    case "addCategory": {
      const payload = dispatch.payload as string;
      const updated = [payload, ...state.categories];

      return updateState({
        categories: updated,
      });
    }
    case "editCategory": {
      const payload = dispatch.payload as string;
      const tempState = [...without(state.categories, dispatch.edit), payload];

      return updateState({
        categories: tempState,
      });
    }
    case "removeCategory": {
      return updateState({
        categories: [...state.categories].filter(
          (item) => item !== dispatch.payload
        ),
      });
    }
    case "addCharacter": {
      const payload = dispatch.payload as Character;
      return updateState({
        characters: { ...state.characters, [payload.name]: dispatch.payload },
      });
    }
    case "removeCharacter": {
      const payload = dispatch.payload as Character;
      // Destructuring and spread assignment to remove just the one property and store the rest in updatedCharacters
      const { [payload.name]: value, ...updatedCharacters } = state.characters;
      return updateState({
        characters: updatedCharacters,
      });
    }
    case "addCondition": {
      const payload = dispatch.payload as Condition;
      return updateState({
        conditions: { ...state.conditions, [payload.name]: payload },
      });
    }
    case "removeCondition": {
      const payload = dispatch.payload as Condition;
      const { [payload.name]: value, ...updatedConditions } = state.conditions;
      return updateState({
        conditions: updatedConditions,
      });
    }
    case "addDialogue":
      const payload = dispatch.payload as Dialogue;
      return updateState({
        dialogue: { ...state.dialogue, [payload.name]: payload },
      });
    case "editDialogue": {
      const payload = dispatch.payload as Dialogue;
      let tempState = state;

      // This means that the ID of the dialogue was edited so we need to update this elsewhere
      if (dispatch.edit && dispatch.edit !== payload.name) {
        tempState = replaceID(state, payload.name, dispatch.edit);
      }

      tempState.dialogue[payload.name] = payload;

      return updateState({
        ...tempState,
      });
    }
    case "removeDialogue": {
      const payload = dispatch.payload as Dialogue;
      const { [payload.name]: value, ...updatedDialogue } = state.dialogue;
      return updateState({
        dialogue: updatedDialogue,
      });
    }
    case "addResponse": {
      const payload = dispatch.payload as DialogueResponse;
      return updateState({
        responses: { ...state.responses, [payload.name]: payload },
      });
    }
    case "editResponse": {
      const payload = dispatch.payload as DialogueResponse;
      let tempState = state;

      // This means that the ID of the dialogue was edited so we need to update this elsewhere
      if (dispatch.edit && dispatch.edit !== payload.name) {
        tempState = replaceID(state, payload.name, dispatch.edit);
      }

      tempState.responses[payload.name] = payload;

      return updateState({
        ...tempState,
      });
    }
    case "removeResponse": {
      const payload = dispatch.payload as DialogueResponse;
      const { [payload.name]: value, ...updatedResponses } = state.responses;
      return updateState({
        dialogue: updatedResponses,
      });
    }
    case "saveFiles": {
      (async () => {
        await fetch("http://localhost:8080/save", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(state), // body data type must match "Content-Type" header
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      })();
      return updateState({});
    }
    default:
      throw new Error(
        "That ain't right, try using a valid action for the AppState reducer."
      );
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({ state: defaultState as AppState, dispatch: () => null });
