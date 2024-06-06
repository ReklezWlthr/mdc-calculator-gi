import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Diona = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Kätzlein Style`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, biting frost will accumulate on the arrowhead. A fully charged frost arrow will deal <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Icy Paws`,
      content: `Fires an Icy Paw that deals <b class="text-genshin-cryo">Cryo DMG</b> to opponents and forms a shield on hit.
      <br />The shield's DMG Absorption scales based on Diona's Max HP, and its duration scales off the number of Icy Paws that hit their target.
      <br />
      <br /><b>Press</b>
      <br />Rapidly fires off 2 Icy Paws.
      <br />
      <br /><b>Hold</b>
      <br />Dashes back quickly before firing 5 Icy Paws.
      <br />The shield created by a Hold attack will gain a 75% DMG Absorption Bonus.
      <br />
      <br />The shield has a 250% <b class="text-genshin-cryo">Cryo DMG</b> Absorption Bonus, and will cause your active character to become affected by <b class="text-genshin-cryo">Cryo</b> at the point of formation for a short duration.`,
    },
    burst: {
      title: `Signature Mix`,
      content: `Tosses out a special cold brew that deals <b class="text-genshin-cryo">AoE Cryo DMG</b> and creates a Drunken Mist in an AoE.
      <br />
      <br /><b>Drunken Mist</b>
      <br />Deals continuous <b class="text-genshin-cryo">Cryo DMG</b> to opponents within the AoE.
      <br />Continuously regenerates the HP of characters within the AoE.
      `,
    },
    a1: {
      title: `A1: Cat's Tail Secret Menu`,
      content: `Characters shielded by Icy Paws have their Movement SPD increased by <span class="text-desc">10%</span> and their Stamina Consumption decreased by <span class="text-desc">10%</span>.`,
    },
    a4: {
      title: `A4: Drunkards' Farce`,
      content: `Opponents who enter the AoE of Signature Mix have <span class="text-desc">10%</span> decreased ATK for <span class="text-desc">15</span>s.`,
    },
    util: {
      title: `Complimentary Bar Food`,
      content: `When a Perfect Cooking is achieved on a dish with restorative effects, Diona has a <span class="text-desc">12%</span> chance to obtain double the product.`,
    },
    c1: {
      title: `C1: A Lingering Flavor`,
      content: `Regenerates <span class="text-desc">15</span> Energy for Diona after the effects of Signature Mix end.`,
    },
    c2: {
      title: `C2: Shaken, Not Purred`,
      content: `Increases Icy Paws' DMG by <span class="text-desc">15%</span>, and increases its shield's DMG Absorption by <span class="text-desc">15%</span>.
      <br />Additionally, when paws hit their targets, creates a shield for other nearby characters on the field with <span class="text-desc">50%</span> of the Icy Paws shield's DMG Absorption for <span class="text-desc">5</span>s.`,
    },
    c3: {
      title: `C3: A—Another Round?`,
      content: `Increases the Level of Signature Mix by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Wine Industry Slayer`,
      content: `Within the radius of Signature Mix, Diona's charge time for aimed shots is reduced by <span class="text-desc">60%</span>.`,
    },
    c5: {
      title: `C5: Double Shot, on the Rocks`,
      content: `Increases the Level of Icy Paws by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Cat's Tail Closing Time`,
      content: `Characters within Signature Mix's radius will gain the following effects based on their HP amounts:
      <br />Increases Incoming Healing Bonus by <span class="text-desc">30%</span> when HP falls below or is equal to <span class="text-desc">50%</span>.
      <br />Elemental Mastery increased by <span class="text-desc">200</span> when HP is above <span class="text-desc">50%</span>.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'diona_a4',
      text: `Burst ATK Reduction`,
      ...talents.a4,
      show: a >= 4,
      default: false,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'diona_c6',
      text: `Current HP > 50%`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'diona_c6')]

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
          value: [{ scaling: calcScaling(0.3612, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3255, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.4558, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.43, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.5375, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
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
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'DMG Per Icy Paw',
          value: [{ scaling: calcScaling(0.4192, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
          bonus: c >= 2 ? 0.15 : 0,
        },
        {
          name: 'Base Shield',
          value: [{ scaling: calcScaling(0.072, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(692.8, normal, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
          multiplier: c >= 2 ? 1.15 : 0,
        },
        {
          name: 'Hold Shield',
          value: [{ scaling: calcScaling(0.072, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(692.8, normal, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
          multiplier: 1.75 * (c >= 2 ? 1.15 : 0),
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(0.8, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: `Continuous Field DMG`,
          value: [{ scaling: calcScaling(0.5264, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: `Healing Over Time`,
          value: [{ scaling: calcScaling(0.0534, burst, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(513.19, burst, 'elemental', '1'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (form.diona_a4) base.ATK_REDUCTION += 0.1

      if (form.diona_c6) {
        base[Stats.EM] += 200
      } else {
        base[Stats.I_HEALING] += 0.3
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.diona_c6) {
        base[Stats.EM] += 200
      } else {
        base[Stats.I_HEALING] += 0.3
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Diona
