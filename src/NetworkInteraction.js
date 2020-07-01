import React from "react";
import { inject, observer } from "mobx-react";
import { Button, GroupRow, Label, Value, Text } from "./components/Layout";
import styled from "styled-components";

const Loading = styled(Text)`
  font-size: 14px;
  color: #ccc;
`;

const NetworkInteraction = (props) => {
  const { ix } = props;
  const { basicScript } = ix;
  const { interacting, result } = ix;

  return result ? (
    <GroupRow>
      <Label>Script Result:</Label>
      <Value>{result}</Value>
    </GroupRow>
  ) : (
    <>
      {interacting && <Loading>Executing script, please wait...</Loading>}
      <Button onClick={basicScript}>Compute</Button>
    </>
  );
};

export default inject("ix")(observer(NetworkInteraction));
