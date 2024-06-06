import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Sigewinne = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: c >= 3,
    skill: false,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const maxBuff = c >= 1 ? 3000 : 2700
  const buffStack = c >= 1 ? 100 : 80

  const talents: ITalent = {
    normal: {
      title: `Targeted Treatment`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, the power of Hydro will continually accumulate on the arrow. After fully charging, Sigewinne will periodically fire slow-moving Mini-Stration Bubbles toward the target, dealing <b class="text-genshin-hydro">Hydro DMG</b>. When released, an arrow imbued with torrential energy will deal <b class="text-genshin-hydro">Hydro DMG</b> to the opponent hit.      
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
    },
    skill: {
      title: `Rebound Hydrotherapy`,
      content: `Blows a Bolstering Bubblebalm that can stimulate blood flow and help patients drift off to sleep using a bubblegun specially made in the Fortress of Meropide.
      <br />Bolstering Bubblebalms will bounce between nearby opponents, dealing <b class="text-genshin-hydro">Hydro DMG</b> based on Sigewinne's max HP to opponents it hits. When it bounces, it will restore HP to all nearby party members except Sigewinne herself. The amount healed is based on Sigewinne's max HP.
      <br />After bouncing <span class="text-desc">5</span> times, the Bolstering Bubblebalm will disappear and restore HP to Sigewinne based on her max HP value.
      <br />When no opponents are present, the Bolstering Bubblebalm will bounce nearby. Only one Bolstering Bubblebalm created by a Sigewinne may exist at once.
      <br />When Held, the Bolstering Bubblebalm can be boosted to an even bigger size.
      <br />
      <br /><b>Hold</b>
      <br />Enter Aiming Mode to begin blowing an even bigger, even more breathtaking Bolstering Bubblebalm!
      <br />The Bolstering Bubblebalm will grow bigger the longer the skill is Held, until it grows up to two tiers in size. Each tier it grows increases its DMG by <span class="text-desc">5%</span> and healing by <span class="text-desc">5%</span>. When a Bolstering Bubblebalm bounces, it will drop down a tier in size, until it returns to being a normal Bolstering Bubblebalm.
      <br />After weaker opponents are hit by big Bolstering Bubblebalms, they will be imprisoned and will be unable to move.
      <br />
      <br />In addition, <span class="text-desc">2</span> Sourcewater Droplets will be created near Sigewinne when she uses this Skill. Each Sourcewater Droplet Sigewinne collects will grant her a <b class="text-genshin-bol">Bond of Life</b> worth <span class="text-desc">10%</span> of her Max HP.
      <br />When Sigewinne's <b class="text-genshin-bol">Bond of Life</b> is cleared, she regains <span class="text-desc">1</span> Elemental Energy for every <span class="text-desc">2,000</span> HP worth of the <b class="text-genshin-bol">Bond of Life</b> that was cleared. Sigewinne can regain up to <span class="text-desc">5</span> Elemental Energy in this way.
      <br />
      <br /><b>Arkhe: </b><b class="text-genshin-ousia">Ousia</b>
      <br />Bolstering Bubblebalms periodically call down a Surging Blade on the position they hit, dealing <b class="text-genshin-ousia">Ousia</b>-aligned <b class="text-genshin-hydro">Hydro DMG</b> based on Sigewinne's max HP.`,
    },
    burst: {
      title: `Super Saturated Syringing`,
      content: `Takes out a special Fortress of Meropide-made syringe and assault the area in front with waves of kindness and medicine, dealing <b class="text-genshin-hydro">AoE Hydro DMG</b> based on Sigewinne's max HP.
      <br />In addition, Sigewinne absorbs up to <span class="text-desc">2</span> nearby Sourcewater Droplets within a certain range when she uses this skill.
      `,
    },
    a1: {
      title: `A1: Requires Appropriate Rest`,
      content: `Sigewinne grants herself the "Semi-Strict Bedrest" effect for <span class="text-desc">18</span>s after using Rebound Hydrotherapy: Sigewinne gains an <span class="text-desc">8%</span> <b class="text-genshin-hydro">Hydro DMG Bonus</b> and <span class="text-desc">10</span> stacks of Convalescence. When the Elemental Skills of your nearby off-field party members other than Sigewinne deal DMG, consume <span class="text-desc">1</span> stack of Convalescence, and increase the DMG dealt by this instance of Elemental Skill DMG. Every <span class="text-desc">1,000</span> Max HP Sigewinne has above <span class="text-desc">30,000</span> increases the DMG by <span class="text-desc">80</span>. The maximum DMG increase for Elemental Skills that can be gained in this way is <span class="text-desc">2,800</span>.`,
      value: [
        {
          name: 'Bonus Skill DMG',
          value: { stat: Stats.HP, scaling: (hp) => _.round(_.min([buffStack * (_.max([0, hp - 30000]) / 1000), maxBuff])).toLocaleString() },
        },
      ],
    },
    a4: {
      title: `A4: Detailed Diagnosis, Thorough Treatment`,
      content: `When Sigewinne performs healing, the amount healed for this instance is increased based on the total current value of the <b class="text-genshin-bol">Bond of Life</b> on all party members: For each <span class="text-desc">1,000</span> HP worth of Bonds of Life, the outgoing healing is increased by <span class="text-desc">3%</span>. The amount of healing provided can be increased by up to <span class="text-desc">30%</span> in this way.`,
    },
    util: {
      title: `Emergency Dose`,
      content: `While underwater, heal your active character over <span class="text-desc">2.5</span>s when their HP falls under <span class="text-desc">50%</span>. The amount healed is equal to 50% of their Max HP, and their All Elemental and Physical RES will be decreased by <span class="text-desc">10%</span> for <span class="text-desc">10</span>s. This effect can be triggered up to once every <span class="text-desc">20</span>s.`,
    },
    c1: {
      title: `C1: "Can the Happiest of Spirits Understand Anxiety?"`,
      content: `Rebound Hydrotherapy's Bolstering Bubblebalm can bounce <span class="text-desc">3</span> extra times, and the first <span class="text-desc">3</span> bounces will not cause big Bubblebalms to become smaller.
      <br />The Passive Talent "Requires Appropriate Rest" is enhanced: Each Bubblebalm bounce adds <span class="text-desc">1</span> stack to her Convalescence tally, and the values for the Convalescence stacks' DMG bonus will be modified to: Every <span class="text-desc">1,000</span> max HP Sigewinne has above <span class="text-desc">30,000</span> increases the DMG by <span class="text-desc">100</span>. The maximum DMG increase for Elemental Skills that can be gained in this way is <span class="text-desc">3,500</span>. You must first unlock the Passive Talent "Requires Appropriate Rest."
      `,
    },
    c2: {
      title: `C2: "Can the Most Merciful of Spirits Defeat Its Foes?"`,
      content: `When using Rebound Hydrotherapy and Super Saturated Syringing, Sigewinne can create a Bubbly Shield worth <span class="text-desc">30%</span> of her Max HP that absorbs <b class="text-genshin-hydro">Hydro DMG</b> with <span class="text-desc">250%</span> efficiency. The Bubbly Shield will persist until Sigewinne finishes using relevant skills.
      <br />Additionally, after Rebound Hydrotherapy's Bolstering Bubblebalm or Super Saturated Syringing hits an opponent, that opponent's <b class="text-genshin-hydro">Hydro RES</b> will be decreased by <span class="text-desc">35%</span> for <span class="text-desc">8</span>s.
      `,
    },
    c3: {
      title: `C3: "Can the Healthiest of Spirits Cure Fevers?"`,
      content: `Increases the Level of Rebound Hydrotherapy by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c4: {
      title: `C4: "Can the Loveliest of Spirits Keep Decay at Bay?"`,
      content: `The duration of Super Saturated Syringing is extended by <span class="text-desc">3</span>s.`,
    },
    c5: {
      title: `C5: "Can the Most Joyful of Spirits Alleviate Agony?"`,
      content: `Increases the Level of Super Saturated Syringing by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
    },
    c6: {
      title: `C6: "Can the Most Radiant of Spirits Pray For Me?"`,
      content: `When Sigewinne performs healing, she will increase the CRIT Rate and CRIT DMG of her Super Saturated Syringing based on her Max HP. Every <span class="text-desc">1,000</span> Max HP she has will increase CRIT Rate by <span class="text-desc">0.4%</span> and CRIT DMG by <span class="text-desc">202%</span> for <span class="text-desc">15</span>s. The maximum increase achievable this way is <span class="text-desc">20%</span> CRIT Rate and <span class="text-desc">110%</span> CRIT DMG.`,
      value: [
        { name: 'Bonus CRIT Rate', value: { stat: Stats.HP, scaling: (hp) => _.min([(hp / 1000) * 0.004, 0.2]) } },
        { name: 'Bonus CRIT DMG', value: { stat: Stats.HP, scaling: (hp) => _.min([(hp / 1000) * 0.022, 1.1]) } },
      ],
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'sig_bol',
      text: `Bond of Life (%)`,
      ...talents.skill,
      show: true,
      default: 0,
      min: 0,
      max: 200,
    },
    {
      type: 'number',
      id: 'bubble_tier',
      text: `Bolstering Bubblebalm Tier`,
      ...talents.skill,
      show: true,
      default: 2,
      min: 0,
      max: 2,
    },
    {
      type: 'toggle',
      id: 'sig_a1',
      text: `Semi-Strict Bedrest`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'toggle',
      id: 'sig_c2',
      text: `C2 Hydro RES Reduction`,
      ...talents.c2,
      show: c >= 2,
      default: true,
      debuff: true,
    },
    {
      type: 'toggle',
      id: 'sig_c6',
      text: `C6 CRIT Bonuses`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [
    {
      type: 'toggle',
      id: 'sig_a1_ally',
      text: `Convalescence`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    findContentById(content, 'sig_c2'),
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
          value: [{ scaling: calcScaling(0.526, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.511, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.783, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          value: [{ scaling: calcScaling(1.141, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Mini-Stration Bubble DMG',
          value: [{ scaling: calcScaling(0.228, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Bolstering Bubblebalm DMG',
          value: [{ scaling: calcScaling(0.0228, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
          bonus: form.bubble_tier ? form.bubble_tier * 0.05 : 0,
        },
        {
          name: 'Bolstering Bubblebalm Healing',
          value: [{ scaling: calcScaling(0.028, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(270, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
          bonus: form.bubble_tier ? form.bubble_tier * 0.05 : 0,
        },
        {
          name: 'Final Bounce Healing',
          value: [{ scaling: 0.5, multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Surging Blade DMG',
          value: [{ scaling: calcScaling(0.0068, skill, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(0.118, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.sig_a1) base[Stats.HYDRO_DMG] += 0.08
      if (c >= 2)
        base.SKILL_SCALING.push({
          name: 'Bubbly Shield Absorption',
          value: [{ scaling: 0.3, multiplier: Stats.HP }],
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })
      if (form.sig_c2) base.HYDRO_RES_PEN += 0.35

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.sig_a1_ally) base.SKILL_F_DMG += _.min([buffStack * (_.max([0, own.getHP() - 30000]) / 1000), maxBuff])
      if (form.sig_c2) base.HYDRO_RES_PEN += 0.35

      return base
    },
    postCompute: (
      base: StatsObject,
      form: Record<string, any>,
      allBase: StatsObject[],
      allForm: Record<string, any>[]
    ) => {
      const totalBol = _.sum(
        _.map(allForm, (item, i) => {
          const bolKey = _.find(_.keys(item), (key) => _.includes(key, 'bol'))
          if (bolKey) return (item[bolKey] / 100) * allBase[i].getHP()
        })
      )
      base[Stats.HEAL] += _.min([(totalBol / 1000) * 0.03, 0.3])
      if (form.sig_c6) {
        base.BURST_CR += _.min([(base.getHP() / 1000) * 0.004, 0.2])
        base.BURST_CD += _.min([(base.getHP() / 1000) * 0.022, 1.1])
      }
      return base
    },
  }
}

export default Sigewinne
