import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  margin-bottom: ${({ mb = 0 }) => mb};
`;

export const Row = styled(Flex)`
  flex-direction: row;
`;

export const Column = styled(Flex)`
  flex-direction: column;
`;

export const Container = styled(Column)`
  align-items: flex-start;
  padding: 40px;
  margin-bottom: 10px;
`;

export const Text = styled.p`
  margin: 0;
`;

export const Value = styled(Text)`
  font-weight: 400;
  font-size: 1.25em;
`;

export const Label = styled(Text)`
  margin-right: 0.5em;
`;

export const GroupRow = styled(Row)`
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  margin-bottom: 1em;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Username = styled(Value)``;
