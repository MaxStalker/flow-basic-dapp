import { types, flow } from "mobx-state-tree";
import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import { account } from "./Account";

const balanceScript = (address) => `
import FungibleToken from 0x01 

pub fun main(): UInt64 {
    let account = getAccount(${address})

    let vault = account.getCapability(/public/MainReceiver)!
                       .borrow<&FungibleToken.Vault{FungibleToken.Balance}>()!

    log("Account 1 Balance")
    log(vault.balance)
    return acct1ReceiverRef.balance
}
`;

export const Balance = types
  .model({
    balance: types.number,
  })
  .actions((self) => ({
    setupRef: flow(function* () {
      
    }),
    checkBalance: flow(function* () {
      const { address } = account;
      const scriptCode = balanceScript(address);
      const script = sdk.script`${scriptCode}`;

      const response = yield send([script]);
      const result = yield fcl.decode(response);
      console.log(result);
    }),
  }));

export const balance = Balance.create({
  balance: 0,
});
