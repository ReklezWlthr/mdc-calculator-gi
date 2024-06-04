import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
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
    },
    skill: {
      title: `Astable Anemohypostasis Creation - 6308`,
      content: `Creates a small Wind Spirit that pulls opponents and objects towards its location, launches opponents within its AoE, and deals <b class="text-genshin-anemo">Anemo DMG</b>.
      `,
    },
    burst: {
      title: `Forbidden Creation - Isomer 75 / Type II`,
      content: `Sucrose hurls an unstable concoction that creates a Large Wind Spirit.
      <br />While it persists, the Large Wind Spirit will continuously pull in surrounding opponents and objects, launch nearby opponents, and deal <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Elemental Absorption</b>
      <br />If the Wind Spirit comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b> energy, it will deal additional <b>Elemental DMG</b> of that type.
      <br />Elemental Absorption may only occur once per use.`,
    },
    a1: {
      title: `A1: Catalyst Conversion`,
      content: `When Sucrose triggers a Swirl effect, all characters in the party with the matching element (excluding Sucrose) have their Elemental Mastery increased by <span class="text-desc">50</span> for <span class="text-desc">8</span>s.`,
    },
    a4: {
      title: `A4: Mollis Favonius`,
      content: `When Astable Anemohypostasis Creation - 6308 or Forbidden Creation - Isomer 75 / Type II hits an opponent, increases all party members' (excluding Sucrose) Elemental Mastery based on <span class="text-desc">20%</span> of Sucrose's Elemental Mastery for <span class="text-desc">8</span>s.`,
    },
    util: {
      title: `Astable Invention`,
      content: `When Sucrose crafts Character and Weapon Enhancement Materials, she has a <span class="text-desc">10%</span> chance to obtain double the product.`,
    },
    c1: {
      title: `C1: Clustered Vacuum Field`,
      content: `Astable Anemohypostasis Creation - 6308 gains <span class="text-desc">1</span> additional charge.`,
    },
    c2: {
      title: `C2: Beth: Unbound Form`,
      content: `The duration of Forbidden Creation - Isomer 75 / Type II is increased by <span class="text-desc">2</span>s.`,
    },
    c3: {
      title: `C3: Flawless Alchemistress`,
      content: `Increases the Level of Astable Anemohypostasis Creation - 6308 by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Alchemania`,
      content: `Every <span class="text-desc">7</span> Normal and Charged Attacks, Sucrose will reduce the CD of Astable Anemohypostasis Creation - 6308 by <span class="text-desc">1-7</span>s.`,
    },
    c5: {
      title: `C5: Caution: Standard Flask`,
      content: `Increases the Level of Forbidden Creation - Isomer 75 / Type II by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Chaotic Entropy`,
      content: `If Forbidden Creation - Isomer 75 / Type II triggers an Elemental Absorption, all party members gain a <span class="text-desc">20%</span> Elemental DMG Bonus for the corresponding absorbed element during its duration.`,
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
      if (form.sucrose_absorb && c>=6) base[Stats[`${form.sucrose_absorb.toUpperCase()}_DMG`]] += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.element === form.sucrose_a1) base[Stats.EM] += 50
      if (form.sucrose_a4) base[Stats.EM] += own[Stats.EM] * 0.2
      console.log(form.sucrose_a4, own[Stats.EM])

      if (form.sucrose_absorb && c>=6) base[Stats[`${form.sucrose_absorb.toUpperCase()}_DMG`]] += 0.2

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Sucrose
