declare module './_build/DarkPlasma_DarkMap_parameters' {
  interface RGB {
    red: number;
    green: number;
    blue: number;
  }

  interface DarKMapSettings {
    darkness: number;
    lightColor: RGB;
    lightRadius: number;
  }
}

export const settings: Settings.DarKMapSettings;
