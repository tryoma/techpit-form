import { Dispatch } from "redux";
import profileActions from "./actions";
import { Address } from "../../domain/entity/address";

import {
  isCompletePostalcode,
  sanitizePostalcode
} from "../../domain/services/address";

export const searchAddressFromPostalcode = (code: string) => async (
  dispach: Dispatch
) => {
  if (!isCompletePostalcode(code)) return;
  dispach(profileActions.searchAddress.started({}));

  const result = await fetch(
    `https://apis.postcode-jp.com/api/v3/postcodes?apikey=rl2QGMCip3P03Vs3flvnBIvaODeoSfj1MRzfvT9&postcode=${sanitizePostalcode(
      code
    )}`
  ).then(res => res.json());

  console.log(result)
  if (!result.data[0]) return;

  const address: Partial<Address> = {
    prefecture: result.data[0].pref,
    city: result.data[0].city + result.data[0].town
  };

  dispach(profileActions.searchAddress.done({ result: address, params: {} }));
};
