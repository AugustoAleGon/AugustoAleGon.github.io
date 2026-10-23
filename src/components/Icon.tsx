import type { CSSProperties } from 'react';

const paths = {
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  moon: 'M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  external: 'M7 17 17 7M7 7h10v10',
  down: 'M12 4v15m-6-6 6 6 6-6',
  back: 'm14 6-6 6 6 6',
  home: 'm3 10 9-7 9 7v10h-6v-7H9v7H3Z',
  reset: 'M4 10a8 8 0 1 1 1 7M4 4v6h6',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6',
  play: 'm9 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14',
  check: 'm5 12 4 4L19 6',
  plus: 'M12 5v14M5 12h14',
  mail: 'M3 5h18v14H3Zm0 1 9 7 9-7',
  send: 'm3 3 19 9-19 9 4-9Zm4 9h15',
  wifi: 'M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 16a5 5 0 0 1 6 0M12 20h.01',
  sound: 'M4 9h4l5-4v14l-5-4H4ZM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  note: 'M5 3h14v18H5Zm4 5h6m-6 4h6m-6 4h4',
  share: 'M12 16V3m-5 5 5-5 5 5M5 12v8h14v-8',
  ball: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3v18M5 6c7 2 7 10 14 12M19 6c-7 2-7 10-14 12',
  leaf: 'M20 4C7 2 2 9 6 17s16 2 14-13ZM5 20 16 9',
};
export type IconName = keyof typeof paths;
export default function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
