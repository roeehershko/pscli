export interface Pixel {
  target: string;
}

export interface Language {
  title: string;
  code: string;
}

export interface Country {
  iso2: string;
  title: string;
}

export interface State {
  country: Country;
  title: string;
}

export interface City {
  country: Country;
  title: string;
}

export interface Source {
  id?: string;
  title: string;
}

export interface Campaign {
  title: string;
  pixels: Pixel[];
  languages: Language[];
  countries: Country[];
  states: State[];
  cities: City[];
}
