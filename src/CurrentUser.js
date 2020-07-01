import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import styled from "styled-components";

const Container = styled.div``;
const Img = styled.img`
  width: 32px;
  height: 32px;
`;
const Button = styled.button``;
const Name = styled.p``;

fcl
  .config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate");

const SignInButton = () => {
  return <Button onClick={() => fcl.authenticate()}>Sign In/Up</Button>;
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log("Subscribe to user updates");
    fcl.currentUser().subscribe((user) => {
      console.log("User updated");
      console.log({ user });
      // setUser(user);
      setUser({ identity: { name: "Bazinga" } });
    });
  }, []);

  const username = user ? user.identity.name : "Anonymous";
  const userImage = user ? user.identity.avatar : "";
  return (
    <>
      <Img src={userImage} />
      <Name>{username}</Name>
      <Button onClick={fcl.unauthenticate}>Sign Out</Button>
      <Button onClick={() => setUser({ identity: { name: "Test" } })}>
        Syntetic
      </Button>
    </>
  );
};

const CurrentUser = () => {
  return (
    <Container>
      <SignInButton />
      <UserProfile />
    </Container>
  );
};

export default CurrentUser;
