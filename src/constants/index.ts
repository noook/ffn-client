import {RaceMap} from "../types";

export enum Race {
  W_FREE_50 = 1,
  W_FREE_100 = 2,
  W_FREE_200 = 3,
  W_FREE_400 = 4,
  W_FREE_800 = 5,
  W_FREE_1500 = 6,
  W_BACK_50 = 11,
  W_BACK_100 = 12,
  W_BACK_200 = 13,
  W_BREAST_50 = 21,
  W_BREAST_100 = 22,
  W_BREAST_200 = 23,
  W_BUTTERFLY_50 = 31,
  W_BUTTERFLY_100 = 32,
  W_BUTTERFLY_200 = 33,
  W_MEDLEY_100 = 40,
  W_MEDLEY_200 = 41,
  W_MEDLEY_400 = 42,
  M_FREE_50 = 51,
  M_FREE_100 = 52,
  M_FREE_200 = 53,
  M_FREE_400 = 54,
  M_FREE_800 = 55,
  M_FREE_1500 = 56,
  M_BACK_50 = 61,
  M_BACK_100 = 62,
  M_BACK_200 = 63,
  M_BREAST_50 = 71,
  M_BREAST_100 = 72,
  M_BREAST_200 = 73,
  M_BUTTERFLY_50 = 81,
  M_BUTTERFLY_100 = 82,
  M_BUTTERFLY_200 = 83,
  M_MEDLEY_100 = 90,
  M_MEDLEY_200 = 91,
  M_MEDLEY_400 = 92,
}

export const menRaceMap: RaceMap = {
  '50 NL': Race.M_FREE_50,
  '100 NL': Race.M_FREE_100,
  '200 NL': Race.M_FREE_200,
  '400 NL': Race.M_FREE_400,
  '800 NL': Race.M_FREE_800,
  '1500 NL': Race.M_FREE_1500,
  '50 Dos': Race.M_BACK_50,
  '100 Dos': Race.M_BACK_100,
  '200 Dos': Race.M_BACK_200,
  '50 Bra.': Race.M_BREAST_50,
  '100 Bra.': Race.M_BREAST_100,
  '200 Bra.': Race.M_BREAST_200,
  '50 Pap.': Race.M_BUTTERFLY_50,
  '100 Pap.': Race.M_BUTTERFLY_100,
  '200 Pap.': Race.M_BUTTERFLY_200,
  '100 4 N.': Race.M_MEDLEY_100,
  '200 4 N.': Race.M_MEDLEY_200,
  '400 4 N.': Race.M_MEDLEY_400,
};

export const womenRaceMap: RaceMap = {
  '50 NL': Race.W_FREE_50,
  '100 NL': Race.W_FREE_100,
  '200 NL': Race.W_FREE_200,
  '400 NL': Race.W_FREE_400,
  '800 NL': Race.W_FREE_800,
  '1500 NL': Race.W_FREE_1500,
  '50 Dos': Race.W_BACK_50,
  '100 Dos': Race.W_BACK_100,
  '200 Dos': Race.W_BACK_200,
  '50 Bra.': Race.W_BREAST_50,
  '100 Bra.': Race.W_BREAST_100,
  '200 Bra.': Race.W_BREAST_200,
  '50 Pap.': Race.W_BUTTERFLY_50,
  '100 Pap.': Race.W_BUTTERFLY_100,
  '200 Pap.': Race.W_BUTTERFLY_200,
  '100 4 N.': Race.W_MEDLEY_100,
  '200 4 N.': Race.W_MEDLEY_200,
  '400 4 N.': Race.W_MEDLEY_400,
};