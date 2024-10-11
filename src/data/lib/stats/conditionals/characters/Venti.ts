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
      level: normal,
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
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
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
      <br />Opponents hit by <b>Skyward Sonnet</b> will fall to the ground slowly.`,
      image: 'Skill_S_Venti_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Wind's Grand Ode`,
      content: `Fires off an arrow made of countless coalesced winds, creating a huge Stormeye that sucks in opponents and deals continuous <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the Stormeye comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, it will deal additional <b>Elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.
      `,
      image: 'Skill_E_Venti_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Embrace of Winds`,
      content: `Holding <b>Skyward Sonnet</b> creates an upcurrent that lasts for <span class="text-desc">20</span>s.`,
      image: 'UI_Talent_S_Venti_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Stormeye`,
      content: `Regenerates <span class="text-desc">15</span> Energy for Venti after the effects of <b>Wind's Grand Ode</b> end. If an Elemental Absorption occurred, this also restores <span class="text-desc">15</span> Energy to all characters of that corresponding element in the party.`,
      image: 'UI_Talent_S_Venti_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Windrider`,
      content: `Decreases gliding Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Glide',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Splitting Gales`,
      content: `Fires <span class="text-desc">2</span> additional arrows per Aimed Shot, each dealing <span class="text-desc">33%</span> of the original arrow's DMG.`,
      image: 'UI_Talent_S_Venti_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Breeze of Reminiscence`,
      content: `<b>Skyward Sonnet</b> decreases opponents' <b class="text-genshin-anemo">Anemo RES</b> and <b>Physical RES</b> by <span class="text-desc">12%</span> for <span class="text-desc">10</span>s.
      <br />Opponents launched by <b>Skyward Sonnet</b> suffer an additional <span class="text-desc">12%</span> <b class="text-genshin-anemo">Anemo RES</b> and <b>Physical RES</b> decrease while airborne.`,
      image: 'UI_Talent_S_Venti_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Ode to Thousand Winds`,
      content: `Increases the Level of <b>Wind's Grand Ode</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Venti_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Hurricane of Freedom`,
      content: `When Venti picks up an Elemental Orb or Particle, he receives a <span class="text-desc">25%</span> <b class="text-genshin-anemo">Anemo DMG</b> Bonus for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Venti_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Concerto dal Cielo`,
      content: `Increases the Level of <b>Skyward Sonnet</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Venti_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Storm of Defiance`,
      content: `Targets who take DMG from <b>Wind's Grand Ode</b> have their <b class="text-genshin-anemo">Anemo RES</b> decreased by <span class="text-desc">20%</span>.
      <br />If an Elemental Absorption occurred, then their <b>RES</b> towards the corresponding Element is also decreased by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Venti_04',
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
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.2038, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
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
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.2606, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 2,
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
            name: 'C1 Additional Physical Arrows',
            value: [{ scaling: calcScaling(0.4386, normal, 'physical', '1') * 0.33, multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.CA,
          },
          {
            name: 'C1 Additional Anemo Arrows',
            value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1_alt') * 0.33, multiplier: Stats.ATK }],
            element: Element.ANEMO,
            property: TalentProperty.CA,
          }
        )

      if (form.venti_c2) {
        base.ANEMO_RES_PEN.push({ value: 0.12 * form.venti_c2, name: 'Constellation 2', source: `Self` })
        base.PHYSICAL_RES_PEN.push({ value: 0.12 * form.venti_c2, name: 'Constellation 2', source: `Self` })
      }
      if (form.venti_c4) base[Stats.ANEMO_DMG].push({ value: 0.25, name: 'Constellation 4', source: `Self` })
      if (form.venti_c6) {
        base.ANEMO_RES_PEN.push({ value: 0.2, name: 'Constellation 6', source: `` })
        base[`${form.venti_absorb.toUpperCase()}_RES_PEN`].push({ value: 0.2, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.venti_c2) {
        base.ANEMO_RES_PEN.push({ value: 0.12 * form.venti_c2, name: 'Constellation 2', source: `Venti` })
        base.PHYSICAL_RES_PEN.push({ value: 0.12 * form.venti_c2, name: 'Constellation 2', source: `Venti` })
      }
      if (form.venti_c6) {
        base.ANEMO_RES_PEN.push({ value: 0.2, name: 'Constellation 6', source: `Venti` })
        base[`${form.venti_absorb.toUpperCase()}_RES_PEN`].push({
          value: 0.2,
          name: 'Constellation 6',
          source: `Venti`,
        })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Venti
