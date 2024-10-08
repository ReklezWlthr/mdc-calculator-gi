import { findCharacter, findContentById } from '@src/core/utils/finder'
import _, { multiply } from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kazuha = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Garyuu Bladework`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact. If this Plunging Attack is triggered by <b>Chihayaburu</b>, it will be converted to <b>Plunging Attack: Midare Ranzan</b>.
      <br />
      <br /><b>Plunging Attack: Midare Ranzan</b>
      <br />When a Plunging Attack is performed using the effects of the Elemental Skill <b>Chihayaburu</b>, Plunging Attack DMG is converted to <b class="text-genshin-anemo">Anemo DMG</b> and will create a small wind tunnel via a secret blade technique that pulls in nearby objects and opponents.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Chihayaburu`,
      content: `Unleashes a secret technique as fierce as the rushing wind that pulls objects and opponents towards Kazuha's current position before launching opponents within the AoE, dealing <b class="text-genshin-anemo">Anemo DMG</b> and lifting Kazuha into the air on a rushing gust of wind.
      <br />Within <span class="text-desc">10</span>s of remaining airborne after casting <b>Chihayaburu</b>, Kazuha can unleash a powerful Plunging Attack known as <b>Midare Ranzan</b>.
      <br />
      <br /><b>Press</b>
      <br />Can be used in mid-air.
      <br />
      <br /><b>Hold</b>
      <br />Charges up before unleashing greater <b class="text-genshin-anemo">Anemo DMG</b> over a larger AoE than <b>Press</b> Mode.
      <br />
      <br /><b>Plunging Attack: Midare Ranzan</b>
      <br />When a Plunging Attack is performed using the effects of the Elemental Skill <b>Chihayaburu</b>, Plunging Attack DMG is converted to <b class="text-genshin-anemo">Anemo DMG</b>. On landing, Kazuha creates a small wind tunnel via a secret blade technique that pulls in nearby objects and opponents.
      <br /><b>Midare Ranzan</b>'s DMG is considered Plunging Attack DMG.
      `,
      image: 'Skill_S_Kazuha_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Kazuha Slash`,
      content: `The signature technique of Kazuha's self-styled bladework — a single slash that strikes with the force of the first winds of autumn, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b>.
      <br />The blade's passage will leave behind a field named <b>Autumn Whirlwind</b> that periodically deals <b class="text-genshin-anemo">AoE Anemo DMG</b> to opponents within its range.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If <b>Autumn Whirlwind</b> comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will deal additional elemental DMG of that type.
      <br />Elemental Absorption may only occur once per use.`,
      image: 'Skill_E_Kazuha_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Soumon Swordsmanship`,
      content: `If <b>Chihayaburu</b> comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b> when cast, <b>Chihayaburu</b> will absorb that element and if <b>Plunging Attack: Midare Ranzan</b> is used before the effect expires, it will deal an additional <span class="text-desc">200%</span> ATK of the absorbed elemental type as DMG. This will be considered Plunging Attack DMG.
      <br />Elemental Absorption may only occur once per use of <b>Chihayaburu</b>.`,
      image: 'UI_Talent_S_Kazuha_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Poetics of Fuubutsu`,
      content: `Upon triggering a Swirl reaction, Kaedehara Kazuha will grant all party members a <span class="text-desc">0.04%</span> Elemental DMG Bonus to the element absorbed by Swirl for every point of Elemental Mastery he has for <span class="text-desc">8</span>s. Bonuses for different elements obtained through this method can co-exist.`,
      image: 'UI_Talent_S_Kazuha_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Cloud Strider`,
      content: `Decreases sprinting Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Sprint',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Scarlet Hills`,
      content: `Decreases <b>Chihayaburu</b>'s CD by <span class="text-desc">10%</span>.
      <br />Using <b>Kazuha Slash</b> resets the CD of <b>Chihayaburu</b>.`,
      image: 'UI_Talent_S_Kazuha_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Yamaarashi Tailwind`,
      content: `The <b>Autumn Whirlwind</b> field created by <b>Kazuha Slash</b> has the following effects:
      <br />- Increases Kaedehara Kazuha's own Elemental Mastery by <span class="text-desc">200</span> for its duration.
      <br />- Increases the Elemental Mastery of characters within the field by <span class="text-desc">200</span>.
      <br />
      <br />The Elemental Mastery-increasing effects of this Constellation do not stack.`,
      image: 'UI_Talent_S_Kazuha_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Maple Monogatari`,
      content: `Increases the Level of <b>Chihayaburu</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kazuha_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Oozora Genpou`,
      content: `When Kaedehara Kazuha's Energy is lower than <span class="text-desc">45</span>, he obtains the following effects:
      <br /><Pressing or Holding <b>Chihayaburu</b> regenerates <span class="text-desc">3</span> or <span class="text-desc">4</span> Energy for Kaedehara Kazuha, respectively.
      <br />When gliding, Kaedehara Kazuha regenerates <span class="text-desc">2</span> Energy per second.`,
      image: 'UI_Talent_S_Kazuha_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Wisdom of Bansei`,
      content: `Increases the Level of <b>Kazuha Slash</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kazuha_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Crimson Momiji`,
      content: `After using <b>Chihayaburu</b> or <b>Kazuha Slash</b>, Kaedehara Kazuha gains an <b class="text-genshin-anemo">Anemo Infusion</b> for 5s. Additionally, each point of Elemental Mastery will increase the DMG dealt by Kaedehara Kazuha's Normal, Charged, and Plunging Attacks by <span class="text-desc">0.2%</span>.`,
      image: 'UI_Talent_S_Kazuha_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'anemo_plunge',
      text: `Midare Ranzan`,
      ...talents.skill,
      show: true,
      default: true,
    },
    {
      type: 'element',
      id: 'burst_absorb',
      text: `Burst Absorption`,
      ...talents.burst,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'element',
      id: 'plunge_absorb',
      text: `Chihayaburu Absorption`,
      ...talents.a1,
      show: a >= 1,
      default: Element.PYRO,
    },
    {
      type: 'multiple',
      id: 'a4_swirl',
      text: `A4 Swirl Buff`,
      ...talents.a4,
      show: a >= 4,
      default: [],
    },
    {
      type: 'toggle',
      id: 'kazu_c2',
      text: `C2 Burst EM Share`,
      ...talents.c2,
      show: c >= 2,
      default: false,
    },
    {
      type: 'toggle',
      id: 'kazu_c6_infusion',
      text: `C6 Anemo Infusion`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'a4_swirl')]

  const allyContent: IContent[] = [findContentById(content, 'kazu_c2')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent,
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      base.MAX_ENERGY = 80

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.4498, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4524, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [1]',
          value: [{ scaling: calcScaling(0.258, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit [2]',
          value: [{ scaling: calcScaling(0.3096, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.6072, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit [x3]',
          value: [{ scaling: calcScaling(0.2537, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.43, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(0.7465, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('high', normal, form.anemo_plunge ? Element.ANEMO : Element.PHYSICAL)

      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(1.92, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(2.608, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Slashing DMG',
          value: [{ scaling: calcScaling(2.624, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'DoT',
          value: [{ scaling: calcScaling(1.2, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Additional ${form.burst_absorb} DMG`,
          value: [{ scaling: calcScaling(0.36, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.burst_absorb,
          property: TalentProperty.BURST,
        },
      ]

      if (form.plunge_absorb)
        base.PLUNGE_SCALING.push({
          name: `Additional ${form.plunge_absorb} DMG`,
          value: [{ scaling: 2, multiplier: Stats.ATK }],
          element: form.plunge_absorb,
          property: TalentProperty.PA,
        })

      if (form.kazu_c2) base[Stats.EM].push({ value: 200, name: 'Constellation 2', source: `Self` })
      if (form.kazu_c6_infusion) base.infuse(Element.ANEMO)

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (_.size(form.a4_swirl)) {
        _.forEach(form.a4_swirl, (item) =>
          base[`${item} DMG%`].push({
            value: 0.0004 * own.getEM(),
            name: 'Ascension 4 Passive',
            source: `Kaedehara Kazuha`,
          })
        )
      }
      if (aForm.kazu_c2) base[Stats.EM].push({ value: 200, name: 'Constellation 2', source: `Kaedehara Kazuha` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const index = _.findIndex(team, (item) => item.cId === '10000047')

      if (_.size(form.a4_swirl)) {
        _.forEach(form.a4_swirl, (item) =>
          base.CALLBACK.push(function (x, a) {
            x[`${item} DMG%`].push({
              value: 0.0004 * a[index].getEM(),
              name: 'Ascension 4 Passive',
              source: `Self`,
              base: a[index].getEM(),
              multiplier: toPercentage(0.0004, 2),
            })
            return x
          })
        )
      }
      if (c >= 6) {
        base.CALLBACK.push(function (x, a) {
          x.BASIC_DMG.push({
            value: 0.002 * a[index].getEM(),
            name: 'Constellation 6',
            source: `Self`,
            base: a[index].getEM(),
            multiplier: toPercentage(0.002),
          })
          x.CHARGE_DMG.push({
            value: 0.002 * a[index].getEM(),
            name: 'Constellation 6',
            source: `Self`,
            base: a[index].getEM(),
            multiplier: toPercentage(0.002),
          })
          x.PLUNGE_DMG.push({
            value: 0.002 * a[index].getEM(),
            name: 'Constellation 6',
            source: `Self`,
            base: a[index].getEM(),
            multiplier: toPercentage(0.002),
          })
          return x
        })
      }

      return base
    },
  }
}

export default Kazuha
