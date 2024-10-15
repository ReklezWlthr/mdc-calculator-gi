import { findContentById } from '@src/core/utils/finder'
import _, { multiply } from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject, StatsObjectKeys } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Sucrose = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      level: normal,
      trace: `Normal Attack`,
      title: `Wind Spirit Creation`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 attacks using Wind Spirits, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina and deals <b class="text-genshin-anemo">AoE Anemo DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Calling upon the power of her Wind Spirits, Sucrose plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-anemo">AoE Anemo DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Astable Anemohypostasis Creation - 6308`,
      content: `Creates a small Wind Spirit that pulls opponents and objects towards its location, launches opponents within its AoE, and deals <b class="text-genshin-anemo">Anemo DMG</b>.
      `,
      image: 'Skill_S_Sucrose_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Forbidden Creation - Isomer 75 / Type II`,
      content: `Sucrose hurls an unstable concoction that creates a Large Wind Spirit.
      <br />While it persists, the Large Wind Spirit will continuously pull in surrounding opponents and objects, launch nearby opponents, and deal <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the Wind Spirit comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b> energy, it will deal additional <b>Elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.`,
      image: 'Skill_E_Sucrose_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Catalyst Conversion`,
      content: `When Sucrose triggers a Swirl effect, all characters in the party with the matching element (excluding Sucrose) have their Elemental Mastery increased by <span class="text-desc">50</span> for <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Sucrose_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Mollis Favonius`,
      content: `When <b>Astable Anemohypostasis Creation - 6308</b> or <b>Forbidden Creation - Isomer 75 / Type II</b> hits an opponent, increases all party members' (excluding Sucrose) Elemental Mastery based on <span class="text-desc">20%</span> of Sucrose's Elemental Mastery for <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Sucrose_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Astable Invention`,
      content: `When Sucrose crafts Character and Weapon Enhancement Materials, she has a <span class="text-desc">10%</span> chance to obtain double the product.`,
      image: 'UI_Talent_Combine_Material',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Clustered Vacuum Field`,
      content: `<b>Astable Anemohypostasis Creation - 6308</b> gains <span class="text-desc">1</span> additional charge.`,
      image: 'UI_Talent_S_Sucrose_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Beth: Unbound Form`,
      content: `The duration of <b>Forbidden Creation - Isomer 75 / Type II</b> is increased by <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_Sucrose_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Flawless Alchemistress`,
      content: `Increases the Level of <b>Astable Anemohypostasis Creation - 6308</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sucrose_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Alchemania`,
      content: `Every <span class="text-desc">7</span> Normal and Charged Attacks, Sucrose will reduce the CD of <b>Astable Anemohypostasis Creation - 6308</b> by <span class="text-desc">1-7</span>s.`,
      image: 'UI_Talent_S_Sucrose_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Caution: Standard Flask`,
      content: `Increases the Level of <b>Forbidden Creation - Isomer 75 / Type II</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sucrose_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Chaotic Entropy`,
      content: `If <b>Forbidden Creation - Isomer 75 / Type II</b> triggers an Elemental Absorption, all party members gain a <span class="text-desc">20%</span> <b>Elemental DMG Bonus</b> for the corresponding absorbed element during its duration.`,
      image: 'UI_Talent_S_Sucrose_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'element',
      id: 'sucrose_absorb',
      text: `Burst Elemental Absorption`,
      ...talents.burst,
      show: true,
      default: Element.PYRO,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'element',
      id: 'sucrose_a1',
      text: `A1 Swirl EM`,
      ...talents.a1,
      show: a >= 1,
      default: Element.PYRO,
    },
    {
      type: 'toggle',
      id: 'sucrose_a4',
      text: `A4 Burst EM Share`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
  ]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3346, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3062, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.3845, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.4792, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.2016, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ANEMO)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.112, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `DoT`,
          value: [{ scaling: calcScaling(1.48, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Additional Elemental DMG',
          value: [{ scaling: calcScaling(0.44, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: form.sucrose_absorb,
          property: TalentProperty.BURST,
        },
      ]
      if (form.sucrose_absorb && c >= 6)
        base[Stats[`${form.sucrose_absorb.toUpperCase()}_DMG`]].push({
          value: 0.2,
          name: 'Constellation 6',
          source: `Self`,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.element === form.sucrose_a1)
        base[Stats.EM].push({ value: 50, name: 'Ascension 1 Passive', source: `Sucrose` })
      if (form.sucrose_absorb && c >= 6)
        base[Stats[`${form.sucrose_absorb.toUpperCase()}_DMG`]].push({
          value: 0.2,
          name: 'Constellation 6',
          source: `Sucrose`,
        })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>, allBase: StatsObject[]) => {
      if (form.sucrose_a4) {
        const index = _.findIndex(team, (item) => item.cId === '10000043')
        _.forEach(allBase, (item, i) => {
          if (i !== index)
            item.CALLBACK.push(function N99(x, a) {
              x[StatsObjectKeys.X_EM].push({
                value: allBase[index].getEM(true) * 0.2,
                name: 'Ascension 4 Passive',
                source: 'Sucrose',
                base: a[index].getEM(true),
                multiplier: toPercentage(0.2),
              })
              return x
            })
        })
      }
      return base
    },
  }
}

export default Sucrose
