import {JSDOM} from "jsdom";
import {Identity, PoolLength, RaceList, RaceEntry, RaceLap, RaceTime, Sex} from "./types";
import {menRaceMap, womenRaceMap} from "./constants";

export function parseName(str: string): Identity {
  return str.split(' ').reduce(((acc, word) => {
    if (word.toUpperCase() === word) {
      acc.lastname = `${acc.lastname} ${word}`.trim().replace(/\*/g, '');
    } else {
      acc.firstname = `${acc.firstname} ${word}`.trim().replace(/\*/g, '');
    }
    return acc;
  }), { firstname: '', lastname: '' });
}

const timeRegex = /(\d{2}):(\d{2})\.(\d{2})/;

export function parseTime(timestring: string): RaceTime {
  const parsedTime = timeRegex.exec(timestring)!;

  return {
    display: parsedTime[0],
    minutes: +parsedTime[1],
    seconds: +parsedTime[2],
    hundredths: +parsedTime[3],
  };
}

export function parseDate(datestring: string): Date {
  const [d, m, y] = datestring.split('/');
  return new Date(Date.UTC(+y, +m - 1, +d));
}

export function parseLaps(table: HTMLTableElement) {
  const laps = Object.values(table.querySelectorAll('.tooltipDis')).map(line => {
    const distance = +line.textContent!.match(/^\d+/)![0];
    const splitEl = line.nextSibling!;
    const split = parseTime(splitEl.textContent!.match(timeRegex)![0]);
    const lapEl = splitEl.nextSibling!;
    let lap;
    try {
      lap = parseTime(lapEl.textContent!.match(timeRegex)![0]);
    } catch (e) {
      lap = null;
    }

    let relay;
    try {
      const relayEl = lapEl.nextSibling!;
      relay = relayEl.textContent ? relayEl.textContent.match(timeRegex)![0] : undefined;
    } catch (e) {}

    return {
      distance,
      split,
      lap,
      relay,
    } as RaceLap;
  });

  return laps.sort((a, b) => a.distance - b.distance);
}

export function parseTableRowTimeEntry(line: HTMLTableRowElement, poolLength: PoolLength, sex: Sex): RaceEntry {
  const raceName = line.querySelector('td:first-child')!.textContent! as RaceList;
  const timestring = line.querySelector('.nat-temps')!.textContent!;
  const age = +line.querySelector('.nat-age')!.textContent!.match(/\d+/)![0];
  const points = +line.querySelector('.nat-age + td')!.textContent!.match(/\d+/)![0];
  const locationContent = line.querySelector('.nat-lieu')!.textContent!.trim().replace(/[\r\n\t]/g, '');
  const date = line.querySelector('.nat-date')!.textContent!;
  const structure = line.querySelector('.nat-structure')!.textContent!;

  const lapsEl = line.querySelector('.nat-temps > a');
  const laps = [];

  if (lapsEl) {
    const lapsHtml = lapsEl.getAttribute('onmouseover')!
      .match(/<table.+<\/table>/)![0]
      .replace(/\\'/g, '"');
    const lapsDom = new JSDOM(lapsHtml);

    const unfilteredLaps = parseLaps(lapsDom.window.document.querySelector('table')!);
    const raceLength = +raceName.match(/^\d{2,4}/)![0];
    laps.push(...unfilteredLaps.filter(lap => lap.distance <= raceLength));
  }

  return {
    name: raceName,
    raceId: (sex === 'f' ? womenRaceMap : menRaceMap)[raceName],
    time: parseTime(timestring),
    laps,
    age,
    points,
    poolLength,
    location: {
      country: locationContent.match(/\(([A-Z]+)\)/)![1],
      city: locationContent.match(/\([A-Z]+\)(?<city>.+)/)!.groups!.city,
    },
    date: parseDate(date),
    structure,
  };
}
