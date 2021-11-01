import { Rankings } from './Rankings';
import { Race } from './constants';
import { JSDOM } from 'jsdom';
import { SwimmerProfile } from './SwimmerProfile';
import { parseName } from './parsers';
import { Identity, RaceTime } from './types';

export type IndividualRankingEntry = {
  swimmer: Identity & {
    id: number | string;
    nat: string;
    birthyear: number;
    age: number;
    href: string;
  };
  club: {
    name: string;
  };
  time: RaceTime;
  points: number;
}

export class IndividualRankings extends Rankings {
  readonly timerange = 'sai';
  private race: Race;

  constructor(race: Race) {
    super('nat_rankings.php');
    this.checkRaceID(race);
    this.race = race;
  }

  private checkRaceID(race: Race) {
    if (!Object.values(Race).includes(race)) {
      throw new Error('Invalid race ID');
    }
  }

  async execute(): Promise<IndividualRankingEntry[]> {
    const { data } = await this.client.get(this.endpoint, {
      params: {
        ...this.getBaseOptions(),
        idepr: this.race,
      },
    });

    return this.parseDocument(data);
  }

  private parseDocument(data: string): IndividualRankingEntry[] {
    const dom = new JSDOM(data);
    const items: IndividualRankingEntry[] = [];

    dom.window.document.querySelector('table#styleNoBorder')!.querySelectorAll('tr').forEach(el => {
      const swimmer = el.querySelector('td:nth-child(2) a') as HTMLAnchorElement;
      const swimmerId = new URLSearchParams(swimmer.href).get('idrch_id')!
      const club = el.querySelector('td:nth-child(3) a') as HTMLAnchorElement;
      const time = (el.querySelector('td:nth-child(4)') as HTMLAnchorElement).textContent!.trim();
      const parsedTime = /(\d{2}):(\d{2})\.(\d{2})/.exec(time as string)!;
      const points = (el.querySelector('td:nth-child(5) nobr') as Element).textContent!.trim();
      const { name, birthyear, age } = /(?<name>.+)\s\((?<birthyear>\d+)\/(?<age>\d+).*/
        .exec(swimmer.childNodes.item(0).textContent!.trim())!.groups!;

      const nat = swimmer.childNodes.item(2).textContent!.trim();
      const { firstname, lastname } = parseName(name);

      const entry = {
        swimmer: {
          id: swimmerId,
          firstname,
          lastname,
          nat,
          birthyear: +birthyear,
          age: +age,
          href: SwimmerProfile.getUrl(swimmerId).href,
        },
        club: {
          name: club.textContent!.trim(),
        },
        time: {
          display: time,
          minutes: +parsedTime[1],
          seconds: +parsedTime[2],
          hundredths: +parsedTime[3],
        },
        points: parseInt(points!),
      };

      items.push(entry);
    });

    return items;
  }
}