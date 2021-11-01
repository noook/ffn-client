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