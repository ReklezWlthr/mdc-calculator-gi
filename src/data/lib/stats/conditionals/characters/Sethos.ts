import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Sethos = (c: number, a: number, t: ITalentLevel) => {
  const upgrade = {
    normal: c >= 3,
    skill: false,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Royal Reed Archery`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive shots with a bow.
      <br />
      <br /><b>Charged Attack</b>
      <br />Performs a more precise Aimed Shot with increased DMG.
      <br />While aiming, the power of Electro will accumulate on the arrowhead before the arrow is fired. Has different effects based on how long the energy has been charged:
      <br />- <b>Charge Level 1</b>: Fires off an arrow carrying the power of lightning that deals <b class="text-genshin-electro">Electro DMG</b>.
      <br />- <b>Charge Level 2</b>: Fires off a <b class="text-violet-400">Shadowpiercing Shot</b> which can pierce enemies, dealing <b class="text-genshin-electro">Electro DMG</b> to enemies along its path. After the <b class="text-violet-400">Shadowpiercing Shot</b> is fully charged, Sethos cannot move around.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Fires off a shower of arrows in mid-air before falling and striking the ground, dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_02',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Ancient Rite: The Thundering Sands`,
      content: `Gathers the might of thunder, dealing <b class="text-genshin-electro">AoE Electro DMG</b> and quickly retreating. If this attack triggers Electro-Charged, Superconduct, Overloaded, Quicken, Aggravate, or Electro Swirl reactions, Sethos recovers a certain amount of Elemental Energy.`,
      image: 'Skill_S_Sethos_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Secret Rite: Twilight Shadowpiercer`,
      content: `Perform a secret rite, entering the <b class="text-genshin-electro">Twilight Meditation</b> state, during which Sethos's Normal Attacks will be converted into enemy-piercing <b class="text-indigo-400">Dusk Bolts</b>: Deal <b class="text-genshin-electro">Electro DMG</b> to opponents in its path, with DMG increased based on Sethos's Elemental Mastery.
      <br />Sethos cannot perform Aimed Shots while in this state.
      <br />DMG dealt by <b class="text-indigo-400">Dusk Bolts</b> is considered Charged Attack DMG.
      <br />This effect will be canceled when Sethos leaves the field.
      `,
      image: 'Skill_E_Sethos_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Black Kite's Enigma`,
      content: `When Aiming, the charging time is decreased by <span class="text-desc">0.285</span>s based on each point of Sethos's current Elemental Energy. Charging time can be reduced to a minimum of <span class="text-desc">0.3</span>s through this method and a maximum of <span class="text-desc">20</span> Energy can be tallied. If a <b class="text-violet-400">Shadowpiercing Shot</b> is fired, consume the tallied amount of Elemental Energy; if it is a <b>Charge Level</b> <span class="text-desc">1</span> shot, then consume <span class="text-desc">50%</span> of the tallied amount of Elemental Energy.`,
      image: 'UI_Talent_S_Sethos_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `The Sand King's Boon`,
      content: `Sethos gains the <b class="text-desc">Scorching Sandshade</b> effect, increasing the DMG dealt by <b class="text-violet-400">Shadowpiercing Shots</b> by <span class="text-desc">700%</span> of Sethos's Elemental Mastery.
      <br />The Scorching <b class="text-desc">Scorching Sandshade</b> will be canceled when any of the following conditions are met:
      <br />- <span class="text-desc">5</span>s after a <b class="text-violet-400">Shadowpiercing Shot</b> first hits an opponent.
      <br />- After <span class="text-desc">4</span> <b class="text-violet-400">Shadowpiercing Shots</b> strike opponents.
      <br />
      <br />When a <b class="text-violet-400">Shadowpiercing Shot</b> affected by <b class="text-desc">Scorching Sandshade</b> first hits an opponent, Sethos will regain <b class="text-desc">Scorching Sandshade</b> after <span class="text-desc">15</span>s.`,
      image: 'UI_Talent_S_Sethos_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Thoth's Revelation`,
      content: `Displays the location of nearby resources unique to Sumeru on the mini-map.`,
      image: 'UI_Talent_S_Sethos_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Sealed Shrine's Spiritsong`,
      content: `The CRIT Rate of <b class="text-violet-400">Shadowpiercing Shot</b> is increased by <span class="text-desc">15%</span>.`,
      image: 'UI_Talent_S_Sethos_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Papyrus Scripture of Silent Secrets`,
      content: `When any of the following conditions are met, Sethos gains a <span class="text-desc">15%</span> <b class="text-genshin-electro">Electro DMG Bonus</b> for <span class="text-desc">10</span>s that may stack twice, with each stack duration counted independently:
      <br />- Consuming Elemental Energy through Aimed Shots; you must first unlock the Passive Talent <b>Black Kite's Enigma</b> to trigger this condition.
      <br />- Regaining Elemental Energy by triggering Elemental Reactions using <b>Ancient Rite: The Thundering Sands</b>.
      <br />- Using <b>Secret Rite: Twilight Shadowpiercer</b>.`,
      image: 'UI_Talent_S_Sethos_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Ode to the Moonrise Sage`,
      content: `Increases the Level of <b>Normal Attack: Royal Reed Archery</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sethos_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Beneficent Plumage`,
      content: `When a <b class="text-violet-400">Shadowpiercing Shot</b> or <b class="text-indigo-400">Dusk Bolt</b> strikes <span class="text-desc">2</span> or more opponents, all nearby party members gain <span class="text-desc">80</span> Elemental Mastery for <span class="text-desc">10</span>s.`,
      image: 'UI_Talent_S_Sethos_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Record of the Desolate God's Burning Sands`,
      content: `Increases the Level of <b>Secret Rite: Twilight Shadowpiercer</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Sethos_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Pylon of the Sojourning Sun Temple`,
      content: `After <b class="text-violet-400">Shadowpiercing Shot</b> strikes an opponent, the Elemental Energy consumed by the Passive Talent <b>Black Kite's Enigma</b> will be returned. This effect can be triggered up to once every <span class="text-desc">15</span>s. You must first unlock the Passive Talent <b>Black Kite's Enigma</b>.`,
      image: 'UI_Talent_S_Sethos_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'seth_burst',
      text: `Twilight Meditation`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'seth_a4',
      text: `Scorching Sandshade`,
      ...talents.a4,
      show: a >= 4,
      default: true,
    },
    {
      type: 'number',
      id: 'seth_c2',
      text: `C2 Electro DMG Bonus`,
      ...talents.c2,
      show: c >= 2,
      default: 2,
      min: 0,
      max: 2,
    },
    {
      type: 'toggle',
      id: 'seth_c4',
      text: `C4 EM Share`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'seth_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)
      

      const element = form.seth_burst ? Element.ELECTRO : Element.PHYSICAL
      const type = form.seth_burst ? TalentProperty.CA : TalentProperty.NA
      const burstScaling = form.seth_burst
        ? [{ scaling: calcScaling(1.9616, burst, 'elemental', '1'), multiplier: Stats.EM }]
        : []
      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.5261, normal, 'physical', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: element,
          property: type,
        },
        {
          name: '2-Hit [1]',
          value: [{ scaling: calcScaling(0.238, normal, 'physical', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: element,
          property: type,
        },
        {
          name: '2-Hit [2]',
          value: [{ scaling: calcScaling(0.2661, normal, 'physical', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: element,
          property: type,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.7399, normal, 'physical', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: element,
          property: type,
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
          name: 'Level 1 Aimed Shot',
          value: [{ scaling: calcScaling(1.24, normal, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.CA,
        },
        {
          name: 'Shadowpiercing Shot DMG',
          value: [
            { scaling: calcScaling(1.4, normal, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: calcScaling(1.3456, normal, 'elemental', '1') + (form.seth_a4 ? 7 : 0), multiplier: Stats.EM },
          ],
          element: Element.ELECTRO,
          property: TalentProperty.CA,
          cr: c >= 1 ? 0.15 : 0,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal)

      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(1.156, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.ELECTRO,
          property: TalentProperty.SKILL,
        },
      ]

      if (form.seth_c2)
        base[Stats.ELECTRO_DMG].push({ value: form.seth_c2 * 0.15, name: 'Constellation 2', source: 'Self' })
      if (form.seth_c4) base[Stats.EM].push({ value: 80, name: 'Constellation 4', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      if (form.seth_c4) base[Stats.EM].push({ value: 80, name: 'Constellation 4', source: `Sethos` })

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Sethos
