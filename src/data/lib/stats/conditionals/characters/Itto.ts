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
      level: normal,
      trace: `Normal Attack`,
      title: `Fight Club Legend`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive strikes.
      <br />When the 2nd and 4th strikes hit opponents, Itto will gain <span class="text-desc">1</span> and <span class="text-desc">2</span> stacks of <b class="text-desc">Superlative Superstrength</b>, respectively.
      <br />Max <span class="text-desc">5</span> stacks. Triggering this effect will refresh the current duration of any existing stacks.
      <br />
      <br />Additionally, Itto's Normal Attack combo does not immediately reset after sprinting or using his Elemental Skill, <b>Masatsu Zetsugi: Akaushi Burst!</b>
      <br />
      <br /><b>Charged Attack</b>
      <br />When holding to perform a Charged Attack, Itto unleashes a series of <b class="text-genshin-geo">Arataki Kesagiri</b> slashes without consuming Stamina. Instead, each <b class="text-genshin-geo">Arataki Kesagiri</b> slash consumes <span class="text-desc">1</span> stack of <b class="text-text-desc">Superlative Superstrength</b>. When the final stack is consumed, Itto delivers a powerful final slash.
      <br />If no stacks of <b class="text-text-desc">Superlative Superstrength</b> are available, Itto will perform a single <b class="text-genshin-geo">Saichimonji Slash</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_04',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Masatsu Zetsugi: Akaushi Burst!`,
      content: `Hurls Ushi, the young akaushi bull and auxiliary member of the Arataki Gang, dealing <b class="text-genshin-geo">Geo DMG</b> to opponents on hit.
      <br />When Ushi hits opponents, Arataki Itto gains <span class="text-desc">1</span> stack of <b class="text-desc">Superlative Superstrength</b>.
      <br />
      <br />Ushi will remain on the field and provide support in the following ways:
      <br />- Taunts surrounding opponents and draws their attacks.
      <br />- Inherits HP based on a percentage of Arataki Itto's Max HP.
      <br />- When Ushi takes DMG, Arataki Itto gains <span class="text-desc">1</span> stack of <b class="text-desc">Superlative Superstrength</b>. Only <span class="text-desc">1</span> stack can be gained in this way every <span class="text-desc">2</span>s.
      <br />- Ushi will flee when its HP reaches <span class="text-desc">0</span> or its duration ends. It will grant Arataki Itto <span class="text-desc">1</span> stack of <b class="text-desc">Superlative Superstrength</b> when it leaves.
      <br />
      <br /><b>Hold</b>
      <br />Adjust throwing angle.
      <br />
      <br />Ushi is considered a <b class="text-genshin-geo">Geo construct</b>. Arataki Itto can only deploy <span class="text-desc">1</span> Ushi on the field at any one time.
      `,
      image: 'Skill_S_Itto_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Royal Descent: Behold, Itto the Evil!`,
      content: `Time to show 'em the might of the Arataki Gang! For a time, Itto lets out his inner <b class="text-genshin-geo">Raging Oni King</b>, wielding his Oni King's Kanabou in battle.
      <br />This state has the following special properties:
      <br />- Converts Itto's Normal, Charged, and Plunging Attacks to <b class="text-genshin-geo">Geo DMG</b>. This cannot be overridden.
      <br />- Increases Itto's Normal Attack SPD. Also increases his ATK based on his DEF.
      <br />- On hit, the <span class="text-desc">1st</span> and <span class="text-desc">3rd</span> strikes of his attack combo will each grant Arataki Itto <span class="text-desc">1</span> stack of <b class="text-desc">Superlative Superstrength</b>.
      <br />- Decreases Itto's <b>Elemental and Physical RES</b> by <span class="text-desc">20%</span>.
      <br />
      <br />The <b class="text-genshin-geo">Raging Oni King</b> state will be cleared when Itto leaves the field.
      `,
      image: 'Skill_E_Itto_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Arataki Ichiban`,
      content: `When Arataki Itto uses consecutive <b class="text-genshin-geo">Arataki Kesagiri</b>, he obtains the following effects:
      <br />- Each slash increases the ATK SPD of the next slash by <span class="text-desc">10%</span>. Max ATK SPD increase is <span class="text-desc">30%</span>.
      <br />- Increases his resistance to interruption.
      <br />
      <br />These effects will be cleared once he stops performing consecutive slashes.`,
      image: 'UI_Talent_S_Itto_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Bloodline of the Crimson Oni`,
      content: `<b class="text-genshin-geo">Arataki Kesagiri</b> DMG is increased by <span class="text-desc">35%</span> of Arataki Itto's DEF.`,
      image: 'UI_Talent_S_Itto_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Woodchuck Chucked`,
      content: `When a party member uses attacks to obtain wood from a tree, they have a <span class="text-desc">25%</span> chance to get an additional log of wood.`,
      image: 'UI_Talent_S_Itto_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Stay a While and Listen Up`,
      content: `After using <b>Royal Descent: Behold, Itto the Evil!</b>, Arataki Itto gains <span class="text-desc">2</span> stacks of <b class="text-desc">Superlative Superstrength</b>. After <span class="text-desc">1</span>s, Itto will gain <span class="text-desc">1</span> stack of <b class="text-desc">Superlative Superstrength</b> every <span class="text-desc">0.5</span>s for <span class="text-desc">1.5</span>s.`,
      image: 'UI_Talent_S_Itto_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Gather 'Round, It's a Brawl!`,
      content: `After using <b>Royal Descent: Behold, Itto the Evil!</b>, each party member whose Element is <b class="text-genshin-geo">Geo</b> will decrease that skill's CD by <span class="text-desc">1.5</span>s and restore <span class="text-desc">6</span> Energy to Arataki Itto.
      <br />CD can be decreased by up to <span class="text-desc">4.5</span>s in this manner. Max <span class="text-desc">18</span> Energy can be restored in this manner.`,
      image: 'UI_Talent_S_Itto_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Horns Lowered, Coming Through`,
      content: `Increases the Level of <b>Masatsu Zetsugi: Akaushi Burst!</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Itto_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Jailhouse Bread and Butter`,
      content: `When the <b class="text-genshin-geo">Raging Oni King</b> state caused by <b>Royal Descent: Behold, Itto the Evil!</b> ends, all nearby party members gain <span class="text-desc">20%</span> DEF and <span class="text-desc">20%</span> ATK for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Itto_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `10 Years of Hanamizaka Fame`,
      content: `Increases the Level of <b>Royal Descent: Behold, Itto the Evil!</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Itto_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Arataki Itto, Present!`,
      content: `Arataki Itto's Charged Attacks deal <span class="text-desc">+70%</span> Crit DMG. Additionally, when he uses <b class="text-genshin-geo">Arataki Kesagiri</b>, he has a <span class="text-desc">50%</span> chance to not consume stacks of <b class="text-desc">Superlative Superstrength</b>.`,
      image: 'UI_Talent_S_Itto_04',
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
    allyContent: [],
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

      if (form.itto_burst) base.ALL_TYPE_RES.push({ value: 0.2, name: '', source: `` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.itto_c4) {
        base[Stats.P_DEF].push({ value: 0.2, name: 'Constellation 4', source: `Arataki Itto` })
        base[Stats.P_ATK].push({ value: 0.2, name: 'Constellation 4', source: `Arataki Itto` })
      }
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (form.itto_burst)
        base[Stats.ATK].push({
          value: calcScaling(0.576, burst, 'elemental', '1') * base.getDef(),
          name: 'Raging Oni King',
          source: 'Self',
          base: base.getDef(),
          multiplier: calcScaling(0.576, burst, 'elemental', '1'),
        })

      return base
    },
  }
}

export default Itto
