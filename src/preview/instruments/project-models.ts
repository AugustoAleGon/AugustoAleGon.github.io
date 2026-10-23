import type { Inputs } from './model';
export const formats = ['quiz', 'prediction', 'poll'] as const;
export function projectModel(id: 'puramente' | 'boom' | 'seen', phase: number, input: Inputs) {
  let blocked = false;
  let reason = '';
  let mask = [1, 1, 1, 1];
  let data: object;
  if (id === 'puramente') {
    blocked = !input.premium || (!input.online && !input.downloaded);
    reason = !input.premium ? 'premium' : !input.online && !input.downloaded ? 'download' : '';
    mask = [
      Number(input.premium),
      Number(input.downloaded),
      Number(!blocked),
      Number(input.health),
    ];
    data = {
      session: 'Fictional meditation',
      access: input.premium ? 'eligible' : 'premium required',
      source: blocked ? 'unavailable' : input.downloaded ? 'downloaded audio' : 'network audio',
      mix: { narration: input.narration, background: input.ambience },
      playback: blocked ? 'blocked' : ['selected', 'mix prepared', 'playing'][phase],
      healthKit: input.health ? 'optional completion record; not sent' : 'disabled',
    };
  } else if (id === 'boom') {
    blocked = !input.gameTitle.trim();
    reason = blocked ? 'title' : '';
    const format = formats[input.format];
    mask = [0, 1, 2, 3].map((i) => Number(i === input.format));
    data = {
      configuration: { title: input.gameTitle.trim(), format, component: `${format}View` },
      event: phase >= 1 && !blocked ? { type: 'example.selection', choice: input.choice } : null,
      storage:
        phase === 2 && !blocked
          ? 'validated local example; MongoDB responsibility illustrated'
          : 'draft',
    };
  } else {
    mask = [
      Number(input.cached),
      Number(!input.cached),
      Number(!input.spoiler),
      Number(input.spoiler),
    ];
    const raw =
      input.provider === 0
        ? { home_team: 'Harbor', away_team: 'Summit', home_score: 2, away_score: 1 }
        : {
            contestants: [
              { label: 'Harbor', points: 2 },
              { label: 'Summit', points: 1 },
            ],
          };
    const match =
      'home_team' in raw
        ? { home: raw.home_team, away: raw.away_team, score: [raw.home_score, raw.away_score] }
        : {
            home: raw.contestants[0].label,
            away: raw.contestants[1].label,
            score: raw.contestants.map((team) => team.points),
          };
    data = {
      request: 'fictional match',
      source: input.cached ? 'cache' : `provider ${input.provider + 1}`,
      providerConsulted: !input.cached && phase > 0,
      raw: input.cached || phase === 0 ? null : raw,
      response: phase === 2 ? match : null,
      display:
        phase === 2
          ? { ...match, score: input.spoiler ? 'hidden by Spoiler Shield' : match.score }
          : null,
      follows: input.following ? 'Supabase supporting account path' : 'no follow selected',
    };
  }
  return { blocked, reason, mask, payload: JSON.stringify(data, null, 2) };
}
