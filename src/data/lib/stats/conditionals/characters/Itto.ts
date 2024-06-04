import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Itto = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const a4DmgScaling = a >= 4 ? [{ scaling: 0.35, multiplier: Stats.DEF }] : []

  const talents: ITalent = {
    normal: {
      title: `Fight Club Legend`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />When the 2nd and 4th strikes hit opponents, Itto will gain <span class="text-desc">1</span> and <span class="text-desc">2</span> stacks of Superlative Superstrength, respectively.
      <br />Max <span class="text-desc">5</span> stacks. Triggering this effect will refresh the current duration of any existing stacks.
      <br />
      <br />Additionally, Itto's Normal Attack combo does not immediately reset after sprinting or using his Elemental Skill, "Masatsu Zetsugi: Akaushi Burst!"
      <br />
      <br /><b>Charged Attack</b>
      <br />When holding to perform a Charged Attack, Itto unleashes a series of Arataki Kesagiri slashes without consuming Stamina. Instead, each Arataki Kesagiri slash consumes 1 stack of Superlative Superstrength. When the final stack is consumed, Itto delivers a powerful final slash.
      <br />If no stacks of Superlative Superstrength are available, Itto will perform a single Saichimonji Slash.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Masatsu Zetsugi: Akaushi Burst!`,
      content: `Hurls Ushi, the young akaushi bull and auxiliary member of the Arataki Gang, dealing <b class="text-genshin-geo">Geo DMG</b> to opponents on hit.
      <br />When Ushi hits opponents, Arataki Itto gains <span class="text-desc">1</span> stack of Superlative Superstrength.
      <br />
      <br />Ushi will remain on the field and provide support in the following ways:
      <br />- Taunts surrounding opponents and draws their attacks.
      <br />- Inherits HP based on a percentage of Arataki Itto's Max HP.
      <br />- When Ushi takes DMG, Arataki Itto gains <span class="text-desc">1</span> stack of Superlative Superstrength. Only <span class="text-desc">1</span> stack can be gained in this way every 2s.
      <br />- Ushi will flee when its HP reaches 0 or its duration ends. It will grant Arataki Itto <span class="text-desc">1</span> stack of Superlative Superstrength when it leaves.
      <br />
      <br /><b>Hold</b>
      <br />Adjust throwing angle.
      <br />
      <br />Ushi is considered a <b class="text-genshin-geo">Geo construct</b>. Arataki Itto can only deploy <span class="text-desc">1</span> Ushi on the field at any one time.
      `,
    },
    burst: {
      title: `Royal Descent: Behold, Itto the Evil!`,
      content: `Time to show 'em the might of the Arataki Gang! For a time, Itto lets out his inner Raging Oni King, wielding his Oni King's Kanabou in battle.
      <br />This state has the following special properties:
      <br />- Converts Itto's Normal, Charged, and Plunging Attacks to <b class="text-genshin-geo">Geo DMG</b>. This cannot be overridden.
      <br />- Increases Itto's Normal Attack SPD. Also increases his ATK based on his DEF.
      <br />- On hit, the <span class="text-desc">1st</span> and <span class="text-desc">3rd</span> strikes of his attack combo will each grant Arataki Itto <span class="text-desc">1</span> stack of Superlative Superstrength.
      <br />- Decreases Itto's <b>Elemental and Physical RES</b> by <span class="text-desc">20%</span>.
      <br />
      <br />The Raging Oni King state will be cleared when Itto leaves the field.
      `,
    },
    a1: {
      title: `A1: Arataki Ichiban`,
      content: `When Arataki Itto uses consecutive Arataki Kesagiri, he obtains the following effects:
      <br />Each slash increases the ATK SPD of the next slash by <span class="text-desc">10%</span>. Max ATK SPD increase is <span class="text-desc">30%</span>.
      <br />Increases his resistance to interruption.
      <br />
      <br />These effects will be cleared once he stops performing consecutive slashes.`,
    },
    a4: {
      title: `A4: Bloodline of the Crimson Oni`,
      content: `Arataki Kesagiri DMG is increased by <span class="text-desc">35%</span> of Arataki Itto's DEF.`,
      value: [
        {
          name: 'Current ATK Bonus',
          value: { stat: Stats.DEF, scaling: (def) => _.round(def * 0.35).toLocaleString() },
        },
      ],
    },
    util: {
      title: `Woodchuck Chucked`,
      content: `When a party member uses attacks to obtain wood from a tree, they have a <span class="text-desc">25%</span> chance to get an additional log of wood.`,
    },
    c1: {
      title: `C1: Stay a While and Listen Up`,
      content: `After using Royal Descent: Behold, Itto the Evil!, Arataki Itto gains <span class="text-desc">2</span> stacks of Superlative Superstrength. After 1s, Itto will gain <span class="text-desc">1</span> stack of Superlative Superstrength every <span class="text-desc">0.5</span>s for <span class="text-desc">1.5</span>s.`,
    },
    c2: {
      title: `C2: Gather 'Round, It's a Brawl!`,
      content: `After using Royal Descent: Behold, Itto the Evil!, each party member whose Element is <b class="text-genshin-geo">Geo</b> will decrease that skill's CD by <span class="text-desc">1.5</span>s and restore <span class="text-desc">6</span> Energy to Arataki Itto.
      <br />CD can be decreased by up to <span class="text-desc">4.5</span>s in this manner. Max <span class="text-desc">18</span> Energy can be restored in this manner.`,
    },
    c3: {
      title: `C3: Horns Lowered, Coming Through`,
      content: `Increases the Level of Masatsu Zetsugi: Akaushi Burst! by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: Jailhouse Bread and Butter`,
      content: `When the Raging Oni King state caused by Royal Descent: Behold, Itto the Evil! ends, all nearby party members gain <span class="text-desc">20%</span> DEF and <span class="text-desc">20%</span> ATK for <span class="text-desc">10</span>s.`,
    },
    c5: {
      title: `C5: 10 Years of Hanamizaka Fame`,
      content: `Increases the Level of Royal Descent: Behold, Itto the Evil! by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: Arataki Itto, Present!`,
      content: `Arataki Itto's Charged Attacks deal <span class="text-desc">+70%</span> Crit DMG. Additionally, when he uses Arataki Kesagiri, he has a <span class="text-desc">50%</span> chance to not consume stacks of Superlative Superstrength.`,
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'itto_burst',
      text: `Raging Oni King`,
      ...talents.burst,
      show: true,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'itto_c4',
      text: `Raging Oni King Ends`,
      ...talents.c4,
      show: c >= 4,
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
      if (form.itto_burst) base.infuse(Element.GEO, true)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.7923, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.7637, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.9164, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(1.1722, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Arataki Kesagiri Combo Slash DMG',
          value: [{ scaling: calcScaling(0.9116, normal, 'physical', '1'), multiplier: Stats.ATK }, ...a4DmgScaling],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
          cd: c >= 6 ? 0.7 : 0,
        },
        {
          name: 'Arataki Kesagiri Final Slash DMG',
          value: [{ scaling: calcScaling(1.9092, normal, 'physical', '1'), multiplier: Stats.ATK }, ...a4DmgScaling],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
          cd: c >= 6 ? 0.7 : 0,
        },
        {
          name: 'Saichimonji Slash DMG',
          value: [{ scaling: calcScaling(0.9047, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
          cd: c >= 6 ? 0.7 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('high', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(3.072, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]

      if (form.itto_burst) base.ALL_TYPE_RES += 0.2

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.itto_c4) {
        base[Stats.DEF] += 0.2
        base[Stats.P_ATK] += 0.2
      }
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.itto_burst) base[Stats.ATK] += calcScaling(0.576, burst, 'elemental', '1') * base.getDef()

      return base
    },
  }
}

export default Itto
