import React from "react";
import { observer, inject } from "mobx-react";
import {
  Container,
  Username,
  Label,
  GroupRow,
  Column,
  Button,
} from "./components/Layout";
import NetworkInteraction from "./NetworkInteraction";

const User = (props) => {
  const { account, contract } = props;
  const { name, address } = account;
  const { login, logout } = account;
  const { deploy } = contract;
  return (
    <Container>
      {name ? (
        <Column>
          <Column mb="2em">
            <GroupRow>
              <Label>Username:</Label>
              <Username>{name}</Username>
            </GroupRow>
            <GroupRow>
              <Label>Address:</Label>
              <Username>{address}</Username>
            </GroupRow>
            <GroupRow>
              <Button onClick={deploy}>DeployContract</Button>
            </GroupRow>
            <Button onClick={logout}>Logout</Button>
          </Column>
        </Column>
      ) : (
        <Button onClick={login}>Login</Button>
      )}
      <NetworkInteraction />
    </Container>
  );
};

export default inject("account", "contract")(observer(User));
