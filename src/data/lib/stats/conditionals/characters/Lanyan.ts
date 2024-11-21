import { findCharacter, findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Lanyan = (c: number, a: number, t: ITalentLevel) => {
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
      title: `Black Pheasant Strides on Water`,
      content: `<b>Normal Attack</b>
      <br />Wields her ring blades and performs up to 4 attacks using them, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to throw out a ring blade, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-anemo">AoE Anemo DMG</b> upon impact with the ground.`,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Phoenix-Wisp Pinion Dance`,
      content: `Summoning forth the <b>Phoenix-Wisp Shield</b>, a secret art passed down across generations, Lan Yan dashes forward and, upon making contact with her target, will leap back into the air.
      <br />The <b>Phoenix-Wisp Shield</b>'s DMG absorption scales based on her ATK, and has a <span class="text-desc">250%</span> absorption efficiency against <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />While in mid-air due to the effects of her Elemental Skill, pressing her Elemental Skill again or pressing Normal Attack will cause Lan Yan to hurl her <b>Feathermoon Rings</b> at an opponent, and they will spin between nearby opponents twice upon hit, dealing <b class="text-genshin-anemo">Anemo DMG</b>.
      <br />Holding the Skill will cause it to behave differently.
      <br />
      <br /><b>Hold</b>
      <br />Enter Aiming Mode to adjust the dash direction.
      `,
      image: 'Skill_S_Lanyan_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Lustrous Moonrise`,
      content: `Lan Yan creates a <b>Feathermoon Swallow Array</b>, pulling in nearby opponents and objects and dealing multiple instances of <b class="text-genshin-anemo">AoE Anemo DMG</b>.`,
      image: 'Skill_E_Lanyan_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Four Sealing Divination Blades`,
      content: `When the dash from the Elemental Skill <b>Phoenix-Wisp Pinion Dance</b> hits an opponent, if it interacts with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-pyro">Pyro</b>/<b class="text-genshin-cryo">Cryo</b>/<b class="text-genshin-electro">Electro</b>, the <b>Phoenix-Wisp Shield</b> will undergo <b>Elemental Conversion</b>, with the converted shield absorbing DMG from the corresponding element with <span class="text-desc">250%</span> efficiency.
      <br />Additionally, if this use of <b>Phoenix-Wisp Pinion Dance</b> causes the <b>Phoenix-Wisp Shield</b> to undergo <b>Elemental Conversion</b>, the <b>Feathermoon Rings</b> Lan Yan throws at her foes additionally deal <b>Elemental DMG</b> equal to <span class="text-desc">50%</span> of the original in the corresponding Elemental Type. This DMG is considered Elemental Skill DMG.`,
      image: 'UI_Talent_S_Lanyan_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Skyfeather Evil-Subduing Charm`,
      content: `The Elemental Skill <b>Phoenix-Wisp Pinion Dance</b> and the Elemental Burst <b>Lustrous Moonrise</b> deal increased DMG equal to <span class="text-desc">309%</span> and <span class="text-desc">774%</span> of Lan Yan's Elemental Mastery respectively.`,
      image: 'UI_Talent_S_Lanyan_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `-`,
      content: `-`,
      image: 'UI_Talent_S_Sayu_07',
    },
    c1: {
      trace: `Constellation 1`,
      title: `"As One Might Stride Betwixt the Clouds"`,
      content: `After triggering the <b>Elemental Conversion</b> from the Passive Talent <b>Four Sealing Divination Blades</b>, this instance of Lan Yan's Elemental Skill <b>Phoenix-Wisp Pinion Dance</b> will produce another <b>Feathermoon Ring</b> when they are thrown at opponents.
      <br />You must first unlock the Passive Talent <b>Four Sealing Divination Blades</b>.`,
      image: 'UI_Talent_S_Lanyan_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `"Dance Vestments Billow Like Rainbow Jade"`,
      content: `While the <b>Phoenix-Wisp Shield</b> is active, when your active party member's Normal Attacks deal DMG, <span class="text-desc">40%</span> of the Shield's DMG absorption will be restored, up to its original maximum absorption. This effect can occur once every <span class="text-desc">2</span>s.`,
      image: 'UI_Talent_S_Lanyan_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `"On White Wings Pierce Through Cloud and Fog"`,
      content: `Increases the Level of <b>Phoenix-Wisp Pinion Dance</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Lanyan_01',
    },
    c4: {
      trace: `Constellation 4`,
      title: `"With Drakefalcon's Blood-Pearls Adorned"`,
      content: `After Lan Yan uses her Elemental Burst <b>Lustrous Moonrise</b>, the Elemental Mastery of all nearby party members increases by <span class="text-desc">60,</span> for <span class="text-desc">12</span>s.`,
      image: 'UI_Talent_S_Lanyan_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `"Having Met You, My Heart is Gladdened"`,
      content: `Increases the Level of <b>Lustrous Moonrise</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Lanyan_02',
    },
    c6: {
      trace: `Constellation 6`,
      title: `"Let Us Away on Slyphic Wing, the Silvered Ornaments to Ring"`,
      content: `<b>Phoenix-Wisp Pinion Dance</b> gains <span class="text-desc">1</span> additional charge.`,
      image: 'UI_Talent_S_Lanyan_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'element',
      id: 'lanyan_a1',
      text: `Skill Elemental Conversion`,
      ...talents.a1,
      show: a >= 1,
      default: Element.PYRO,
    },
    {
      type: 'toggle',
      id: 'lanyan_c4',
      text: `C4 EM Share`,
      ...talents.c4,
      show: c >= 4,
      default: true,
    },
  ]

  const teammateContent: IContent[] = [findContentById(content, 'lanyan_c4')]

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.414, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [1]',
          value: [{ scaling: calcScaling(0.204, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit [2]',
          value: [{ scaling: calcScaling(0.249, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.269, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
          hit: 2,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.646, normal, 'elemental', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG',
          value: [{ scaling: calcScaling(0.378, normal, 'physical', '1_alt'), multiplier: Stats.ATK }],
          element: Element.ANEMO,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.ANEMO)

      base.SKILL_SCALING = [
        {
          name: 'Ring Blade Attack DMG',
          value: [
            { scaling: calcScaling(0.963, skill, 'elemental', '1'), multiplier: Stats.ATK },
            ...(a >= 4 ? [{ scaling: calcScaling(3.09, skill, 'elemental', '1'), multiplier: Stats.EM }] : []),
          ],
          element: Element.ANEMO,
          property: TalentProperty.SKILL,
        },
        {
          name: 'Shield DMG Absorption',
          value: [{ scaling: calcScaling(2.765, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          flat: calcScaling(1156, skill, 'special', 'flat'),
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [
            { scaling: calcScaling(2.411, burst, 'elemental', '1'), multiplier: Stats.ATK },
            ...(a >= 4 ? [{ scaling: calcScaling(7.74, skill, 'elemental', '1'), multiplier: Stats.EM }] : []),
          ],
          element: Element.ANEMO,
          property: TalentProperty.BURST,
          hit: 3,
        },
      ]

      if (a >= 1) {
        base.SKILL_SCALING.push({
          name: 'Additional Ring Blade Attack DMG',
          value: [{ scaling: calcScaling(0.963, skill, 'elemental', '1') * 0.5, multiplier: Stats.ATK }],
          element: form.lanyan_a1,
          property: TalentProperty.SKILL,
        })
      }
      if (form.lanyan_c4) {
        base[Stats.EM].push({ value: 60, name: 'Constellation 4', source: `Self` })
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (form.lanyan_c4) {
        base[Stats.EM].push({ value: 60, name: 'Constellation 4', source: `Lan Yan` })
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      return base
    },
  }
}

export default Lanyan
