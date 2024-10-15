import { findContentById } from '@src/core/utils/finder'
import _ from 'lodash'
import { baseStatsObject, getPlungeScaling, StatsObject } from '../../baseConstant'
import { Element, ITalentLevel, ITeamChar, Stats, TalentProperty, WeaponType } from '@src/domain/constant'

import { toPercentage } from '@src/core/utils/converter'
import { IContent, ITalent } from '@src/domain/conditional'
import { calcScaling } from '@src/core/utils/data_format'

const TravelerGrass = (c: number, a: number, t: ITalentLevel, _team: ITeamChar[], gender: string) => {
  const upgrade = {
    normal: false,
    skill: c >= 3,
    burst: c >= 5,
  }
  const normal = t.normal + (upgrade.normal ? 3 : 0)
  const skill = t.skill + (upgrade.skill ? 3 : 0)
  const burst = t.burst + (upgrade.burst ? 3 : 0)

  const lumine = gender === 'PlayerGirl'

  const talents: ITalent = {
    normal: {
      level: normal,
      trace: `Normal Attack`,
      title: `Foreign Fieldcleaver`,
      content: `<b>Normal Attack</b>
      <br />Performs up to 5 rapid strikes.
      <br />
      <br /><b>Charged Attack</b>
      <br />Consumes a certain amount of Stamina to unleash 2 rapid sword strikes.
      <br />
      <br /><b>Plunging Attack</b>
      <br />Plunges from mid-air to strike the ground below, damaging opponents along the path and dealing AoE DMG upon impact.
      `,
      image: 'Skill_A_01',
    },
    skill: {
      level: skill,
      trace: `Elemental Skill`,
      title: `Razorgrass Blade`,
      content: `With a flourish of your blade, you unleash a spray of razor-sharp leaves that go before you and deal <b class="text-genshin-dendro">Dendro DMG</b>.
      `,
      image: 'Skill_E_PlayerGrass_01',
    },
    burst: {
      level: burst,
      trace: `Elemental Burst`,
      title: `Surgent Manifestation`,
      content: `Calling upon the might of the flora all around you, you create a <b class="text-genshin-dendro">Lea Lotus Lamp</b>.
      <br />This <b class="text-genshin-dendro">Lamp</b> will deal continuous <b class="text-genshin-dendro">Dendro DMG</b> to opponents within its AoE.
      <br />
      <br /><b>Lotuslight Transfiguration</b>
      <br />The <b class="text-genshin-dendro">Lea Lotus Lamp</b> will undergo the following changes after it comes into contact with <b class="text-genshin-hydro">Hydro</b>/<b class="text-genshin-electro">Electro</b>/<b class="text-genshin-pyro">Pyro</b>:
      <br />- <b class="text-genshin-hydro">Hydro</b>: the <b class="text-genshin-dendro">Lamp</b>'s AoE and the AoE of its attacks are increased.
      <br />- <b class="text-genshin-electro">Electro</b>: the <b class="text-genshin-dendro">Lamp</b>'s ATK SPD is increased.
      <br />- <b class="text-genshin-pyro">Pyro</b>: the <b class="text-genshin-dendro">Lamp</b> will explode after a short delay and then disappear, dealing <b class="text-genshin-dendro">AoE Dendro DMG</b>.
      <br />The <b class="text-genshin-dendro">Lea Lotus Lamp</b> can only undergo one <b>Lotuslight Transfiguration</b> in its duration.
      <br />
      <br />Only one <b class="text-genshin-dendro">Lamp</b> created by the Traveler can exist at any one time.`,
      image: 'Skill_S_PlayerGrass_01',
    },
    a1: {
      trace: `Ascension 1 Passive`,
      title: `Verdant Overgrowth`,
      content: `<b class="text-genshin-dendro">Lea Lotus Lamp</b> will obtain one level of <b>Overflowing Lotuslight</b> every second it is on the field, increasing the Elemental Mastery of active character(s) within its AoE by <span class="text-desc">6</span>. <b>Overflowing Lotuslight</b> has a maximum of <span class="text-desc">10</span> stacks.`,
      image: 'UI_Talent_U_PlayerGrass_01',
    },
    a4: {
      trace: `Ascension 4 Passive`,
      title: `Verdant Luxury`,
      content: `Every point of Elemental Mastery the Traveler possesses increases the DMG dealt by <b>Razorgrass Blade</b> by <span class="text-desc">0.15%</span> and the DMG dealt by <b>Surgent Manifestation</b> by <span class="text-desc">0.1%</span>.`,
      image: 'UI_Talent_U_PlayerGrass_02',
    },
    c1: {
      trace: `Constellation 1`,
      title: `Symbiotic Creeper`,
      content: `After <b>Razorgrass Blade</b> hits an opponent, it will regenerate <span class="text-desc">3.5</span> Energy for the Traveler.`,
      image: 'UI_Talent_S_PlayerGrass_01',
    },
    c2: {
      trace: `Constellation 2`,
      title: `Green Resilience`,
      content: `<b class="text-genshin-dendro">Lea Lotus Lamp</b>'s duration is increased by <span class="text-desc">3</span>s.`,
      image: 'UI_Talent_S_PlayerGrass_02',
    },
    c3: {
      trace: `Constellation 3`,
      title: `Whirling Weeds`,
      content: `Increases the Level of <b>Razorgrass Blade</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_S_PlayerGrass_03',
    },
    c4: {
      trace: `Constellation 4`,
      title: `Treacle Grass`,
      content: `After the <b class="text-genshin-dendro">Lea Lotus Lamp</b> triggers a <b>Lotuslight Transfiguration</b>, it will obtain <span class="text-desc">5</span> stacks of the <b>Overflowing Lotuslight</b> effect from the Passive Talent <b>Verdant Overgrowth</b>.
      <br />You must have unlocked this Passive Talent first.`,
      image: 'UI_Talent_S_PlayerGrass_04',
    },
    c5: {
      trace: `Constellation 5`,
      title: `Viridian Transience`,
      content: `Increases the Level of <b>Surgent Manifestation</b> by <span class="text-desc">3</span>.
      <br />Maximum upgrade level is <span class="text-desc">15</span>.`,
      image: 'UI_Talent_S_PlayerGrass_05',
    },
    c6: {
      trace: `Constellation 6`,
      title: `Withering Aggregation`,
      content: `The <b class="text-genshin-dendro">Dendro DMG Bonus</b> of the character under the effect of <b>Overflowing Lotuslight</b> as created by the <b class="text-genshin-dendro">Lea Lotus Lamp</b> is increased by <span class="text-desc">12%</span>. If the <b class="text-genshin-dendro">Lamp</b> has experienced a <b>Lotuslight Transfiguration</b> previously, the character will also gain <span class="text-desc">12%</span> <b>DMG Bonus</b> for the corresponding element.`,
      image: 'UI_Talent_S_PlayerGrass_06',
    },
  }

  const content: IContent[] = [
    {
      type: 'number',
      id: 'dmc_a1',
      text: `Overflowing Lotuslight`,
      ...talents.a1,
      show: a >= 1,
      default: 10,
      min: c >= 4 ? 5 : 0,
      max: 10,
    },
    {
      type: 'element',
      id: 'dmc_c6_transfig',
      text: `C6 Transfiguration Bonus`,
      ...talents.c6,
      show: c >= 6,
      default: '',
      options: [
        { name: 'None', value: '' },
        { name: Element.HYDRO, value: Element.HYDRO },
        { name: Element.ELECTRO, value: Element.ELECTRO },
        { name: Element.PYRO, value: Element.PYRO },
      ],
    },
  ]

  const teammateContent: IContent[] = []

  return {
    upgrade,
    talents,
    content,
    teammateContent,
    allyContent: [findContentById(content, 'dmc_a1')],
    preCompute: (x: StatsObject, form: Record<string, any>) => {
      const base = _.cloneDeep(x)

      base.BASIC_SCALING = [
        {
          name: '1-Hit',
          value: [{ scaling: calcScaling(0.445, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '2-Hit',
          value: [{ scaling: calcScaling(0.434, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '3-Hit',
          value: [{ scaling: calcScaling(0.53, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '4-Hit',
          value: [{ scaling: calcScaling(0.583, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
        {
          name: '5-Hit',
          value: [{ scaling: calcScaling(0.708, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.NA,
        },
      ]
      base.CHARGE_SCALING = [
        {
          name: 'Charged Attack DMG [1]',
          value: [{ scaling: calcScaling(0.559, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
        {
          name: 'Charged Attack DMG [2]',
          value: [{ scaling: calcScaling(lumine ? 0.722 : 0.607, normal, 'physical', '1'), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CA,
        },
      ]
      base.PLUNGE_SCALING = getPlungeScaling('base', normal)
      base.SKILL_SCALING = [
        {
          name: 'Skill DMG',
          value: [{ scaling: calcScaling(2.304, skill, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.SKILL,
        },
      ]
      base.BURST_SCALING = [
        {
          name: 'Lea Lotus Lamp Attack DMG',
          value: [{ scaling: calcScaling(0.8016, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
        {
          name: 'Explosion DMG',
          value: [{ scaling: calcScaling(4.008, burst, 'elemental', '1'), multiplier: Stats.ATK }],
          element: Element.DENDRO,
          property: TalentProperty.BURST,
        },
      ]

      if (form.dmc_a1) {
        base[Stats.EM].push({ value: form.dmc_a1 * 6, name: 'Overflowing Lotuslight', source: 'Self' })
        if (c >= 6) {
          base[Stats.DENDRO_DMG].push({ value: 0.12, name: 'Constellation 6', source: `Traveler` })
        }
        if (form.dmc_c6_transfig) {
          base[Stats[`${form.dmc_c6_transfig.toUpperCase()}_DMG`]].push({
            value: 0.12,
            name: 'Constellation 6',
            source: `Self`,
          })
        }
      }

      return base
    },
    preComputeShared: (own: StatsObject, base: StatsObject, form: Record<string, any>, aForm: Record<string, any>) => {
      if (aForm.dmc_a1) {
        base[Stats.EM].push({ value: form.dmc_a1 * 6, name: 'Overflowing Lotuslight', source: 'Traveler' })
        if (c >= 6) {
          base[Stats.DENDRO_DMG].push({ value: 0.12, name: 'Constellation 6', source: `Traveler` })
        }
        if (form.dmc_c6_transfig) {
          base[Stats[`${form.dmc_c6_transfig.toUpperCase()}_DMG`]].push({
            value: 0.12,
            name: 'Constellation 6',
            source: `Traveler`,
          })
        }
      }

      return base
    },
    postCompute: (base: StatsObject, form: Record<string, any>) => {
      if (a >= 4) {
        base.CALLBACK.push(function P99(x) {
          x.SKILL_DMG.push({
            value: 0.0015 * x.getEM(),
            name: 'Ascension 4 Passive',
            source: `Self`,
            base: x.getEM(),
            multiplier: toPercentage(0.0015, 2),
          })
          x.BURST_DMG.push({
            value: 0.001 * x.getEM(),
            name: 'Ascension 4 Passive',
            source: `Self`,
            base: x.getEM(),
            multiplier: toPercentage(0.001, 2),
          })

          return x
        })
      }

      return base
    },
  }
}

export default TravelerGrass
