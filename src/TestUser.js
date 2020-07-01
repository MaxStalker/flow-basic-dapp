import React, { useEffect, useState } from "react";
import * as sdk from "@onflow/sdk";
import styled from "styled-components";

const Container = styled.div``;
const Button = styled.button``;

const getName = (user) => {
  return user ? user.identity.name : "Anonymous";
};

const TestUser = () => {
  // const [user, setUser] = useState(null);
  // const [response, setResponse] = useState(null);
  const [result, setResult] = useState(null);
  const address = "f8d6e0586b0a20c7";

  const run = async () => {
    const response = await sdk.send(
      await sdk.pipe(await sdk.build([sdk.getAccount(address)])),
      { node: "http://localhost:8080" }
    );
    setResult(await sdk.decodeResponse(response));
  };

  return (
    <Container>
      <Button onClick={run}>Fetch</Button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </Container>
  );
};

export default TestUser;
