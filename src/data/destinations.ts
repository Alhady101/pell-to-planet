/**
 * Where the author is working toward next. Shared between the hero globe,
 * which plots them, and the page, which names them.
 *
 * Coordinates are the capital, or the city most relevant to studying there.
 * Grouped only so the list reads clearly; the order is not a ranking.
 */
export interface Destination {
  name: string;
  lat: number;
  lon: number;
  region: 'Europe' | 'Central Asia' | 'Gulf' | 'East Asia';
}

export const DESTINATIONS: Destination[] = [
  { name: 'United Kingdom', lat: 51.507, lon: -0.128, region: 'Europe' },
  { name: 'France', lat: 48.857, lon: 2.352, region: 'Europe' },
  { name: 'Spain', lat: 40.417, lon: -3.704, region: 'Europe' },
  { name: 'Netherlands', lat: 52.37, lon: 4.895, region: 'Europe' },
  { name: 'Germany', lat: 52.52, lon: 13.405, region: 'Europe' },
  { name: 'Switzerland', lat: 47.377, lon: 8.542, region: 'Europe' },
  { name: 'Finland', lat: 60.17, lon: 24.941, region: 'Europe' },
  { name: 'Lithuania', lat: 54.687, lon: 25.28, region: 'Europe' },
  { name: 'Russia', lat: 55.756, lon: 37.617, region: 'Europe' },
  { name: 'Kazakhstan', lat: 51.169, lon: 71.449, region: 'Central Asia' },
  { name: 'Uzbekistan', lat: 41.299, lon: 69.24, region: 'Central Asia' },
  { name: 'Kyrgyzstan', lat: 42.874, lon: 74.57, region: 'Central Asia' },
  { name: 'Saudi Arabia', lat: 24.713, lon: 46.675, region: 'Gulf' },
  { name: 'United Arab Emirates', lat: 24.453, lon: 54.377, region: 'Gulf' },
  { name: 'China', lat: 39.904, lon: 116.407, region: 'East Asia' },
  { name: 'South Korea', lat: 37.567, lon: 126.978, region: 'East Asia' },
];

export const REGIONS: Destination['region'][] = ['Europe', 'Central Asia', 'Gulf', 'East Asia'];
