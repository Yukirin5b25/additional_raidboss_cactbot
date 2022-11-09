

Options.Triggers.push({
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  initData: () => {
    return {
      actHeadmarkers: {},
    };
  },
  triggers: [
    {
      id: 'DSR Doom Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'BA0' }),
      preRun: (data, matches) => {
        data.doomPriorities = {};
        data.hasDoom[matches.target] = true;
      },
      alertText: (data, _matches, output) => {
        if (Object.keys(data.hasDoom).length < 4) return;

        // jobEnumArray https://github.com/quisquous/cactbot/blob/e4f4b943add8298db63e3debc57ba508df83b16b/resources/util.ts#L7
        const jobPriority = [
          0,  // NON none
          0,  // GLA basic/crafting/gathering
          0,  // PGL basic/crafting/gathering
          0,  // MRD basic/crafting/gathering
          0,  // LNC basic/crafting/gathering
          0,  // ARC basic/crafting/gathering
          0,  // CNJ basic/crafting/gathering
          0,  // THM basic/crafting/gathering
          0,  // CRP basic/crafting/gathering
          0,  // BSM basic/crafting/gathering
          0,  // ARM basic/crafting/gathering
          0,  // GSM basic/crafting/gathering
          0,  // LTW basic/crafting/gathering
          0,  // WVR basic/crafting/gathering
          0,  // ALC basic/crafting/gathering
          0,  // CUL basic/crafting/gathering
          0,  // MIN basic/crafting/gathering
          0,  // BTN basic/crafting/gathering
          0,  // FSH basic/crafting/gathering
          4,  // PLD paladin
          11, // MNK monk
          2,  // WAR warrior
          12, // DRG dragoon
          14, // BRD bard
          5,  // WHM white mage
          17, // BLM black mage
          0,  // ACN basic/crafting/gathering
          19, // SMN sommoner
          8,  // SCH scholar
          0,  // ROG basic/crafting/gathering
          10, // NIN ninja
          16, // MCH machinist
          1,  // DRK dark kngight
          6,  // AST astrologer
          9,  // SAM samurai
          18, // RDM red maged
          0,  // BLU blue mage
          3,  // GNB gunbreaker
          15, // DNC dancer
          13, // RPR reaper
          7,  // SGE sage
        ];

        var orderedDooms = {};

        // console.log("OrderedDooms: ", Object.keys(orderedDooms), Object.values(orderedDooms));
        Object.keys(data.party.details).forEach((id) => {
          var current = data.party.details[id]
          orderedDooms[current.name] = data.hasDoom[current.name] ? (jobPriority[current.job]) || 8 : (jobPriority[current.job] || 8) + 100;
          console.log("    name    : ", current.name);
          console.log("    priority: ", orderedDooms[current.name]);
        });

        data.doomPriorities = Object.keys(orderedDooms).sort((a, b) => orderedDooms[a] - orderedDooms[b]);

        // console.log("DoomPriorities: ", data.doomPriorities);

        const myPriority = data.doomPriorities.indexOf(data.me) + 1;

        var response;
        if (myPriority > 4) {
          response = output.noDoom({ priority: (myPriority - 4) });
        } else {
          response = output.doomOnYou({ priority: myPriority });
        }
        return response;
      },
      outputStrings: {
        doomOnYou: {
          en: 'Doom on YOU ${priority}',
          de: 'Verhängnis auf DIR ${priority}',
          ja: '自分に死の宣告 ${priority}',
          cn: '死宣点名 ${priority}',
        },
        noDoom: {
          en: 'No Doom ${priority}',
          de: 'Kein Verhängnis ${priority}',
          ja: '自分は無職 ${priority}',
          cn: '无死宣 ${priority}',
        },
      }
    },
    {
      id: 'DSR Dragon Eyes',
      type: 'GainsEffect',
      netRegex: NetRegexes.ability({ id: '63CA', source: 'King Thordan', capture: false }),
      promise: async (data) => {
        console.log("Data: ", Object.keys(data));
        const combatantData = await callOverlayHandler({
          call: 'getCombatants',
          names: '骑神托尔丹',
        });
        console.log("CombatantData: ", combatantData.length)
        console.log(Object.keys(combatantData.length[0]), Object.values(combatantData.length[0]));
      }
    }
  ],
});