import axios, { AxiosInstance } from "axios";

type ActionType = 'nat';
type PageAction = 'epr' | 'atr' | 'profile';
type TimeRange = 'sai' | 'atr';

export abstract class Request {
  readonly client: AxiosInstance = axios.create({
    baseURL: 'https://ffn.extranat.fr/webffn',
  });

  constructor(readonly endpoint: string) {}

  abstract readonly idact: ActionType;
  abstract readonly go: PageAction;
  abstract readonly timerange: TimeRange;

  public getBaseOptions() {
    return {
      idact: this.idact,
      idopt: this.timerange,
      go: this.go,
    };
  }
}