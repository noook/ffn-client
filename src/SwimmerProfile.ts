import api from './api';
import {JSDOM} from "jsdom";
import {parseName, parseTableRowTimeEntry} from "./parsers";
import {RaceEntry, Sex} from "./types";

export class SwimmerProfile {
  private readonly endpoint = '/nat_recherche.php';

  private readonly id: number | string;

  constructor(id: number | string) {
    this.id = id;
  }

  get href(): string {
    const url = new URL(api.defaults.baseURL + this.endpoint);
    url.searchParams.append('idrch_id', this.id.toString());
    return url.href;
  }

  private parseTimes(dom: JSDOM): { shortCourses: RaceEntry[]; longCourses: RaceEntry[] } {
    const document = dom.window.document;
    const sex: Sex = document.querySelector('.titre12nat > i')!.classList.contains('fa-venus') ? 'f' : 'm';
    const headers = document.querySelectorAll<HTMLTableRowElement>('.tetiere');
    const shortCourseHeader = Object.values(headers).find(element => element.textContent!.includes('25'))!;
    const shortCourseHeaderIndex = (shortCourseHeader.parentElement as HTMLTableRowElement).rowIndex;
    const longCourseHeader = Object.values(headers).find(element => element.textContent!.includes('50'))!;
    const longCourseHeaderIndex = longCourseHeader ? (longCourseHeader.parentElement as HTMLTableRowElement).rowIndex : undefined;

    const shortCourses = Object.values(shortCourseHeader.closest('tbody')!.children)
      .slice(shortCourseHeaderIndex, longCourseHeaderIndex)
      .filter(el => el.matches('[onmouseover]')) as HTMLTableRowElement[];

    const longCourses = longCourseHeader
      ?  Object.values(shortCourseHeader.closest('tbody')!.children)
            .slice(longCourseHeaderIndex)
            .filter(el => el.matches('[onmouseover]')) as HTMLTableRowElement[]
      : [];

    return {
      shortCourses: shortCourses.map(el => parseTableRowTimeEntry(el, 25 , sex)),
      longCourses: longCourses.map(el => parseTableRowTimeEntry(el, 50 , sex)),
    }
  }

  async fetch() {
    const { data } = await api.get(this.endpoint, {
      params: {
        idrch_id: this.id,
      },
    });

    const dom = new JSDOM(data);
    const document = dom.window.document;

    const title = document.querySelector('#mainResCpt .titre12nat')!.childNodes.item(0).textContent!.trim();
    const birthyear = +title.match(/\((?<birthyear>\d+)\)/)!.groups!.birthyear;
    const name = parseName(title.replace(/\s\(\d+.+/, ''));
    const nat = document.querySelector('#mainResCpt .titre12nat')!.childNodes.item(2).textContent!.trim();
    const swimmer = {
      id: this.id.toString(),
      ...name,
      nat,
      birthyear,
    };

    const races = this.parseTimes(dom);

    return {
      swimmer,
      races,
    };
  }
}
