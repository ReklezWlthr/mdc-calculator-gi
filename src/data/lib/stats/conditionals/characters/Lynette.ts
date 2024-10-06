import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Lynette = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamData = _.map(team, (item) => findCharacter(item.cId)?.element)
  const uniqueCount = _.uniq(teamData).length

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Rapid Ritesword`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Enigmatic Feint`,
      content: `Flicks her mantle and executes an <b>Enigma Thrust</b>, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />When the <b>Enigma Thrust</b> hits an opponent, it will restore Lynette's HP based on her Max HP, and in the <span class="text-desc">4</span>s afterward, she will lose a certain amount of HP per second.
      <br />Based on whether you press or hold this ability, she will use <b>Enigma Thrust</b> differently.
      <br />
      <br /><b>Press</b>
      <br />She swiftly uses an <b>Enigma Thrust</b>.
      <br />
      <br /><b>Hold</b>
      <br />Lynette will enter a high-speed <b>Pilfering Shadow</b> state and apply <b class="text-genshin-anemo">Shadowsign</b> to a nearby opponent. You can control her movement direction during this state, and you can end it prematurely by using this skill again.
      <br />When this high-speed state ends, Lynette will unleash her <b>Enigma Thrust</b>. If there is an opponent with <b class="text-genshin-anemo">Shadowsign</b> applied to them nearby, Lynette will approach them in a flash before using Enigma Thrust.
      <br />
      <br />A maximum of <span class="text-desc">1</span> opponent can have <b class="text-genshin-anemo">Shadowsign</b> at any one time. When this opponent gets too far from Lynette, the <b class="text-genshin-anemo">Shadowsign</b> will be canceled.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />At specific intervals, Lynette will unleash a <b class="text-genshin-ousia">Surging Blade</b> when she uses <b>Enigma Thrust</b>, dealing <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-anemo">Anemo DMG</b>.
      `,
      image: 'Skill_S_Linette_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Magic Trick: Astonishing Shift`,
      content: `Lynette raises her mantle high, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b>, using skillful sleight of hand to make a giant <b class="text-genshin-anemo">Bogglecat Box</b> appear!
      <br />
      <br /><b class="text-genshin-anemo">Bogglecat Box</b>
      <br />- Taunts nearby opponents, attracting their attacks.
      <br />- Deals <b class="text-genshin-anemo">Anemo DMG</b> to nearby opponents at intervals.
      <br />- When the <b class="text-genshin-anemo">Bogglecat Box</b> comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will gain the corresponding element and additionally fire <b class="text-genshin-anemo">Vivid Shots</b> that will deal DMG from that element at intervals.
      <br />Elemental Absorption of this kind will only occur once during this ability's duration.`,
      image: 'Skill_E_Linette_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Sophisticated Synergy`,
      content: `Within <span class="text-desc">10</span>s after using <b>Magic Trick: Astonishing Shift</b>, when there are <span class="text-desc">1/2/3/4</span> Elemental Types in the party, all party members' ATK will be increased by <span class="text-desc">8%/12%/16%/20%</span> respectively.`,
      image: 'UI_Talent_S_Linette_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Props Positively Prepped`,
      content: `After the <b class="text-genshin-anemo">Bogglecat Box</b> summoned by <b>Magic Trick: Astonishing Shift</b> performs Elemental Conversion, Lynette's Elemental Burst will deal <span class="text-desc">15%</span> more DMG. This effect will persist until the <b class="text-genshin-anemo">Bogglecat Box</b>'s duration ends.`,
      image: 'UI_Talent_S_Linette_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Loci-Based Mnemonics`,
      content: `Shows the location of nearby Recovery Orbs on the minimap. The Aquatic Stamina and HP gained from touching Orbs will be increased by <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_S_Linette_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `A Cold Blade Like a Shadow`,
      content: `When <b>Enigmatic Feint</b>'s <b>Enigma Thrust</b> hits an opponent with <b class="text-genshin-anemo">Shadowsign</b>, a vortex will be created at that opponent's position that will pull nearby opponents in.`,
      image: 'UI_Talent_S_Linette_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Endless Mysteries`,
      content: `Whenever the <b class="text-genshin-anemo">Bogglecat Box</b> summoned by <b>Magic Trick: Astonishing Shift</b> fires a <b class="text-genshin-anemo">Vivid Shot</b>, it will fire an extra <b class="text-genshin-anemo">Vivid Shot</b>.`,
      image: 'UI_Talent_S_Linette_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Cognition-Inverting Gaze`,
      content: `Increases the Level of <b>Magic Trick: Astonishing Shift</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Linette_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Tacit Coordination`,
      content: `Increases <b>Enigmatic Feint</b>'s charges by <span class="text-desc">1</span>.`,
      image: 'UI_Talent_S_Linette_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Obscuring Ambiguity`,
      content: `Increases the Level of <b>Enigmatic Feint</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Linette_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Watchful Eye`,
      content: `When Lynette uses <b>Enigmatic Feint</b>'s <b>Enigma Thrust</b>, she will gain an <b class="text-genshin-anemo">Anemo Infusion</b> and <span class="text-desc">20%</span> <b class="text-genshin-anemo">Anemo DMG Bonus</b> for <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Linette_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'element',
      id: 'vivid_shot',
      text: `Vivid Shot Element`,
      ...talents.burst,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'toggle',
      id: 'lynette_a1',
      text: `A1 Burst ATK Buff`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'lynette_a4',
      text: `A4 Burst Conversion Buff`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'lynette_c6_infusion',
      text: `C6 Anemo Infusion`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'lynette_a1')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 60

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4308, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3761, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.2789, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.2159, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6315, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.442, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.614, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)

      base.SKILL_SCALING = [
        {
          name: 'Enigma Thrust DMG',
          value: [{ scaling: calcScaling(2.68, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.312, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.832, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Bogglecat Box DMG',
          value: [{ scaling: calcScaling(0.512, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Vivid Shot DMG',
          value: [{ scaling: calcScaling(0.456, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.vivid_shot,
          property: TalentProperty.BURST,
        },
      ]

      if (form.lynette_a1) {
        switch (uniqueCount) {
          case 1:
            base[Stats.P_ATK].push({ value: 0.08, name: 'Ascension 1 Passive', source: `Self` })
            break
          case 2:
            base[Stats.P_ATK].push({ value: 0.12, name: 'Ascension 1 Passive', source: `Self` })
            break
          case 3:
            base[Stats.P_ATK].push({ value: 0.16, name: 'Ascension 1 Passive', source: `Self` })
            break
          case 4:
            base[Stats.P_ATK].push({ value: 0.2, name: 'Ascension 1 Passive', source: `Self` })
            break
        }
      }
      if (form.lynette_a4) base.BURST_DMG.push({ value: 0.15, name: 'Ascension 4 Passive', source: `Self` })
      if (form.lynette_c6_infusion) {
        base.infuse(Element.ANEMO)
        base[Stats.ANEMO_DMG].push({ value: 0.2, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.lynette_a1) {
        switch (uniqueCount) {
          case 1:
            base[Stats.P_ATK].push({ value: 0.08, name: 'Ascension 1 Passive', source: `Lynette` })
            break
          case 2:
            base[Stats.P_ATK].push({ value: 0.12, name: 'Ascension 1 Passive', source: `Lynette` })
            break
          case 3:
            base[Stats.P_ATK].push({ value: 0.16, name: 'Ascension 1 Passive', source: `Lynette` })
            break
          case 4:
            base[Stats.P_ATK].push({ value: 0.2, name: 'Ascension 1 Passive', source: `Lynette` })
            break
        }
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Lynette
