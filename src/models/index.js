import { types } from "mobx-state-tree";
import { account, Account } from "./Account";
import { ix, Interaction } from "./Interaction";

const Store = types.model({
  account: Account,
  ix: Interaction,
});

export const store = Store.create({
  account,
  ix,
});
