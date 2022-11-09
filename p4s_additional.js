Options.Triggers.push({
  zoneId: ZoneId.AsphodelosTheFourthCircleSavage,
  initData: () => {
    return {
      actHeadmarkers: {},
    };
  },
  triggers: [
    {
      id: 'P4S Bloodrake Duplicate',
      // AoE hits tethered players in first one, the non-tethered in second
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69D8', source: 'Hesperos', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69D8', source: 'Hesperos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69D8', source: 'Hespéros', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69D8', source: 'ヘスペロス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '69D8', source: '赫斯珀洛斯', capture: false }),
      preRun: (data) => data.bloodrakeCounterD = (data.bloodrakeCounterD ?? 0) + 1
    },
    {
      id: 'P4S Bloodrake Store Position',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '69D8', source: 'Hesperos' }),
      netRegexDe: NetRegexes.ability({ id: '69D8', source: 'Hesperos' }),
      netRegexFr: NetRegexes.ability({ id: '69D8', source: 'Hespéros' }),
      netRegexJa: NetRegexes.ability({ id: '69D8', source: 'ヘスペロス' }),
      netRegexCn: NetRegexes.ability({ id: '69D8', source: '赫斯珀洛斯' }),
      condition: (data) => (data.bloodrakeCounterD ?? 0) < 3,
      preRun: (data, matches) => {
        if ((data.bloodrakeCounterD ?? 0) === 1) {
          data.firstRaked = data.party.isDPS(matches.target) ? 'dps' : 'tank/healer';
        }
        if ((data.bloodrakeCounterD ?? 0) === 2) {
          data.secondRaked = data.party.isDPS(matches.target) ? 'dps' : 'tank/healer';
          data.debuffRolePosition = data.firstRaked === data.secondRaked ? 2 : 1;
        }
      },
      delaySeconds: 2,
      suppressSeconds: 1,
      alertText: (data) => {
        if ((data.bloodrakeCounterD ?? 0) === 2) {
          return data.secondRaked.indexOf(data.role) < 0 ? "分散接毒" : data.debuffRolePosition + "点集合";
        }
      },
      tts: (data) => {
        if ((data.bloodrakeCounterD ?? 0) === 2) {
          return data.secondRaked.indexOf(data.role) < 0 ? "分散接毒" : data.debuffRolePosition + "点集合";
        }
      }
    },
    {
      id: 'P4S Belone Coils Position',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'Hesperos' }),
      netRegexDe: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'Hesperos' }),
      netRegexFr: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'Hespéros' }),
      netRegexJa: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: 'ヘスペロス' }),
      netRegexCn: NetRegexes.startsUsing({ id: ['69DE', '69DF', '69E0', '69E1'], source: '赫斯珀洛斯' }),
      preRun: (data, matches) => {
        data.beloneCoilsCounter = (data.beloneCoilsCounter || 0) + 1;
        if (data.beloneCoilsCounter === 1) {
          delete data.firstRaked;
          delete data.secondRaked;
          delete data.debuffRolePosition;
          data.firstTowers = matches.id === '69DE' ? 'dps' : 'tank/healer';
        } else {
          data.secondTowers = matches.id === '69DE' ? 'dps' : 'tank/healer';
          data.debuffRolePosition = data.firstTowers === data.secondTowers ? 2 : 1;
        }
      },
      delaySeconds: 2,
      suppressSeconds: 1,
      alertText: (data) => {
        if (data.beloneCoilsCounter > 1) {
          return data.secondTowers.indexOf(data.role) < 0 ? "分散接毒" : data.debuffRolePosition + "点集合";
        }
      },
      tts: (data) => {
        if (data.beloneCoilsCounter > 1) {
          return data.secondTowers.indexOf(data.role) < 0 ? "分散接毒" : data.debuffRolePosition + "点集合";
        }
      }
    }
  ],
});