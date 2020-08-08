import React, { useState } from "react";
import { observer, inject } from "mobx-react";
import {
  Container,
  Username,
  Value,
  Label,
  GroupRow,
  Column,
  Button,
} from "./components/Layout";
import NetworkInteraction from "./NetworkInteraction";

const User = (props) => {
  const { account, contract, balance } = props;
  const { name, address } = account;
  const { login, logout } = account;
  const { deploy } = contract;
  const { setupVault, checkBalance, checkReference, sendTo } = balance;
  const { value, vaultRefExists } = balance;
  const [amount, setAmount] = useState(10);
  const [recepientAddress, setAddress] = useState("01cf0e2f2f715450");
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
              <Value>{address}</Value>
            </GroupRow>
            <GroupRow>
              <Button onClick={deploy}>DeployContract</Button>
              <Button onClick={() => setupVault(true)}>Setup Vault</Button>
              <Button onClick={() => setupVault(false)}>Setup Basic</Button>
              <Button onClick={checkReference}>Check Reference</Button>
              <Button onClick={checkBalance}>Check Balance</Button>
            </GroupRow>
            <GroupRow>
              <Label>Recepient</Label>
              <input
                onChange={(event) => setAddress(event.target.value)}
                value={recepientAddress}
              />
              <Label>Amount</Label>
              <input
                onChange={(event) => setAmount(event.target.value)}
                value={amount}
              />
              <Button onClick={() => sendTo(recepientAddress, amount)}>
                Send
              </Button>
            </GroupRow>
            <GroupRow>
              <Label>Balance:</Label>
              <Value>{value}</Value>
            </GroupRow>
            <Button onClick={logout}>Logout</Button>
          </Column>
        </Column>
      ) : (
        <Button onClick={login}>Login</Button>
      )}
    </Container>
  );
};

export default inject("account", "contract", "balance")(observer(User));
