import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Zhongli = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
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
      title: `Rain of Stone`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 6 consecutive spear strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to lunge forward, dealing damage to opponents along the way.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_03',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Dominus Lapidis`,
      content: `Every mountain, rock and inch of land is filled with the power of Geo, but those who can wield such powers freely are few and far between.
      <br />
      <br /><b>Press</b>
      <br />Commands the power of earth to create a <b class="text-genshin-geo">Stone Stele</b>.
      <br />
      <br /><b>Hold</b>
      <br />Causes nearby Geo energy to explode, causing the following effects:
      <br />- If their maximum number hasn't been reached, creates a <b class="text-genshin-geo">Stone Stele</b>.
      <br />- Creates a shield of jade. The shield's DMG Absorption scales based on Zhongli's Max HP.
      <br />- Deals <b class="text-genshin-geo">AoE Geo DMG</b>.
      <br />- If there are nearby targets with the <b class="text-genshin-geo">Geo element</b>, it will drain a large amount of <b class="text-genshin-geo">Geo element</b> from a maximum of <span class="text-desc">2</span> such targets. This effect does not cause DMG.
      <br />
      <br /><b class="text-genshin-geo">Stone Stele</b>
      <br />When created, deals <b class="text-genshin-geo">AoE Geo DMG</b>.
      <br />Additionally, it will intermittently resonate with other nearby <b class="text-genshin-geo">Geo construct</b>, dealing <b class="text-genshin-geo">Geo DMG</b> to surrounding opponents.
      <br />The <b class="text-genshin-geo">Stone Stele</b> is considered a <b class="text-genshin-geo">Geo construct</b> that can both be climbed and used to block attacks.
      <br />Only one <b class="text-genshin-geo">Stele</b> created by Zhongli himself may initially exist at any one time.
      <br />
      <br /><b>Jade Shield</b>
      <br />Possesses <span class="text-desc">150%</span> DMG Absorption against all Elemental and Physical DMG.
      <br />Characters protected by the <b>Jade Shield</b> will decrease the <b>Elemental RES</b> and <b>Physical RES</b> of opponents in a small AoE by <span class="text-desc">20%</span>. This effect cannot be stacked.`,
      image: 'Skill_S_Zhongli_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Planet Befall`,
      content: `Brings a falling meteor down to earth, dealing massive <b class="text-genshin-geo">Geo DMG</b> to opponents caught in its AoE and applying the <b class="text-genshin-geo">Petrification</b> status to them.
      <br />
      <br /><b class="text-genshin-geo">Petrification</b>
      <br />Opponents affected by the <b class="text-genshin-geo">Petrification</b> status cannot move.`,
      image: 'Skill_E_Zhongli_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Resonant Waves`,
      content: `When the <b>Jade Shield</b> takes DMG, it will <b>Fortify</b>:
      <br />- <b>Fortified</b> characters have <span class="text-desc">5%</span> increased Shield Strength.
      <br />Can stack up to <span class="text-desc">5</span> times, and lasts until the <b>Jade Shield</b> disappears.`,
      image: 'UI_Talent_S_Zhongli_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Dominance of Earth`,
      content: `Zhongli deals bonus DMG based on his Max HP:
      <br />Normal Attack, Charged Attack, and Plunging Attack DMG is increased by <span class="text-desc">1.39%</span> of Max HP.
      <br /><b>Dominus Lapidis</b>' <b class="text-genshin-geo">Stone Stele</b>, resonance, and hold DMG is increased by <span class="text-desc">1.9%</span> of Max HP.
      <br /><b>Planet Befall</b>'s DMG is increased by <span class="text-desc">33%</span> of Max HP.`,
      image: 'UI_Talent_S_Zhongli_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Arcanum of Crystal`,
      content: `Refunds <span class="text-desc">15%</span> of the ore used when crafting Polearm-type weapons.`,
      image: 'UI_Talent_Forge_Pole',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Rock, the Backbone of Earth`,
      content: `Increases the maximum number of <b class="text-genshin-geo">Stone Steles</b> created by <b>Dominus Lapidis</b> that may exist simultaneously to <span class="text-desc">2</span>.`,
      image: 'UI_Talent_S_Zhongli_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Stone, the Cradle of Jade`,
      content: `<b>Planet Befall</b> grants nearby characters on the field a <b>Jade Shield</b> when it descends.`,
      image: 'UI_Talent_S_Zhongli_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Jade, Shimmering through Darkness`,
      content: `Increases the Level of <b>Dominus Lapidis</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Zhongli_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Topaz, Unbreakable and Fearless`,
      content: `Increases <b>Planet Befall</b>'s AoE by <span class="text-desc">20%</span> and increases the duration of <b>Planet Befall</b>'s <b class="text-genshin-geo">Petrification</b> effect by <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_Zhongli_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Lazuli, Herald of the Order`,
      content: `Increases the Level of <b>Planet Befall</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Zhongli_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Chrysos, Bounty of Dominator`,
      content: `When the <b>Jade Shield</b> takes DMG, <span class="text-desc">40%</span> of that incoming DMG is converted to HP for the current character.
      <br />A single instance of regeneration cannot exceed <span class="text-desc">8%</span> of that character's Max HP.`,
      image: 'UI_Talent_S_Zhongli_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'zhongli_res',
      text: `Jade Shield RES Shred`,
      ...talents.skill,
      show: true,
      default: true,
      debuff: true,
    },
    {
      type: 'number',
      id: 'zhongli_a1',
      text: `Fortify Stacks`,
      ...talents.c4,
      show: c >= 4,
      default: 5,
      min: 0,
      max: 5,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'zhongli_res'), findContentById(content, 'zhongli_a1')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      const a4Scaling_a = a >= 4 ? [{ scaling: 0.0139, multiplier: Stats.HP }] : []
      const a4Scaling_b = a >= 4 ? [{ scaling: 0.019, multiplier: Stats.HP }] : []
      const a4Scaling_c = a >= 4 ? [{ scaling: 0.33, multiplier: Stats.HP }] : []

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.3077, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.3115, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.3858, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.4294, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.1075, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
          hit: 4,
        },
        {
          name: '6-Hit',
          value: [{ scaling: calcScaling(0.545, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.1103, normal, 'physical', '1_alt'), multiplier: Stats.ATK }, ...a4Scaling_a],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal, Element.PHYSICAL, a4Scaling_a)
      base.SKILL_SCALING = [
        {
          name: 'Stone Stele Summon DMG',
          value: [{ scaling: calcScaling(0.16, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Scaling_b],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Resonance DMG DMG',
          value: [{ scaling: calcScaling(0.32, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Scaling_b],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Hold DMG',
          value: [{ scaling: calcScaling(0.8, skill, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Scaling_b],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(0.128, skill, 'elemental', '1'), multiplier: Stats.HP }],
          flat: calcScaling(1232, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(4.0108, burst, 'elemental', '1'), multiplier: Stats.ATK }, ...a4Scaling_c],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.zhongli_res) base.ALL_TYPE_RES_PEN.push({ value: 0.2, name: 'Jade Shield', source: `Self` })
      if (form.zhongli_a1)
        base[Stats.SHIELD].push({ value: form.zhongli_a1 * 0.05, name: 'Ascension 1 Passive', source: 'Self' })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.zhongli_res) base.ALL_TYPE_RES_PEN.push({ value: 0.2, name: 'Jade Shield', source: `Zhongli` })
      if (form.zhongli_a1)
        base[Stats.SHIELD].push({ value: form.zhongli_a1 * 0.05, name: 'Ascension 1 Passive', source: 'Zhongli' })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Zhongli
