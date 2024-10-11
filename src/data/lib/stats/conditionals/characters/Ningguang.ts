import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Ningguang = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Sparkling Scatter`,
      content: `<b>Normal Attack</b>
      <br />Shoots gems that deal <b class="text-genshin-geo">Geo DMG</b>.
      <br />Upon hit, this grants Ningguang <span class="text-desc">1</span> <b class="text-genshin-geo">Star Jade</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of stamina to fire off a giant gem that deals <b class="text-genshin-geo">Geo DMG</b>.
      <br />If Ningguang has any <b class="text-genshin-geo">Star Jades</b>, unleashing a Charged Attack will cause the <b class="text-genshin-geo">Star Jades</b> to be fired at the enemy as well, dealing additional DMG.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the might of Geo, Ningguang plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-geo">AoE Geo DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Jade Screen`,
      content: `Ningguang creates a <b class="text-genshin-geo">Jade Screen</b> out of gold, obsidian and her great opulence, dealing <b class="text-genshin-geo">AoE Geo DMG</b>.
      <br />
      <br /><b class="text-genshin-geo">Jade Screen</b>
      <br />- Blocks opponents' projectiles.
      <br />- Endurance scales based on Ningguang's Max HP.
      <br />
      <br /><b class="text-genshin-geo">Jade Screen</b> is considered a <b class="text-genshin-geo">Geo Construct</b> and can be used to block certain attacks, but cannot be climbed. Only one <b class="text-genshin-geo">Jade Screen</b> may exist at any one time.
      `,
      image: 'Skill_S_Ningguang_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Starshatter`,
      content: `Gathering a great number of gems, Ningguang scatters them all at once, sending homing projectiles at her opponents that deal massive <b class="text-genshin-geo">Geo DMG</b>.
      <br />If <b>Starshatter</b> is cast when a <b class="text-genshin-geo">Jade Screen</b> is nearby, the <b class="text-genshin-geo">Jade Screen</b> will fire additional gem projectiles at the same time.`,
      image: 'Skill_E_Ningguang_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Backup Plan`,
      content: `When Ningguang is in possession of <b class="text-genshin-geo">Star Jades</b>, her Charged Attack does not consume Stamina.`,
      image: 'UI_Talent_S_Ningguang_02',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Strategic Reserve`,
      content: `A character that passes through the <b class="text-genshin-geo">Jade Screen</b> will gain a <span class="text-desc">12%</span> <b class="text-genshin-geo">Geo DMG Bonus</b> for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Ningguang_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Trove of Marvelous Treasures`,
      content: `Displays the location of nearby ore veins used in forging on the mini-map.`,
      image: 'UI_Talent_Collect_Ore',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Piercing Fragments`,
      content: `When a Normal Attack hits, it deals AoE DMG.`,
      image: 'UI_Talent_S_Ningguang_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Shock Effect`,
      content: `When <b class="text-genshin-geo">Jade Screen</b> is shattered, its CD will reset.
      <br />Can occur once every <span class="text-desc">6</span>s.`,
      image: 'UI_Talent_S_Ningguang_05',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Majesty Be the Array of Stars`,
      content: `Increases the Level of <b>Starshatter</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Ningguang_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Exquisite be the Jade, Outshining All Beneath`,
      content: `<b class="text-genshin-geo">Jade Screen</b> increases nearby characters' <b>Elemental RES</b> by <span class="text-desc">10%</span>.`,
      image: 'UI_Talent_S_Ningguang_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Invincible Be the Jade Screen`,
      content: `Increases the Level of <b>Jade Screen</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Ningguang_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Grandeur Be the Seven Stars`,
      content: `When <b>Starshatter</b> is used, Ningguang gains <span class="text-desc">7</span> <b class="text-genshin-geo">Star Jades</b>.`,
      image: 'UI_Talent_S_Ningguang_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'ning_a4',
      text: `Passing Through Jade Screen`,
      ...talents.a4,
      show: a >= 4,
      default: false,
    },
    {
      type: 'toggle',
      id: 'ning_c4',
      text: `C4 Elemental RES`,
      ...talents.c4,
      show: c >= 4,
      default: false,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'ning_a4'), findContentById(content, 'ning_c4')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: 'Normal Attack DMG',
          value: [{ scaling: calcScaling(0.28, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.NA,
          hit: 3,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [{ scaling: calcScaling(1.7408, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.CA,
        },
        {
          name: 'DMG per Star Jade',
          value: [{ scaling: calcScaling(0.496, normal, 'elemental', '1_alt'), multiplier: Stats.HP }],
          element: Element.GEO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.GEO)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `DMG Per Gem`,
          value: [{ scaling: calcScaling(0.8696, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
        },
        {
          name: `Total DMG [6 Gems]`,
          value: [{ scaling: calcScaling(0.8696, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
          multiplier: 6,
        },
        {
          name: `Total DMG [12 Gems]`,
          value: [{ scaling: calcScaling(0.8696, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.GEO,
          property: TalentProperty.BURST,
          multiplier: 12,
        },
      ]

      if (form.ning_a4) base[Stats.GEO_DMG].push({ value: 0.12, name: 'Ascension 4 Passive', source: 'Self' })
      if (form.ning_c4) {
        base.ALL_TYPE_RES.push({ value: 0.1, name: 'Constellation 4', source: 'Self' })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.ning_a4) base[Stats.GEO_DMG].push({ value: 0.12, name: 'Ascension 4 Passive', source: 'Ningguang' })
      if (form.ning_c4) {
        base.ALL_TYPE_RES.push({ value: 0.1, name: 'Constellation 4', source: 'Ningguang' })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Ningguang
