import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Race } from './constants';

const defaultOptions = {
  idact: 'nat',
  go: 'epr',
  idopt: 'sai',
  idsai: 2021,
};

export interface RaceOptions {
  idbas: 25 | 50;
  idsai?: number;
  idcat?: number;
  idreg?: number;
}

const URL = 'https://ffn.extranat.fr/webffn';

export class FFNClient {
  private instance = axios.create({ baseURL: URL });

  private checkRaceID(race: Race) {
    if (!Object.values(Race).includes(race)) {
      throw new Error('Invalid race ID');
    }
  }

  public async getRankings(race: Race, options: RaceOptions) {
    this.checkRaceID(race);
  
    const { data } = await this.instance.get('nat_rankings.php', {
      params: {
        ...defaultOptions,
        ...options,
        idepr: race,
      },
    });

    const dom = new JSDOM(data);
    const items: any[] = [];
    dom.window.document.querySelector('.spacer + table')?.querySelectorAll('tr').forEach(el => {
      const swimmer = el.querySelector('td:nth-child(2) a') as HTMLAnchorElement;
      const club = el.querySelector('td:nth-child(3) a') as HTMLAnchorElement;
      const time = (el.querySelector('td:nth-child(4)') as HTMLAnchorElement).textContent?.trim();
      const parsedTime = /(\d{2}):(\d{2})\.(\d{2})/.exec(time as string);
      const points = (el.querySelector('td:nth-child(5) nobr') as Element).textContent?.trim();
      const { name, birthyear, age } = /(?<name>.+)\s\((?<birthyear>\d+)\/(?<age>\d+).*/
        .exec(swimmer.childNodes.item(0).textContent!.trim())!.groups!;

      const [lastname, firstname] = name.split(' ').reduce(((acc, word) => {
        if (word.toUpperCase() === word) {
          acc[0] = `${acc[0]} ${word}`.trim();
        } else {
          acc[1] = `${acc[1]} ${word}`.trim();
        }
        return acc;
      }), ['', '']);

      const entry = {
        swimmer: {
          firstname,
          lastname,
          birthyear: +birthyear,
          age: +age,
          href: `${URL}/${swimmer.href}`,
        },
        club: {
          name: club.textContent?.trim(),
        },
        time: {
          display: time,
          minutes: parsedTime ? +parsedTime[1] : null,
          seconds: parsedTime ? +parsedTime[2] : null,
          hundredths: parsedTime ? +parsedTime[3] : null,
        },
        points: parseInt(points!),
      };

      items.push(entry);
    });

    return items;
  }
}