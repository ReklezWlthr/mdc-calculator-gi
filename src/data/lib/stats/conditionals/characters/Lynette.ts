import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/genshin/conditional'
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
    },
    skill: {
      title: `Enigmatic Feint`,
      content: `Flicks her mantle and executes an Enigma Thrust, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />When the Enigma Thrust hits an opponent, it will restore Lynette's HP based on her Max HP, and in the <span class="text-desc">4</span>s afterward, she will lose a certain amount of HP per second.
      <br />Based on whether you press or hold this ability, she will use Enigma Thrust differently.
      <br />
      <br /><b>Press</b>
      <br />She swiftly uses an Enigma Thrust.
      <br />
      <br /><b>Hold</b>
      <br />Lynette will enter a high-speed Pilfering Shadow state and apply Shadowsign to a nearby opponent. You can control her movement direction during this state, and you can end it prematurely by using this skill again.
      <br />When this high-speed state ends, Lynette will unleash her Enigma Thrust. If there is an opponent with Shadowsign applied to them nearby, Lynette will approach them in a flash before using Enigma Thrust.
      <br />
      <br />A maximum of <span class="text-desc">1</span> opponent can have Shadowsign at any one time. When this opponent gets too far from Lynette, the Shadowsign will be canceled.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />At specific intervals, Lynette will unleash a Surging Blade when she uses Enigma Thrust, dealing <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-anemo">Anemo DMG</b>.
      `,
    },
    burst: {
      title: `Magic Trick: Astonishing Shift`,
      content: `Lynette raises her mantle high, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b>, using skillful sleight of hand to make a giant Bogglecat Box appear!
      <br />
      <br /><b>Bogglecat Box</b>
      <br />- Taunts nearby opponents, attracting their attacks.
      <br />- Deals <b class="text-genshin-anemo">Anemo DMG</b> to nearby opponents at intervals.
      <br />- When the Bogglecat Box comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will gain the corresponding element and additionally fire Vivid Shots that will deal DMG from that element at intervals.
      <br />Elemental Absorption of this kind will only occur once during this ability's duration.`,
    },
    a1: {
      title: `A1: Sophisticated Synergy`,
      content: `Within <span class="text-desc">10</span>s after using Magic Trick: Astonishing Shift, when there are <span class="text-desc">1/2/3/4</span> Elemental Types in the party, all party members' ATK will be increased by <span class="text-desc">8%/12%/16%/20%</span> respectively.`,
    },
    a4: {
      title: `A4: Props Positively Prepped`,
      content: `After the Bogglecat Box summoned by Magic Trick: Astonishing Shift performs Elemental Conversion, Lynette's Elemental Burst will deal <span class="text-desc">15%</span> more DMG. This effect will persist until the Bogglecat Box's duration ends.`,
    },
    util: {
      title: `Loci-Based Mnemonics`,
      content: `Shows the location of nearby Recovery Orbs on the minimap. The Aquatic Stamina and HP gained from touching Orbs will be increased by <span class="text-desc">25%</span>.`,
    },
    c1: {
      title: `C1: A Cold Blade Like a Shadow`,
      content: `When Enigmatic Feint's Enigma Thrust hits an opponent with Shadowsign, a vortex will be created at that opponent's position that will pull nearby opponents in.`,
    },
    c2: {
      title: `C2: Endless Mysteries`,
      content: `Whenever the Bogglecat Box summoned by Magic Trick: Astonishing Shift fires a Vivid Shot, it will fire an extra Vivid Shot.`,
    },
    c3: {
      title: `C3: Cognition-Inverting Gaze`,
      content: `Increases the Level of Magic Trick: Astonishing Shift by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Tacit Coordination`,
      content: `Increases Enigmatic Feint's charges by <span class="text-desc">1</span>.`,
    },
    c5: {
      title: `C5: Obscuring Ambiguity`,
      content: `Increases the Level of Enigmatic Feint by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Watchful Eye`,
      content: `When Lynette uses Enigmatic Feint's Enigma Thrust, she will gain an <b class="text-genshin-anemo">Anemo Infusion</b> and <span class="text-desc">20%</span> <b class="text-genshin-anemo">Anemo DMG Bonus</b> for <span class="text-desc">6</span>s.`,
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
            base[Stats.P_ATK] += 0.08
          case 2:
            base[Stats.P_ATK] += 0.12
          case 3:
            base[Stats.P_ATK] += 0.16
          case 4:
            base[Stats.P_ATK] += 0.2
        }
      }
      if (form.lynette_a4) base.BURST_DMG += 0.15
      if (form.lynette_c6_infusion) {
        base.infuse(Element.ANEMO)
        base[Stats.ANEMO_DMG] += 0.2
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.lynette_a1) {
        switch (uniqueCount) {
          case 1:
            base[Stats.P_ATK] += 0.08
          case 2:
            base[Stats.P_ATK] += 0.12
          case 3:
            base[Stats.P_ATK] += 0.16
          case 4:
            base[Stats.P_ATK] += 0.2
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
