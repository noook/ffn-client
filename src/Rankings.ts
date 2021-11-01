import { Request } from "./Request";

export abstract class Rankings extends Request {
  readonly go = 'epr';
  readonly idact = 'nat';

  private poolLength: 25 | 50 = 25;
  private season: number = 2021;
  private category?: number;
  private minAge?: number;
  private maxAge?: number;

  constructor(endpoint: string) {
    super(endpoint);
  }

  public setPoolLength(length: 25 | 50): this {
    this.poolLength = length;

    return this;
  }

  public getPoolLength(): 25 | 50 {
    return this.poolLength;
  }

  public setSeason(season: number): this {
    this.season = season;

    return this;
  }

  public getSeason(): number {
    return this.season;
  }

  public setAge(age: number): this {
    this.minAge = undefined;
    this.maxAge = undefined;
    this.category = age;

    return this;
  }

  public setMinAge(age: number): this {
    if (age < 12 || age > 24) {
      throw new Error('Minimum must be between 12 and 24');
    }

    this.category = undefined;
    this.minAge = age;

    return this;
  }

  public setMaxAge(age: number): this {
    if (age < 12) {
      throw new Error('Maximum age must be greater or equal to 12');
    }

    this.category = undefined;
    this.maxAge = age;

    return this;
  }

  public getBaseOptions() {
    if (this.minAge && this.maxAge && this.minAge > this.maxAge) {
      throw new Error('Minimum age can\'t be greater than maximum age');
    }

    return {
      ...super.getBaseOptions(),
      idbas: this.poolLength,
      idsai: this.season,
      idcat: this.category,
      idmin: this.minAge,
      idmax: this.maxAge,
    };
  }
}