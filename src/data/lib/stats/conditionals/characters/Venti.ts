import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Venti = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      trace: `Normal Attack`,
      title: `Divine Marksmanship`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, favorable winds will accumulate on the arrowhead. A fully charged wind arrow will deal <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Skyward Sonnet`,
      content: `O wind upon which all hymns and songs fly, bear these earth-walkers up into the sky!
      <br />
      <br /><b>Press</b>
      <br />Summons a Wind Domain at the opponent's location, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b> and launching opponents into the air.
      <br />
      <br /><b>Hold</b>
      <br />Summons an even larger Wind Domain with Venti as the epicenter, dealing <b class="text-genshin-anemo">AoE Anemo DMG</b> and launching affected opponents into the air.
      <br />After unleashing the <b>Hold</b> version of this ability, Venti rides the wind into the air.
      <br />
      <br />Opponents hit by Skyward Sonnet will fall to the ground slowly.`,
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Wind's Grand Ode`,
      content: `Fires off an arrow made of countless coalesced winds, creating a huge Stormeye that sucks in opponents and deals continuous <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the Stormeye comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will deal additional <b>elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.
      `,
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Embrace of Winds`,
      content: `Holding Skyward Sonnet creates an upcurrent that lasts for <span class="text-desc">20</span>s.`,
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Stormeye`,
      content: `Regenerates <span class="text-desc">15</span> Energy for Venti after the effects of Wind's Grand Ode end. If an Elemental Absorption occurred, this also restores <span class="text-desc">15</span> Energy to all characters of that corresponding element in the party.`,
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Windrider`,
      content: `Decreases gliding Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `Splitting Gales`,
      content: `Fires <span class="text-desc">2</span> additional arrows per Aimed Shot, each dealing <span class="text-desc">33%</span> of the original arrow's DMG.`,
    },
    c2: {
      trace: `Constellation 2`,
      title: `Breeze of Reminiscence`,
      content: `Skyward Sonnet decreases opponents' <b class="text-genshin-anemo">Anemo RES</b> and <b>Physical RES</b> by <span class="text-desc">12%</span> for <span class="text-desc">10</span>s.
      <br />Opponents launched by Skyward Sonnet suffer an additional <span class="text-desc">12%</span> <b class="text-genshin-anemo">Anemo RES</b> and <b>Physical RES</b> decrease while airborne.`,
    },
    c3: {
      trace: `Constellation 3`,
      title: `Ode to Thousand Winds`,
      content: `Increases the Level of Wind's Grand Ode by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      trace: `Constellation 4`,
      title: `Hurricane of Freedom`,
      content: `When Venti picks up an Elemental Orb or Particle, he receives a <span class="text-desc">25%</span> <b class="text-genshin-anemo">Anemo DMG</b> Bonus for <span class="text-desc">10</span>s.`,
    },
    c5: {
      trace: `Constellation 5`,
      title: `Concerto dal Cielo`,
      content: `Increases the Level of Skyward Sonnet by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      trace: `Constellation 6`,
      title: `Storm of Defiance`,
      content: `Targets who take DMG from Wind's Grand Ode have their <b class="text-genshin-anemo">Anemo RES</b> decreased by <span class="text-desc">20%</span>.
      <br />If an Elemental Absorption occurred, then their <b>RES</b> towards the corresponding Element is also decreased by <span class="text-desc">20%</span>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'element',
      id: 'venti_absorb',
      text: `Burst Elemental Absorption`,
      ...talents.burst,
      show: true,
      default: Element.PYRO,
    },
    {
      type: 'number',
      id: 'venti_c2',
      text: `C2 RES Shred Stacks`,
      ...talents.c2,
      show: c >= 2,
      default: 1,
      min: 0,
      max: 2,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'venti_c4',
      text: `C4 Anemo DMG Bonus`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
    {
      type: 'toggle',
      id: 'venti_c6',
      text: `C6 RES Shred`,
      ...talents.c6,
      show: c >= 6,
      default: true,
      debuff: true,
    },
  ]

  const teammateContent: IContent[] = [
    findContentById(content, 'venti_absorb'),
    findContentById(content, 'venti_c2'),
    findContentById(content, 'venti_c6'),
  ]

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
          name: '1-Hit [x2]',
          value: [{ scaling: calcScaling(0.2038, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.4438, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.5237, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit [x2]',
          value: [{ scaling: calcScaling(0.2606, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.5065, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '6-Hit',
          value: [{ scaling: calcScaling(0.7095, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Aimed Shot',
          value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Fully-Charged Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Press DMG',
          value: [{ scaling: calcScaling(2.76, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(3.8, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `DoT`,
          value: [{ scaling: calcScaling(0.376, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: `Additional Elemental DMG`,
          value: [{ scaling: calcScaling(0.188, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.venti_absorb,
          property: TalentProperty.BURST,
        },
      ]

      if (c >= 1)
        base.CHARGE_SCALING.push(
          {
            name: 'C1 Additional Physical Arrows [x2]',
            value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1') * 0.33, multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.CA,
          },
          {
            name: 'C1 Additional Anemo Arrows [x2]',
            value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt') * 0.33, multiplier: Stats.ATK }],
            element: Element.ANEMO,
            property: TalentProperty.CA,
          }
        )

      if (form.venti_c2) {
        base.ANEMO_RES_PEN += 0.12 * form.venti_c2
        base.PHYSICAL_RES_PEN += 0.12 * form.venti_c2
      }
      if (form.venti_c4) base[Stats.ANEMO_DMG] += 0.25
      if (form.venti_c6) {
        base.ANEMO_RES_PEN += 0.2
        base[`${form.venti_absorb.toUpperCase()}_RES_PEN`] += 0.2
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.venti_c2) {
        base.ANEMO_RES_PEN += 0.12 * form.venti_c2
        base.PHYSICAL_RES_PEN += 0.12 * form.venti_c2
      }
      if (form.venti_c6) {
        base.ANEMO_RES_PEN += 0.2
        base[`${form.venti_absorb.toUpperCase()}_RES_PEN`] += 0.2
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Venti
