import { types, flow } from "mobx-state-tree";
import * as fcl from "@onflow/fcl";
import * as sdk from "@onflow/sdk";
import { NullableString, NullableNumber } from "./types";

import baseUrl from "../blockchain/scripts/base.cdc";

export const Interaction = types
  .model({
    result: NullableNumber,
    interacting: types.boolean,
    baseScript: NullableString,
  })
  .actions((self) => ({
    afterCreate: flow(function* () {
      const file = yield fetch(baseUrl);
      self.baseScript = yield file.text();
    }),
    basicScript: flow(function* () {
      const { send } = fcl;
      const { baseScript } = self;
      const script = sdk.script`${baseScript}`;
      self.interacting = true;

      const response = yield send([script]);
      console.log({ response });

      self.result = yield fcl.decode(response);
      self.interacting = false;
    }),
  }));

export const ix = Interaction.create({
  interacting: false,
});
