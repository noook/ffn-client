import { Race } from '../constants';

export type Sex = 'm' | 'f';
export type PoolLength = 25 | 50;

export interface Identity {
  firstname: string;
  lastname: string;
}

export interface RaceTime {
  display: string;
  minutes: number | null;
  seconds: number | null;
  hundredths: number | null;
}

export interface RaceEntry {
  name: RaceList;
  raceId: Race;
  time: RaceTime;
  laps: RaceLap[];
  age: number;
  points: number;
  poolLength: 25 | 50;
  location: {
    city: string;
    country: string;
  };
  date: Date;
  structure: string;
}

export interface RaceLap {
  distance: number;
  split: RaceTime;
  lap: RaceTime;
  relay?: RaceTime;
}

export type RaceList =
    '50 NL' | '100 NL' | '200 NL' | '400 NL' | '800 NL' | '1500 NL' |
    '50 Dos' | '100 Dos' | '200 Dos' |
    '50 Bra.' | '100 Bra.' | '200 Bra.' |
    '50 Pap.' | '100 Pap.' | '200 Pap.' |
    '100 4 N.' | '200 4 N.' | '400 4 N.';

export type RaceMap = Record<RaceList, Race>;
