import React, { useEffect, useReducer } from "react";
import styled from "styled-components";

import { AppContext, appReducer, defaultState } from "./appState";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import Builder from "./components/Builder";

const AppWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const AppContainer = styled.div`
  width: 1024px;
  max-width: 1024px;
  position: relative;
`;

const BuilderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direciton: row;
  margin-top: 100px;
`;

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, defaultState);

  useEffect(() => {
    console.log(defaultState);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <AppWrapper>
        <AppContainer>
          <TopNav />
          <BuilderWrapper>
            <Builder />
            <Sidebar />
          </BuilderWrapper>
        </AppContainer>
      </AppWrapper>
    </AppContext.Provider>
  );
};

export default App;
