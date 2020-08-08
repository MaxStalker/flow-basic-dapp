import { types } from "mobx-state-tree";
import { account, Account } from "./Account";
import { ix, Interaction } from "./Interaction";
import { contract, Contract } from "./contract";
import { balance, Balance } from "./balance";

const Store = types.model({
  account: Account,
  ix: Interaction,
  contract: Contract,
  balance: Balance,
});

export const store = Store.create({
  account,
  ix,
  contract,
  balance,
});
