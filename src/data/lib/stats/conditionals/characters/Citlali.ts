import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Citlali = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Shadow-Stealing Spirit Vessel`,
      content: `<b>Normal Attack</b>
      <br />Calls upon secret arts passed down through the Masters of the Night-Wind from generation to generation, performing up to three strikes that deal <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Enters Aiming Mode, and after Holding, consumes a certain amount of Stamina to call forth a Frost Star that deals <b class="text-genshin-cryo">Cryo DMG</b> to opponents in its path.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-cryo">AoE Cryo DMG</b> upon impact with the ground.`,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Dawnfrost Darkstar`,
      content: `Invoking secret pacts passed down by her tribe over the millennia, Citlali deploys an <b>Opal Shield</b> and calls forth <b>Obsidian Tzitzimitl:</b> <b class="text-blue">Itzpapa</b> a creature that is (reputedly) terrifying beyond compare, dealing Nightsoul-aligned <b class="text-genshin-cryo">AoE Cryo DMG</b>.
      <br />The <b>Opal Shield</b>'s DMG absorption scales based on Citlali's Elemental Mastery, and absorbs <b class="text-genshin-cryo">Cryo DMG</b> with <span class="text-desc">250%</span> efficiency.
      <br />After using this skill, Citlali gains <span class="text-desc">24</span> <b class="text-genshin-cryo">Nightsoul</b> points and enters the <b class="text-genshin-cryo">Nightsoul's Blessing</b> state.
      <br />
      <br /><b>Nightsoul's Blessing: Citlali</b>
      <br />When <b class="text-blue">Itzpapa</b> leaves the field, Citlali exits the <b class="text-genshin-cryo">Nightsoul's Blessing</b> state.
      <br />
      <br /><b class="text-blue">Itzpapa</b>
      <br />- <b class="text-blue">Itzpapa</b> will follow the character.
      <br />- If Citlali has at least <span class="text-desc">50</span> <b class="text-genshin-cryo">Nightsoul</b> points, <b class="text-blue">Itzpapa</b> enters the <b>Opal Fire</b> state and continuously consumes <b class="text-genshin-cryo">Nightsoul</b> points to whip up a <b>Frostfall Storm</b> that attacks opponents within its AoE, dealing Nightsoul-aligned <b class="text-genshin-cryo">Cryo DMG</b>.
      <br />- When Citlali's <b class="text-genshin-cryo">Nightsoul</b> points are fully depleted, <b class="text-blue">Itzpapa</b>'s <b>Opal Fire</b> state also ends.
      `,
      image: 'Skill_S_Citlali_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Edict of Entwined Splendor`,
      content: `Summons forth "allies" from the starry skies and the vast earth, hurling an icy storm to bombard the area in front that deals Nightsoul-aligned <b class="text-genshin-cryo">AoE Cryo DMG</b>, restores a fixed amount of <b class="text-genshin-cryo">Nightsoul</b> points to Citlali, and also summons <span class="text-desc">1</span> <b>Spiritvessel Skulls</b> near a maximum of <span class="text-desc">3</span> opponents within the AoE. <b>Spiritvessel Skulls</b> explode after a period of time, dealing Nightsoul-aligned <b class="text-genshin-cryo">Cryo DMG</b> and restoring a fixed amount of <b class="text-genshin-cryo">Nightsoul</b> points to Citlali.`,
      image: 'Skill_E_Citlali_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Five Days of Frigid Rain`,
      content: `When Citlali is in the <b class="text-genshin-cryo">Nightsoul's Blessing</b> state, after nearby party members trigger the Frozen or Melt reactions, the <b class="text-genshin-pyro">Pyro</b> and <b class="text-genshin-hydro">Hydro RES</b> of opponents affected by that reaction decreases by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s. Additionally, Citlali will regain <span class="text-desc">16</span> <b class="text-genshin-cryo">Nightsoul</b> points. <b class="text-genshin-cryo">Nightsoul</b> points can be restored this way once every <span class="text-desc">8</span>s.`,
      image: 'UI_Talent_S_Citlali_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `White Butterfly's Star Garments`,
      content: `During the Elemental Skill <b>Dawnfrost Darkstar</b>, <b class="text-blue">Itzpapa</b>'s <b>Frostfall Storm</b> DMG is increased by <span class="text-desc">90%</span> of Citlali's Elemental Mastery. During the Elemental Burst <b>Edict of Entwined Splendor</b>, <b>Ice Storm</b> DMG is increased by <span class="text-desc">2400%</span> of Citlali's Elemental Mastery.
      <br />In addition, when nearby party members trigger <b>Nightsoul Bursts</b>, Citlali regains <span class="text-desc">4</span> <b class="text-genshin-cryo">Nightsoul</b> points.`,
      image: 'UI_Talent_S_Citlali_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `-`,
      content: `The party's <b>Nightsoul Transmission</b> CD is decreased by <span class="text-desc">20%</span>.`,
      image: 'UI_Talent_S_Citlali_07',
    },
    bonus: {
      trace: `Night Realm's Gift`,
      title: `Smoke, Mirrors, and the Flowing Winds`,
      content: `While in an area with <b class="text-genshin-pyro">Phlogiston</b> Mechanics within Natlan, can use <b>Nightsoul Transmission: Citlali</b>. When the active character is currently high enough in the air, the following will trigger when switching to Citlali: Citlali will leap up high, and will deploy <b>White Obsidian Tzitzimitl: Citlalin</b> to float in the air. <b>Nightsoul Transmission</b> can be triggered once every <span class="text-desc">10</span>s by your party.
      <br />
      <br />Holding Aiming Mode will cause Citlali to enter the <b>Spiritspeaker</b> state, which will allow her to interact with <b>Nightspirit Graffiti</b> and <b>Nightspirit Sigils</b>, extracting information and power from them. The rules for interacting with these objects follow the same rules as those governing Iktomisaurus interactions.
      <br />
      <br />Additionally, holding the jump button will cause Citlali to consume <span class="text-desc">75</span> Stamina and leap. In areas within Natlan where <b class="text-genshin-pyro">Phlogiston</b> mechanics are present, Citlali will prioritize consuming <span class="text-desc">5</span> <b class="text-genshin-pyro">Phlogiston</b> to leap to a height higher still.
      <br />When in the air, Citlali can Hold her Normal Attack to consume <b class="text-genshin-pyro">Phlogiston</b> or Stamina and enter Aiming Mode and trigger Charged Attacks: When initiating Charged Attacks in mid-air, Citlali will prioritize consuming <span class="text-desc">20</span> <b class="text-genshin-pyro">Phlogiston</b>.`,
      image: 'UI_Talent_S_Citlali_08',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Bladed Light of Four Hundred Stars`,
      content: `When she uses the Elemental Skill <b>Dawnfrost Darkstar</b>, Citlali gains the <b>Opalstar Vestments</b> effect until her <b class="text-genshin-cryo">Nightsoul's Blessing</b> state ends. During this time, she will obtain <span class="text-desc">10</span> <b class="text-blue">Stellar Blades</b>. When a nearby active character other than Citlali deals DMG, consume <span class="text-desc">1</span> <b class="text-blue">Blade</b> to increase the DMG dealt by <span class="text-desc">200%</span> of Citlali's Elemental Mastery.
      <br />After nearby party members trigger Frozen or Melt, Citlali will gain another <span class="text-desc">3</span> <b class="text-blue">Stellar Blades</b>. This effect can trigger once every <span class="text-desc">8</span>s.
      <br />Using the Elemental Skill <b>Dawnfrost Darkstar</b> will reset <b class="text-blue">Stellar Blade</b> stacks.
      <br />Additionally, when Citlali is using her leap, or is Aiming or using her Charged Attack in mid-air, her <b class="text-genshin-pyro">Phlogiston</b> consumption is decreased by <span class="text-desc">45%</span>.`,
      image: 'UI_Talent_S_Citlali_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Death Defier's Spirit Skull`,
      content: `Citlali gains <span class="text-desc">125</span> Elemental Mastery, and other characters shielded by her <b>Opal Shield</b> gain <span class="text-desc">250</span> Elemental Mastery.
      <br />Additionally, when the Elemental Skill <b>Dawnfrost Darkstar</b> is used, nearby active characters will also be granted an <b>Opal Shield</b>.
      <br />
      <br />Also, the Passive Talent <b>Five Days of Frigid Rain</b> has its effects enhanced:
      <br />When Citlali is in the <b class="text-genshin-cryo">Nightsoul's Blessing</b> state, after nearby party members trigger Frozen or Melt, the opponent(s) affected by this reaction will have their <b class="text-genshin-pyro">Pyro</b> and <b class="text-genshin-hydro">Hydro RES</b> additionally decreased by <span class="text-desc">20%</span> for <span class="text-desc">12</span>s. You must first unlock the Passive Talent <b>Five Days of Frigid Rain</b> to gain access to the above effect.`,
      image: 'UI_Talent_S_Citlali_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Cloud Serpent's Feathered Crown`,
      content: `Increases the Level of <b>Dawnfrost Darkstar</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Citlali_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Heart Devourer's Travail`,
      content: `While the Elemental Skill <b>Dawnfrost Darkstar</b> is active, when <b class="text-blue">Itzpapa</b>'s <b>Frostfall Storm</b> hits opponents, an additional <b>Obsidian Spiritvessel Skull</b> is summoned. When a <b>Spiritvessel Skull</b> summoned this way explodes, it deals <span class="text-desc">1200%</span> of Citlali's Elemental Mastery as Nightsoul-aligned <b class="text-genshin-cryo">Cryo DMG</b> and restores <span class="text-desc">16</span> <b class="text-genshin-cryo">Nightsoul</b> points to Citlali. This effect can trigger once every <span class="text-desc">8</span>s. This DMG is not considered Elemental Burst DMG.`,
      image: 'UI_Talent_S_Citlali_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Five-Balestar Hex`,
      content: `Increases the Level of <b>Edict of Entwined Splendor</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Citlali_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Secret Pact of Wisdom`,
      content: `The <b class="text-blue">Itzpapa</b> summoned by Elemental Skill <b>Dawnfrost Darkstar</b> will always be in the <b>Opal Fire</b> state, and when <b class="text-genshin-cryo">Nightsoul</b> points are exhausted, this state will not end.
      <br />Additionally, <b>Dawnfrost Darkstar</b> is used, <b class="text-blue">Itzpapa</b> will consume all <b class="text-genshin-cryo">Nightsoul</b> points, and while it is on the field, it will continuously consume <b class="text-genshin-cryo">Nightsoul</b> points to grant all nearby party members <b class="text-genshin-pyro">Pyro</b>, <b class="text-genshin-hydro">Hydro</b>, and <b class="text-genshin-cryo">Cryo DMG Bonuses</b>, with each consumed <b class="text-genshin-cryo">Nightsoul</b> point granting <span class="text-desc">1.5%</span> of the corresponding DMG Bonus. The maximum DMG Bonus that can be gained this way is <span class="text-desc">60%</span>.`,
      image: 'UI_Talent_S_Citlali_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'citlali_a1',
      text: `A1 RES Shred`,
      ...talents.a1,
      show: a >= 1,
      default: true,
    },
    {
      type: 'number',
      id: 'citlali_c6',
      text: `C6 DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: 1,
      min: 0,
      max: 40,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'citlali_a1'), findContentById(content, 'citlali_c6')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [
      {
        type: 'toggle',
        id: 'citlali_c2',
        text: `C2 Shield EM Share`,
        ...talents.c2,
        show: c >= 2,
        default: false,
      },
    ],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.434, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.388, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.538, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.NA,
          hit: 3,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(0.992, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.CRYO)

      base.SKILL_SCALING = [
        {
          name: 'Obsidian Tzitzimitl DMG',
          value: [{ scaling: calcScaling(0.73, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Opal Shield DMG Absorption',
          value: [{ scaling: calcScaling(5.76, skill, 'elemental', '1'), multiplier: Stats.EM }],
          flat: calcScaling(1387, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
        {
          name: 'Frostfall Storm DMG',
          value: [{ scaling: calcScaling(0.17, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Ice Storm DMG`,
          value: [{ scaling: calcScaling(5.376, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
        {
          name: `Spiritvessel Skull DMG`,
          value: [{ scaling: calcScaling(1.344, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.citlali_a1) {
        base.PYRO_RES_PEN.push({ value: 0.2 * (c >= 2 ? 2 : 1), name: 'Ascension 1 Passive', source: `Self` })
        base.HYDRO_RES_PEN.push({ value: 0.2 * (c >= 2 ? 2 : 1), name: 'Ascension 1 Passive', source: `Self` })
      }
      if (a >= 4) {
        base.SKILL_SCALING.push({
          name: `Enhanced Frostfall Storm DMG`,
          value: [
            { scaling: calcScaling(0.17, skill, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: 0.9, multiplier: Stats.EM },
          ],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        })
        base.BURST_SCALING.push({
          name: `Enhanced Ice Storm DMG`,
          value: [
            { scaling: calcScaling(5.376, burst, 'elemental', '1'), multiplier: Stats.ATK },
            { scaling: 24, multiplier: Stats.EM },
          ],
          element: Element.CRYO,
          property: TalentProperty.BURST,
        })
      }
      if (c >= 1) {
        base.SKILL_SCALING.push({
          name: `Stellar Blade DMG`,
          value: [{ scaling: 2, multiplier: Stats.EM }],
          element: Element.CRYO,
          property: TalentProperty.SKILL,
        })
      }
      if (c >= 4) {
        base.SKILL_SCALING.push({
          name: `Obsidian Spiritvessel Skull DMG`,
          value: [{ scaling: 12, multiplier: Stats.EM }],
          element: Element.CRYO,
          property: TalentProperty.ADD,
        })
      }
      if (form.citlali_c6) {
        base[Stats.PYRO_DMG].push({ value: 0.015 * form.citlali_c6, name: 'Constellation 6', source: `Self` })
        base[Stats.HYDRO_DMG].push({ value: 0.015 * form.citlali_c6, name: 'Constellation 6', source: `Self` })
        base[Stats.CRYO_DMG].push({ value: 0.015 * form.citlali_c6, name: 'Constellation 6', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (form.citlali_a1) {
        base.PYRO_RES_PEN.push({ value: 0.2 * (c >= 2 ? 2 : 1), name: 'Ascension 1 Passive', source: `Citlali` })
        base.HYDRO_RES_PEN.push({ value: 0.2 * (c >= 2 ? 2 : 1), name: 'Ascension 1 Passive', source: `Citlali` })
      }
      if (aForm.citlali_c2) {
        base[Stats.EM].push({ value: 250, name: 'Constellation 2', source: `Citlali` })
      }
      if (form.citlali_c6) {
        base[Stats.PYRO_DMG].push({ value: 0.015 * form.citlali_c6, name: 'Constellation 6', source: `Citlali` })
        base[Stats.HYDRO_DMG].push({ value: 0.015 * form.citlali_c6, name: 'Constellation 6', source: `Citlali` })
        base[Stats.CRYO_DMG].push({ value: 0.015 * form.citlali_c6, name: 'Constellation 6', source: `Citlali` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Citlali
