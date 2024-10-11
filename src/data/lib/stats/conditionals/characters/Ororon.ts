import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ororon = (c: number, a: number, t: ITalentLevel, team: ITeamChar[]) => {
  const upgrade = {
    normal: false,
    skill: c >= 5,
    burst: c >= 3,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const teamElements = _.filter(
    _.map(team, (item) => findCharacter(item.cId)?.element),
    (item) => _.includes([Element.PYRO, Element.HYDRO, Element.ELECTRO, Element.CRYO], item)
  )
  const uniqueElements = _.uniq(teamElements)

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `-`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, crackling lightning will accumulate on the arrowhead. An arrow fully charged with the storm's might will deal <b class="text-genshin-electro">Electro DMG</b>.
      <br /><b>Special</b>: Capable of scanning runes and graffiti in Natlan, creating different effects based on what was scanned.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `-`,
      content: `Tosses a <b>Graffiti Bomb</b> that will ricochet between nearby opponents, attacking them. Deals <b class="text-genshin-electro">Electro DMG</b>.
      <br />Stops attacking after attacking <span class="text-desc">3</span> times, or when there are no more opponents nearby to attack. Can bounce off each opponent a maximum of once.`,
      image: 'Skill_S_Olorun_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `-`,
      content: `Ororon summons a <b class="text-genshin-electro">Psionic Eye</b> that deals <b class="text-genshin-electro">AoE Electro DMG</b>.
      <br />
      <br /><b class="text-genshin-electro">Psionic Eye</b>
      <br />- Can continually taunt nearby opponents, drawing their attacks.
      <br />- Can fire soundwaves and continually spins, dealing <b class="text-genshin-electro">Electro DMG</b> to opponents it touches.`,
      image: 'Skill_E_Olorun_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `-`,
      content: `When party members triggers a <b>Nightsoul Burst</b>, Ororon will recover <span class="text-desc">40</span> <b class="text-genshin-electro">Nightsoul</b> points.
      <br />For <span class="text-desc">15</span>s after using a Skill, Ororon will recover <span class="text-desc">5</span> <b class="text-genshin-electro">Nightsoul</b> points after characters other than himself hit opponents with <b class="text-genshin-hydro">Hydro</b> or <b class="text-genshin-electro">Electro DMG</b>. This can only be triggered up to <span class="text-desc">10</span> times during its duration, and he can recover <b class="text-genshin-electro">Nightsoul</b> points this way once every <span class="text-desc">0.3</span>s.
      <br /><b class="text-genshin-electro">Nightsoul</b> points can be consumed in the following ways:
      <br />After nearby opponents are attacked by Electro-Charged or by Nightsoul-aligned attacks (from characters other than Ororon), if he has <span class="text-desc">10</span> or more <b class="text-genshin-electro">Nightsoul</b> points, Ororon will enter the <b class="text-genshin-electro">Nightsoul's Blessing</b> state for <span class="text-desc">6</span>s and trigger the <b class="text-genshin-electro">Electric Induction</b> effect: Deal <b class="text-genshin-electro">Electro DMG</b> equal to <span class="text-desc">130%</span> of his ATK to up to <span class="text-desc">4</span> nearby opponents and consume <span class="text-desc">10</span> <b class="text-genshin-electro">Nightsoul</b> points. This effect can be triggered once every <span class="text-desc">1.8</span>s.`,
      image: 'UI_Talent_S_Olorun_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `-`,
      content: `For <span class="text-desc">15</span>s after his Elemental Skill hits, the active party member restores <span class="text-desc">3</span> Elemental Energy after attacking with <b class="text-genshin-hydro">Hydro</b> or <b class="text-genshin-electro">Electro DMG</b>. If Ororon is off-field at the time, Ororon will restore <span class="text-desc">3</span> Elemental Energy as well. This can be triggered once every <span class="text-desc">1</span>s, and can be triggered up to <span class="text-desc">3</span> times during its duration.`,
      image: 'UI_Talent_S_Olorun_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `-`,
      content: `-`,
      image: 'UI_Talent_Explosion_Glide',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `-`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, he can use <b>Nightsoul Transmission: Ororon</b>. When the active character is currently sprinting, in a movement mode caused by certain Talents, or at a certain height in the air, the following will trigger when switching to Ororon: Ororon will leap up high. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Olorun_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `-`,
      content: `<b>Graffiti Bomb</b> can attack <span class="text-desc">2</span> more times, and opponents hit take <span class="text-desc">60%</span> more DMG from <b>Electric Induction</b> for <span class="text-desc">12</span>s.
      <br />Requires Ascension Talent <b>1</b> to be unlocked first.`,
      image: 'UI_Talent_S_Olorun_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `-`,
      content: `When Ororon's Elemental Burst hits <span class="text-desc">1</span>/<span class="text-desc">2</span>/<span class="text-desc">3</span>/<span class="text-desc">4</span> or more opponents, his own Electro DMG dealt increases by <span class="text-desc">24%</span>/<span class="text-desc">36%</span>/<span class="text-desc">48%</span>/<span class="text-desc">60%</span> for <span class="text-desc">9</span>s.`,
      image: 'UI_Talent_S_Olorun_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `-`,
      content: `Increases the Level of <b>Elemental Burst</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Olorun_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `-`,
      content: `The rotation speed of the soundwaves during the Elemental Burst increase by <span class="text-desc">25%</span>.`,
      image: 'UI_Talent_S_Olorun_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `-`,
      content: `Increases the Level of <b>Elemental Skill</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Olorun_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `-`,
      content: `After consuming <b class="text-genshin-electro">Nightsoul</b> points to trigger the effect of Ascension Talent 1, the active party member's ATK increases by <span class="text-desc">10%</span> for <span class="text-desc">9</span>s, stacking up to <span class="text-desc">3</span> times. Each stack is counted independently.
      <br />In addition, when his Elemental Burst is used, an attack that counts as an instance of <b class="text-genshin-electro">Electric Induction</b> that does not consume <b class="text-genshin-electro">Nightsoul</b> points will be triggered, dealing <span class="text-desc">300%</span> of his ATK as <b class="text-genshin-electro">Electro DMG</b>.`,
      image: 'UI_Talent_S_Olorun_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ororon_c1',
      text: `Enhanced Electric Induction`,
      ...talents.c1,
      show: c >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'ororon_c2',
      text: `C2 Electro DMG Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: 4,
      max: 4,
      min: 0,
    },
    {
      type: 'number',
      id: 'ororon_c6',
      text: `C6 ATK Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: 3,
      min: 0,
      max: 3,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'ororon_c6')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.50642, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.44373, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.69821, normal, 'physical', '1'), multiplier: Stats.ATK }],
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
          element: Element.ELECTRO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.976, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Activation DMG`,
          value: [{ scaling: calcScaling(1.74384, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
        {
          name: `Soundwave Collision DMG`,
          value: [{ scaling: calcScaling(0.332, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.BURST,
        },
      ]

      if (a >= 1) {
        base.SKILL_SCALING.push({
          name: 'Electric Induction DMG',
          value: [{ scaling: 1.3, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
          bonus: form.ororon_c1 ? 0.6 : 0,
        })
      }
      if (form.ororon_c2) {
        base[Stats.ELECTRO_DMG].push({
          value: 0.12 * (form.ororon_c2 + 1),
          name: 'Constellation 2',
          source: 'Self',
        })
      }
      if (form.ororon_c6) {
        base[Stats.P_ATK].push({
          value: 0.1 * form.ororon_c6,
          name: 'Constellation 6',
          source: 'Self',
        })
      }
      if (c >= 6) {
        base.SKILL_SCALING.push({
          name: 'C6 Electric Induction DMG',
          value: [{ scaling: 3, multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.ADD,
          bonus: form.ororon_c1 ? 0.6 : 0,
        })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.ororon_c6) {
        base[Stats.P_ATK].push({
          value: 0.1 * form.ororon_c6,
          name: 'Constellation 6',
          source: 'Self',
        })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ororon
