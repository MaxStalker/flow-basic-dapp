import React from "react";
import { Provider } from "mobx-react";
import { store } from "./models";
import User from "./User";
import Global from "./global";

function App() {
  return (
    <>
      <Global />
      <Provider {...store}>
        <User />
      </Provider>
    </>
  );
}

export default App;
