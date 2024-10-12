import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kachina = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Cragbiter`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 4 consecutive spear strikes.
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
      title: `Go, Go Turbo Twirly!  `,
      content: `Fight alongside the turbo trusty <b>Turbo Twirly</b>!
      <br />Summons <b>Turbo Twirly</b>. When the skill is Held and released, Kachina will summon and ride <b>Turbo Twirly</b>.
      <br />After the Skill is used, Kachina will gain <span class="text-desc">60</span> <b class="text-genshin-geo">Nightsoul</b> points and enter the <b class="text-genshin-geo">Nightsoul's Blessing</b> state.
      <br />
      <br /><b>Nightsoul's Blessing: Kachina</b>
      <br /><b>Turbo Twirly</b>'s various actions consume Kachina's <b class="text-genshin-geo">Nightsoul</b> points.
      <br />The <b class="text-genshin-geo">Nightsoul's Blessing</b> state will end when these points have been depleted.
      <br />
      <br /><b>Turbo Twirly</b>
      <br />Can exist independently or be ridden and operated by Kachina. When <b>Turbo Twirly</b> is present, Kachina's Elemental Skill, <b>Go, Go Turbo Twirly!</b>, will change to an option to Mount/Dismount <b>Turbo Twirly</b>.
      <br />- When present independent of Kachina, it will slam the ground at intervals, dealing Nightsoul-aligned <b class="text-genshin-geo">AoE Geo DMG</b> based on Kachina's DEF.
      <br />- When Kachina is riding <b>Turbo Twirly</b>, she can control it to move and climb swiftly, and use Normal Attacks to slam the ground, dealing Nightsoul-aligned <b class="text-genshin-geo">AoE Geo DMG</b> based on Kachina's DEF.
      <br />
      <br /><b>Turbo Twirly</b> will disappear once <b class="text-genshin-geo">Nightsoul's Blessing</b>'s Blessing state ends, and it is considered a <b class="text-genshin-geo">Geo Construct</b>. Only <span class="text-desc">1</span> Turbo Twirly created by Kachina herself can exist on the field at any one time.`,
      image: 'Skill_S_Kachina_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Time to Get Serious!`,
      content: `Striking the ground, Kachina deals <b class="text-genshin-geo">AoE Geo DMG</b> based on her DEF and creates a <b>Turbo Drill Field</b>.
      <br />The <b>Field</b> increases <b>Turbo Twirly</b>'s attack AoE and its Movement SPD when Kachina is riding it.`,
      image: 'Skill_E_Kachina_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Mountain Echoes`,
      content: `After nearby party members trigger a <b>Nightsoul Burst</b>, Kachina's <b class="text-genshin-geo">Geo DMG Bonus</b> increases by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s`,
      image: 'UI_Talent_S_Kachina_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `The Weight of Stone`,
      content: `<b>Turbo Twirly</b>'s DMG is increased by <span class="text-desc">20%</span> of Kachina's DEF.`,
      image: 'UI_Talent_S_Kachina_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Boon of Crystal Flame`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, <span class="text-desc">20</span> Stamina will be restored when interacting with some harvestable items. Additionally, the location of nearby resources unique to Natlan will appear on your mini-map.`,
      image: 'UI_Talent_S_Kachina_08',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Heart of Unity`,
      content: `After her <b class="text-genshin-geo">Nightsoul</b> points are depleted, Kachina will switch to consuming <b class="text-genshin-pyro">Phlogiston</b> to maintain her <b class="text-genshin-geo">Nightsoul's Blessing</b>.
      <br />While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, she can use <b>Nightsoul Transmission: Kachina</b>. When the active character is currently sprinting, climbing, in a movement mode caused by certain Talents, or at a certain height in the air, the following will trigger when switching to Kachina: Kachina will enter the <b class="text-genshin-geo">Nightsoul's Blessing</b> state and ride Turbo Twirly when taking the field while gaining <span class="text-desc">30</span> <b class="text-genshin-geo">Nightsoul</b> points. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your own team.
      <br />
      <br />Additionally, while in Natlan, Kachina will consume <span class="text-desc">90%</span> less Stamina when climbing while riding <b>Turbo Twirly</b>.`,
      image: 'UI_Talent_S_Kachina_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Shards Are Gems Too`,
      content: `When Kachina mounts or dismounts <b>Turbo Twirly</b>, she will absorb nearby Elemental Shards created by Crystallize.
      <br />Additionally, when a party member picks up such a Shard, <span class="text-desc">3</span> Energy will be restored to Kachina. Energy can be restored this way once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Kachina_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Never Leave Home Without... <b>Turbo Twirly</b>`,
      content: `When Kachina uses <b>Time to Get Serious!</b>, she will regain <span class="text-desc">20</span> <b class="text-genshin-geo">Nightsoul</b> points. If there is no Turbo Twirly belonging to her on the field, she will enter <b class="text-genshin-geo">Nightsoul's Blessing</b> and summon one.`,
      image: 'UI_Talent_S_Kachina_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Improved Stabilizer`,
      content: `Increases the Level of <b>Go, Go Turbo Twirly!</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kachina_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `More Foes, More Caution`,
      content: `When there are <span class="text-desc">1</span>/<span class="text-desc">2</span>/<span class="text-desc">3</span>/<span class="text-desc">4</span> (or more) opponents within the <b>Turbo Drill Field</b> created by <b>Time to Get Serious!</b>, the active character within the field gains <span class="text-desc">8%</span>/<span class="text-desc">12%</span>/<span class="text-desc">16%</span>/<span class="text-desc">20%</span> increased DEF.`,
      image: 'UI_Talent_S_Kachina_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `All I've Collected Till Now`,
      content: `Increases the Level of <b>Time to Get Serious!</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kachina_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `This Time, I've Gotta Win`,
      content: `When your active character's Shield is replaced or destroyed for any reason, Kachina will deal <span class="text-desc">200%</span> of her DEF as <b class="text-genshin-geo">AoE Geo DMG</b>. This effect can be triggered once every <span class="text-desc">5</span>s.`,
      image: 'UI_Talent_S_Kachina_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'kachina_a1',
      text: `A1 Geo DMG Bonus`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'kachina_c4',
      text: `Enemies within Drill Field`,
      ...talents.c4,
      show: c >= 4,
      default: 4,
      min: 0,
      max: 4,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'kachina_c4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.494, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [1]',
          value: [{ scaling: calcScaling(0.276, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [2]',
          value: [{ scaling: calcScaling(0.306, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.704, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.774, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.127, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Turbo Twirly Mounted DMG',
          value: [{ scaling: calcScaling(0.878, skill, 'elemental', '1') + (a >= 4 ? 0.2 : 0), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Turbo Twirly Independent DMG',
          value: [{ scaling: calcScaling(0.638, skill, 'elemental', '1') + (a >= 4 ? 0.2 : 0), multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(3.806, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.kachina_a1) base[Stats.GEO_DMG].push({ value: 0.2, name: 'Ascension 1 Passive', source: `Self` })
      if (form.kachina_c4) {
        base[Stats.P_DEF].push({ value: 0.04 + form.kachina_c4 * 0.04, name: 'Constellation 4', source: `Self` })
      }
      if (c >= 6)
        base.SKILL_SCALING.push({
          name: 'C6 Shield Break DMG',
          value: [{ scaling: 2, multiplier: Stats.DEF }],
          element: Element.GEO,
          property: TalentProperty.ADD,
        })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.kachina_c4) {
        base[Stats.P_DEF].push({ value: 0.04 + form.kachina_c4 * 0.04, name: 'Constellation 4', source: `Kachina` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Kachina
