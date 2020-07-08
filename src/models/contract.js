import { types, flow } from "mobx-state-tree";
import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import * as t from "@onflow/types";

import { NullableString } from "./types";
import { account } from "./Account";

export const Contract = types
  .model({
    code: NullableString,
  })
  .actions((self) => ({
    deploy: flow(function* () {
      const { code } = self;
      const { address } = account;
      const user = fcl.currentUser();

      /*
      const acc = yield sdk.build([sdk.getAccount(address)]);
      const acctResponse = yield sdk.send(acc, {
        node: "http://localhost:8081",
      });

      const accountParams = yield authorization(acctResponse);
      console.log({ accountParams });

      const seqNum = acctResponse.account.keys[0].sequenceNumber;
      console.log({ acctResponse });
      console.log({ seqNum });
*/

      const response = yield fcl.send([
        sdk.transaction`
          transaction {
            prepare(acct: AuthAccount) {
              acct.setCode("${p => p.code}".decodeHex())
            }
          }
        `,
        fcl.params([
          fcl.param(
            Buffer.from(code, "utf8").toString("hex"),
            t.Identity,
            "code"
          ),
        ]),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.payer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.limit(100)
      ], {
        node: "http://localhost:8080",
      });

      console.log({ response });

      // const user = fcl.currentUser();
      // const code = ` // here we gonna have contract code `;
      /*
      const response = await sdk.send(
        yield sdk.pipe(
          yield sdk.build([
            sdk.payer(user.authorization),
            sdk.proposer(user.authorization),
            sdk.params([sdk.param(code, t.code ,"code")]),
            sdk.transaction`
              transaction {
                prepare(acct: AuthAccount) {
                  acct.setCode("${p => p.code}".decodeHex())
                }
              }
            `,
            sdk.authorizations([user.authorization]),
          ]),
          [sdk.resolve([sdk.resolveAccounts, sdk.resolveSignatures])]
        ),
        { node: "http://localhost:8080" }
      );

      console.log({ response });

      /*
      const account = yield sdk.build([
        sdk.getAccount("01")
      ]);
      const acctResponse = yield sdk.send(account, { node: "http://localhost:8080" })

      const seqNum = acctResponse.account.keys[0].sequenceNumber

      const response = yield sdk.send(yield sdk.pipe(yield sdk.build([
        sdk.payer(sdk.authorization("01", signingFunction, 0)),
        sdk.proposer(sdk.authorization("01", signingFunction, 0, seqNum)),
        sdk.transaction`transaction { prepare(acct: AuthAccount) {} execute { log("Hello") } }`,
        sdk.authorizations([sdk.authorization("01", signingFunction, 0)]),
      ]), [
        sdk.resolve([
          sdk.resolveAccounts,
          sdk.resolveSignatures
        ]),
      ]), { node: "http://localhost:8080" })

      /*
      transaction {
        prepare(signer: AuthAccount) {
          let acct = AuthAccount(payer: signer)
          for key in keys {
            acct.addPublicKey(key)
          }
          acct.setCode(code)
        }
      }
       */

      // console.log({ response });
    }),
  }));

export const contract = Contract.create({
  code: `
    pub contract FungibleToken {

      pub var totalSupply: UInt
  
      pub resource interface Provider {
          pub fun withdraw(amount: UInt): @Vault {
              post {
                  result.balance == UInt(amount):
                  "Withdrawal amount must be the same as the balance of the withdrawn Vault"
              }
          }
      }
  
      pub resource interface Receiver {
          pub fun deposit(from: @Vault) {
              pre {
                  from.balance > UInt(0):
                      "Deposit balance must be positive"
              }
          }
      }
  
      pub resource interface Balance {
          pub var balance: UInt
      }
  
      pub resource Vault: Provider, Receiver, Balance {
          
          pub var balance: UInt
  
          init(balance: UInt) {
              self.balance = balance
          }
  
          pub fun withdraw(amount: UInt): @Vault {
              self.balance = self.balance - amount
              return <-create Vault(balance: amount)
          }
          
          pub fun deposit(from: @Vault) {
              self.balance = self.balance + from.balance
              destroy from
          }
      }
  
        pub fun createEmptyVault(): @Vault {
            return <-create Vault(balance: 0)
        }
  
       pub resource VaultMinter {
          pub fun mintTokens(amount: UInt, recipient: &AnyResource{Receiver}) {
              FungibleToken.totalSupply = FungibleToken.totalSupply + amount
              recipient.deposit(from: <-create Vault(balance: amount))
          }
       }
  
      init() {
          self.totalSupply = 100
  
          let vault <- create Vault(balance: self.totalSupply)
          let minter <- create VaultMinter()
          self.account.save(<-vault, to: /storage/MainVault)
          self.account.save(<-minter, to: /storage/MainMinter)
          self.account.link<&VaultMinter>(/private/Minter, target: /storage/MainMinter)
      }
    }
  `,
});
