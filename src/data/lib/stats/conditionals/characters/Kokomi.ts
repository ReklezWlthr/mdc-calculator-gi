import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const Kokomi = (c: number, a: number, t: ITalentLevel) => {
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
      trace: `Normal Attack`,
      title: `The Shape of Water`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 3 consecutive attacks that take the form of swimming fish, dealing <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to deal <b class="text-genshin-hydro">AoE Hydro DMG</b> after a short casting time.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Gathering the might of Hydro, Kokomi plunges towards the ground from mid-air, damaging all opponents in her path. Deals <b class="text-genshin-hydro">AoE Hydro DMG</b> upon impact with the ground.
      `,
      image: 'Skill_A_Catalyst_MD',
    },
    skill: {
      trace: `Elemental Skill`,
      title: `Kurage's Oath`,
      content: `Summons a <b class="text-genshin-hydro">Bake-Kurage</b> created from water that can heal her allies.
      <br />Using this skill will apply the <b class="text-genshin-hydro">Wet</b> status to Sangonomiya Kokomi.
      <br />
      <br /><b class="text-genshin-hydro">Bake-Kurage</b>
      <br />Deals <b class="text-genshin-hydro">Hydro DMG</b> to surrounding opponents and heal nearby active characters at fixed intervals. This healing is based on Kokomi's Max HP.
      `,
      image: 'Skill_S_Kokomi_01',
    },
    burst: {
      trace: `Elemental Burst`,
      title: `Nereid's Ascension`,
      content: `Summons the might of Watatsumi, dealing <b class="text-genshin-hydro">Hydro DMG</b> to surrounding opponents, before robing Kokomi in a <b class="text-genshin-hydro">Ceremonial Garment</b> made from the flowing waters of Sangonomiya.
      <br />
      <br /><b class="text-genshin-hydro">Ceremonial Garment</b>
      <br />- Sangonomiya Kokomi's Normal Attack, Charged Attack and <b class="text-genshin-hydro">Bake-Kurage</b> DMG are increased based on her Max HP.
      <br />- When her Normal and Charged Attacks hit opponents, Kokomi will restore HP for all nearby party members, and the amount restored is based on her Max HP.
      <br />- Increases Sangonomiya Kokomi's resistance to interruption and allows her to walk on the water's surface.
      <br />
      <br />These effects will be cleared once Sangonomiya Kokomi leaves the field.`,
      image: 'Skill_E_Kokomi_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Tamakushi Casket`,
      content: `If Sangonomiya Kokomi's own <b class="text-genshin-hydro">Bake-Kurage</b> are on the field when she uses <b>Nereid's Ascension</b>, the <b class="text-genshin-hydro">Bake-Kurage</b>'s duration will be refreshed.`,
      image: 'UI_Talent_S_Kokomi_05',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Song of Pearls`,
      content: `While donning the <b class="text-genshin-hydro">Ceremonial Garment</b> created by <b>Nereid's Ascension</b>, the Normal and Charged Attack DMG Bonus Sangonomiya Kokomi gains based on her Max HP will receive a further increase based on <span class="text-desc">15%</span> of her Healing Bonus.`,
      image: 'UI_Talent_S_Kokomi_06',
    },
    util: {
      trace: `Utiliy Passive`,
      title: `Princess of Watatsumi`,
      content: `Decreases swimming Stamina consumption for your own party members by <span class="text-desc">20%</span>.
      <br />Not stackable with Passive Talents that provide the exact same effects.`,
      image: 'UI_Talent_Explosion_Swim',
    },
    bonus: {
      trace: `Bonus Ability`,
      title: `Flawless Strategy`,
      content: `Sangonomiya Kokomi has a <span class="text-desc">25%</span> Healing Bonus, but a <span class="text-desc">100%</span> decrease in CRIT Rate.`,
      image: `UI_Talent_S_Kokomi_07`,
    },
    c1: {
      trace: `Constellation 1`,
      title: `At Water's Edge`,
      content: `While donning the <b class="text-genshin-hydro">Ceremonial Garment</b> created by <b>Nereid's Ascension</b>, the final Normal Attack in Sangonomiya Kokomi's combo will unleash a swimming fish to deal <span class="text-desc">30%</span> of her Max HP as <b class="text-genshin-hydro">Hydro DMG</b>.
      <br />This DMG is not considered Normal Attack DMG.`,
      image: 'UI_Talent_S_Kokomi_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `The Clouds Like Waves Rippling`,
      content: `Sangonomiya Kokomi gains the following Healing Bonuses with regard to characters with <span class="text-desc">50%</span> or less HP via the following methods:
      <br />- Kurage's Oath Bake-Kurage: <span class="text-desc">4.5%</span> of Kokomi's Max HP.
      <br />- Nereid's Ascension Normal and Charged Attacks: <span class="text-desc">0.6%</span> of Kokomi's Max HP.`,
      image: 'UI_Talent_S_Kokomi_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `The Moon, A Ship O'er the Seas`,
      content: `Increases the Level of <b>Nereid's Ascension</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kokomi_02',
    },
    c4: {
      trace: `Constellation 4`,
      title: `The Moon Overlooks the Waters`,
      content: `While donning the <b class="text-genshin-hydro">Ceremonial Garment</b> created by <b>Nereid's Ascension</b>, Sangonomiya Kokomi's Normal Attack SPD is increased by <span class="text-desc">10%</span>, and Normal Attacks that hit opponents will restore <span class="text-desc">0.8</span> Energy for her.
      <br />This effect can occur once every <span class="text-desc">0.2</span>s.`,
      image: 'UI_Talent_S_Kokomi_03',
    },
    c5: {
      trace: `Constellation 5`,
      title: `All Streams Flow to the Sea`,
      content: `Increases the Level of <b>Kurage's Oath</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_U_Kokomi_01',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Sango Isshin`,
      content: `While donning the <b class="text-genshin-hydro">Ceremonial Garment</b> created by <b>Nereid's Ascension</b>, Sangonomiya Kokomi gains a <span class="text-desc">40%</span> <b class="text-genshin-hydro">Hydro DMG Bonus</b> for <span class="text-desc">4</span>s when her Normal and Charged Attacks heal, or would heal, any party member with <span class="text-desc">80%</span> or more HP.`,
      image: 'UI_Talent_S_Kokomi_04',
    },
  }

  const content: IContent[] = [
    {
      type: 'toggle',
      id: 'kokomi_burst',
      text: `Ceremonial Garment`,
      ...talents.burst,
      show: true,
      default: true,
    },
    {
      type: 'toggle',
      id: 'kokomi_c2',
      text: `Target Current HP <= 50%`,
      ...talents.c2,
      show: c >= 2,
      default: true,
    },
    {
      type: 'toggle',
      id: 'kokomi_c6',
      text: `C6 Hydro DMG Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: true,
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.PLUNGE_SCALING = getPlungeScaling('catalyst', normal, Element.HYDRO)
      const burstSkillScaling = form.kokomi_burst
        ? [{ scaling: calcScaling(0.071, burst, 'elemental', '1'), multiplier: Stats.HP }]
        : []
      base.SKILL_SCALING = [
        {
          name: 'Regeneration',
          value: [
            {
              scaling: calcScaling(0.044, skill, 'elemental', '1') + (form.kokomi_c2 ? 0.045 : 0),
              multiplier: Stats.HP,
            },
          ],
          flat: calcScaling(423.7, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
        {
          name: 'Ripple DMG',
          value: [
            { scaling: calcScaling(1.0919, skill, 'elemental', '1'), multiplier: Stats.ATK },
            ...burstSkillScaling,
          ],
          element: Element.HYDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: `Skill DMG`,
          value: [{ scaling: calcScaling(0.1042, burst, 'elemental', '1'), multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Healing Per Hit',
          value: [
            {
              scaling: calcScaling(0.0081, skill, 'elemental', '1') + (form.kokomi_c2 ? 0.006 : 0),
              multiplier: Stats.HP,
            },
          ],
          flat: calcScaling(77.03, skill, 'special', 'flat'),
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        },
      ]

      if (form.kokomi_burst && c >= 4) base.ATK_SPD.push({ value: 0.1, name: 'Constellation 4', source: `Self` })
      if (form.kokomi_c6) base[Stats.HYDRO_DMG].push({ value: 0.4, name: 'Constellation 6', source: `Self` })

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>) => {
      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      const burstScaling = form.kokomi_burst
        ? [
            {
              scaling: calcScaling(0.0484, burst, 'elemental', '1') + (a >= 4 ? 0.15 * base.getValue(Stats.HEAL) : 0),
              multiplier: Stats.HP,
            },
          ]
        : []
      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.6838, normal, 'elemental', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.6154, normal, 'elemental', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.9431, normal, 'elemental', '1'), multiplier: Stats.ATK }, ...burstScaling],
          element: Element.HYDRO,
          property: TalentProperty.NA,
        },
      ]
      const burstChargeScaling = form.kokomi_burst
        ? [
            {
              scaling: calcScaling(0.0678, burst, 'elemental', '1') + (a >= 4 ? 0.15 * base.getValue(Stats.HEAL) : 0),
              multiplier: Stats.HP,
            },
          ]
        : []
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack',
          value: [
            { scaling: calcScaling(1.4832, normal, 'elemental', '1'), multiplier: Stats.ATK },
            ...burstChargeScaling,
          ],
          element: Element.HYDRO,
          property: TalentProperty.CA,
        },
      ]

      if (form.kokomi_burst && c >= 1)
        base.BASIC_SCALING.push({
          name: 'C1 Additional Fish Attack',
          value: [{ scaling: 0.3, multiplier: Stats.HP }],
          element: Element.HYDRO,
          property: TalentProperty.ADD,
        })

      return base
    },
  }
}

export default Kokomi
