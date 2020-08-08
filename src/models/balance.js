import { types, flow } from "mobx-state-tree";
import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import * as t from "@onflow/types";
import { account } from "./Account";

const BASE_CONTRACT_ADDRESS = "179b6b1cb6755e31";

const setupMainVault = (address) => `
import FungibleToken from 0x${address}
transaction {
  prepare(acct: AuthAccount) {

    acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(/public/MainReceiver, target: /storage/MainVault)

    log("Public Receiver reference created!")
  }

  post {
    getAccount(0x${address}).getCapability(/public/MainReceiver)!
                  .check<&FungibleToken.Vault{FungibleToken.Receiver}>():
                  "Vault Receiver Reference was not created correctly"
  }
}
`;
const setupBasic = (address, contractAddress) => `
  import FungibleToken from 0x${contractAddress}
  
  transaction {
    prepare(acct: AuthAccount) {
    let vaultA <- FungibleToken.createEmptyVault()
    acct.save<@FungibleToken.Vault>(<-vaultA, to: /storage/MainVault)
      log("Empty Vault stored")
      let ReceiverRef = acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(/public/MainReceiver, target: /storage/MainVault)
      log("References created")
    }
  
    post {
        getAccount(0x${address}).getCapability(/public/MainReceiver)!
                        .check<&FungibleToken.Vault{FungibleToken.Receiver}>():  
                        "Vault Receiver Reference was not created correctly"
    }
  }
`;
const balanceScript = (address) => `
import FungibleToken from 0x${BASE_CONTRACT_ADDRESS} 

pub fun main(): UInt {
    let account = getAccount(0x${address})

    let vault = account.getCapability(/public/MainReceiver)!
                       .borrow<&FungibleToken.Vault{FungibleToken.Balance}>()!

    log("Account 1 Balance")
    log(vault.balance)
    return vault.balance
}
`;

const vaultReferenceScript = (address) => `
import FungibleToken from 0x${BASE_CONTRACT_ADDRESS} 

pub fun main():Bool{
    return getAccount(0x${address}).getCapability(/public/MainReceiver)!
                .check<&FungibleToken.Vault{FungibleToken.Receiver}>()
}
`;

const sendTransaction = (address, amount) => `
import FungibleToken from 0x${BASE_CONTRACT_ADDRESS}

transaction {
  var temporaryVault: @FungibleToken.Vault

  prepare(acct: AuthAccount) {
    let vaultRef = acct.borrow<&FungibleToken.Vault>(from: /storage/MainVault)!
     
    self.temporaryVault <- vaultRef.withdraw(amount: UInt(${amount}))
  }

  execute {
    let recipient = getAccount(0x${address})

    let receiverRef = recipient.getCapability(/public/MainReceiver)!
                      .borrow<&FungibleToken.Vault{FungibleToken.Receiver}>()!

    receiverRef.deposit(from: <-self.temporaryVault)

    log("Transfer succeeded!")
  }
}
 
`;

export const Balance = types
  .model({
    value: types.number,
    vaultRefExists: types.boolean,
  })
  .actions((self) => ({
    afterCreate: flow(function* () {}),
    setupRef: flow(function* () {}),
    setupVault: flow(function* (mainAcc) {
      console.log({ mainAcc });
      const { address } = account;
      const transactionCode = mainAcc
        ? setupMainVault(address)
        : setupBasic(address, BASE_CONTRACT_ADDRESS);
      const transaction = sdk.transaction`${transactionCode}`;

      const currentAuthorization = fcl.currentUser().authorization;
      console.log({ sequenceNum: currentAuthorization.sequenceNum });

      const response = yield fcl.send(
        [
          transaction,
          fcl.proposer(currentAuthorization),
          fcl.payer(currentAuthorization),
          fcl.authorizations([currentAuthorization]),
          fcl.limit(100), // do we really need it here?
        ],
        {
          node: "http://localhost:8080",
        }
      );
      const result = yield fcl.decode(response);
      console.log({ response });
      console.log({ result });
    }),
    sendTo: flow(function* (recepient, amount) {
      console.log({ recepient, amount });

      const transaction = sdk.transaction`${sendTransaction(
        recepient,
        amount
      )}`;
      const currentAuthorization = fcl.currentUser().authorization;
      const response = yield fcl.send([
        transaction,
        fcl.proposer(currentAuthorization),
        fcl.payer(currentAuthorization),
        fcl.authorizations([currentAuthorization]),
        fcl.limit(100), // TODO: Check how much needed
      ]);
      const result = yield fcl.decode(response);
      console.log({ response });
      console.log({ result });
    }),
    checkReference: flow(function* () {
      const { address } = account;
      // TODO: Do nothing if address is empty
      const script = sdk.script`${vaultReferenceScript(address)}`;

      const response = yield fcl.send([script]);
      const result = yield fcl.decode(response);
      console.log({ result, response });
      self.vaultRefExists = result;
    }),
    checkBalance: flow(function* () {
      const { address } = account;
      const scriptCode = balanceScript(address);
      const script = sdk.script`${scriptCode}`;

      const response = yield fcl.send([script]);
      self.value = yield fcl.decode(response);
    }),
  }));

export const balance = Balance.create({
  value: 0,
  vaultRefExists: false,
});
