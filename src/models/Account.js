import { types, flow } from "mobx-state-tree";
import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import { NullableString } from "./types";

fcl
  .config()
  .put("challenge.handshake", "http://localhost:8701/flow/authenticate");

export const Authorization = types.model({
  addr: types.string,
  endpoint: types.string,
  id: types.string,
  method: types.string,
});

const getIdentityName = (user) => {
  const { identity } = user;
  return identity ? identity.name : "Anonymous";
};

const getAuthorizations = (user) => {
  return user.authorizations.map(toAuthModel);
};

const getAddress = (user) => {
  return user.addr;
};

const toAuthModel = (auth) => {
  return Authorization.create({
    ...auth,
  });
};

export const Account = types
  .model({
    address: NullableString,
    name: NullableString,
    authorizations: types.array(Authorization),
  })
  .actions((self) => ({
    afterCreate: () => {
      console.log("Account model created");
      console.log("Listening for account updates");
      fcl.currentUser().subscribe(self.update);
    },
    update: (user) => {
      console.log({ user });
      self.address = getAddress(user);
      self.name = getIdentityName(user);
      self.authorizations = getAuthorizations(user);
    },
    login: () => {
      fcl.authenticate();
    },
    logout: () => {
      fcl.unauthenticate();
    },
  }));

export const account = Account.create({
  name: "Maksimus",
});
