import { StatsObject } from '../../baseConstant'
import { calcRefinement } from '../../../../../core/utils/data_format'
import { Element, Stats, TalentProperty } from '@src/domain/constant'
import _ from 'lodash'

const WeaponBonus: { id: string; scaling: (base: StatsObject, refinement: number) => StatsObject }[] = [
  {
    id: '15502',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.12, 0.03, r)
      base.CHARGE_DMG += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15508',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '11501',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push(
          {
            name: `Falcon's Defiance DMG`,
            value: [{ scaling: calcRefinement(1, 0.15, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          },
          {
            name: `Falcon's Defiance Healing`,
            value: [{ scaling: calcRefinement(2, 0.3, r), multiplier: Stats.ATK }],
            element: TalentProperty.HEAL,
            property: TalentProperty.HEAL,
          }
        )
        return base
      })
      return base
    },
  },
  {
    id: '13507',
    scaling: (base, r) => {
      base[Stats.ALL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15503',
    scaling: (base, r) => {
      base[Stats.EM] += calcRefinement(60, 15, r)
      return base
    },
  },
  {
    id: '14506',
    scaling: (base, r) => {
      base[Stats.HEAL] += calcRefinement(0.1, 0.025, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_F_DMG += calcRefinement(0.01, 0.005, r) * base.getHP()
        return base
      })
      return base
    },
  },
  {
    id: '11503',
    scaling: (base, r) => {
      base[Stats.ALL_DMG] += calcRefinement(0.1, 0.025, r)
      return base
    },
  },
  {
    id: '11510',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15511',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '11511',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '11512',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE] += calcRefinement(0.04, 0.01, r)
      return base
    },
  },
  {
    id: '14504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '15507',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.12, 0.03, r)
      base.BURST_DMG += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '11505',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.2, 0.05, r)
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK] += calcRefinement(0.012, 0.003, r) * base.getHP()
        return base
      })
      return base
    },
  },
  {
    id: '12510',
    scaling: (base, r) => {
      base[Stats.P_DEF] += calcRefinement(0.27, 0.08, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_F_DMG += calcRefinement(0.4, 0.1, r) * base.getDef()
        base.CHARGE_F_DMG += calcRefinement(0.4, 0.1, r) * base.getDef()
        return base
      })
      return base
    },
  },
  {
    id: '14501',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.12, 0.03, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Wandering Clouds DMG`,
          value: [{ scaling: calcRefinement(1.6, 0.4, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '11502',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE] += calcRefinement(0.04, 0.01, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Skypiercing Might DMG`,
          value: [{ scaling: calcRefinement(0.2, 0.05, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '15501',
    scaling: (base, r) => {
      base[Stats.CRIT_DMG] += calcRefinement(0.2, 0.05, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Echoing Ballad DMG`,
          value: [{ scaling: 1.25, multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '12501',
    scaling: (base, r) => {
      base[Stats.ALL_DMG] += calcRefinement(0.08, 0.02, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Vacuum Blade DMG`,
          value: [{ scaling: calcRefinement(0.8, 0.2, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '13502',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE] += calcRefinement(0.08, 0.02, r)
      base.ATK_SPD += 0.12
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Vacuum Blade DMG`,
          value: [{ scaling: calcRefinement(0.4, 0.15, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '12503',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '13501',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.2, 0.05, r)
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK] += calcRefinement(0.008, 0.002, r) * base.getAtk()
        return base
      })
      return base
    },
  },
  {
    id: '13508',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK] += _.min([calcRefinement(0.28, 0.07, r) * (base[Stats.ER] - 1), calcRefinement(0.8, 0.1, r)])
        return base
      })
      return base
    },
  },
  {
    id: '13511',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK] += calcRefinement(0.52, 0.13, r) * base[Stats.EM]
        return base
      })
      return base
    },
  },
  {
    id: '11504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15512',
    scaling: (base, r) => {
      base.CHARGE_DMG += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '12504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15509',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '14514',
    scaling: (base, r) => {
      base[Stats.P_HP] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '14512',
    scaling: (base, r) => {
      base.ATK_SPD += calcRefinement(0.1, 0.025, r)
      return base
    },
  },
  {
    id: '11514',
    scaling: (base, r) => {
      base[Stats.P_DEF] += calcRefinement(0.2, 0.05, r)
      base.BASIC_DMG += calcRefinement(0.16, 0.04, r)
      base.SKILL_DMG += calcRefinement(0.24, 0.06, r)
      return base
    },
  },
  {
    id: '12512',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '13504',
    scaling: (base, r) => {
      base[Stats.SHIELD] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '12502',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '12426',
    scaling: (base, r) => {
      base[Stats.P_ATK] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    id: '13301',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.24, 0.06, r)
      return base
    },
  },
  {
    id: '11424',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.16, 0.04, r)
      base.BURST_DMG += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '15402',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.24, 0.06, r)
      base.BURST_DMG += calcRefinement(0.24, 0.06, r)
      return base
    },
  },
  {
    id: '11409',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.2, 0.05, r)
      base.CHARGE_DMG += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15405',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.4, 0.1, r)
      base.CHARGE_DMG -= 0.1
      return base
    },
  },
  {
    id: '12412',
    scaling: (base, r) => {
      base.BURST_DMG += calcRefinement(0.12, 0.03, r)
      base.CALLBACK.push((base: StatsObject) => {
        base.BURST_SCALING.push({
          name: `Tuna DMG`,
          value: [{ scaling: calcRefinement(1, 0.25, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '13414',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '12414',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '15414',
    scaling: (base, r) => {
      base.BASIC_DMG += calcRefinement(0.16, 0.04, r)
      base.CHARGE_DMG -= calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    id: '11426',
    scaling: (base, r) => {
      base.SKILL_CR += calcRefinement(0.08, 0.02, r)
      return base
    },
  },
  {
    id: '11413',
    scaling: (base, r) => {
      base.SKILL_DMG += calcRefinement(0.16, 0.04, r)
      base.SKILL_CR += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '13415',
    scaling: (base, r) => {
      base.BURST_DMG += calcRefinement(0.4, 0.1, r)
      base.BURST_CR += calcRefinement(0.06, 0.015, r)
      return base
    },
  },
  {
    id: '11515',
    scaling: (base, r) => {
      base[Stats.CRIT_DMG] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    id: '15424',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.CHARGE_SCALING.push({
          name: `Sunfire Arrow DMG`,
          value: [{ scaling: calcRefinement(0.6, 0.15, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '13403',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Infusion Needle DMG`,
          value: [{ scaling: calcRefinement(0.2, 0.05, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '13409',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push(
          {
            name: `Everfrost Icicle DMG`,
            value: [{ scaling: calcRefinement(0.8, 0.15, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          },
          {
            name: `Enhanced Everfrost Icicle DMG`,
            value: [{ scaling: calcRefinement(2, 0.4, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          }
        )
        return base
      })
      return base
    },
  },
  {
    id: '14412',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push(
          {
            name: `Everfrost Icicle DMG`,
            value: [{ scaling: calcRefinement(0.8, 0.15, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          },
          {
            name: `Enhanced Everfrost Icicle DMG`,
            value: [{ scaling: calcRefinement(2, 0.4, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          }
        )
        return base
      })
      return base
    },
  },
  {
    id: '12411',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push(
          {
            name: `Everfrost Icicle DMG`,
            value: [{ scaling: calcRefinement(0.8, 0.15, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          },
          {
            name: `Enhanced Everfrost Icicle DMG`,
            value: [{ scaling: calcRefinement(2, 0.4, r), multiplier: Stats.ATK }],
            element: Element.PHYSICAL,
            property: TalentProperty.ADD,
          }
        )
        return base
      })
      return base
    },
  },
  {
    id: '15418',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Flowrider DMG`,
          value: [{ scaling: calcRefinement(0.8, 0.2, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '14409',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Bolt of Perception DMG`,
          value: [{ scaling: calcRefinement(2.4, 0.3, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '11416',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Hewing Gale DMG`,
          value: [{ scaling: 1.8, multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '15417',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push({
          name: `Teachings of the Forest DMG`,
          value: [{ scaling: calcRefinement(1, 0.2, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '12406',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Crush DMG`,
          value: [{ scaling: calcRefinement(2.4, 0.6, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '11428',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Arkhe Blast DMG`,
          value: [{ scaling: calcRefinement(1.6, 0.4, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '12402',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push({
          name: `Hit Auto Shield Absorption`,
          value: [{ scaling: calcRefinement(0.2, 0.03, r), multiplier: Stats.HP }],
          element: TalentProperty.SHIELD,
          property: TalentProperty.SHIELD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '11402',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Harmonics DMG`,
          value: [{ scaling: calcRefinement(1, 0.25, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '15409',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Cyclone DMG`,
          value: [{ scaling: calcRefinement(0.4, 0.1, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '12305',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Blunt Conclusion DMG`,
          value: [{ scaling: calcRefinement(0.6, 0.15, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '11305',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Gash DMG`,
          value: [{ scaling: calcRefinement(2.4, 0.4, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '13302',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_SCALING.push({
          name: `Halberd DMG`,
          value: [{ scaling: calcRefinement(1.6, 0.4, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return base
      })
      return base
    },
  },
  {
    id: '15305',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.CHARGE_SCALING.push({
          name: `Weakspot CRIT DMG`,
          value: [{ scaling: calcRefinement(1, 0.25, r), multiplier: Stats.ATK }],
          element: Element.PHYSICAL,
          property: TalentProperty.CRIT,
        })
        return base
      })
      return base
    },
  },
  {
    id: '14303',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push({
          name: `Particle Healing`,
          value: [{ scaling: calcRefinement(0.01, 0.0025, r), multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
        return base
      })
      return base
    },
  },
  {
    id: '15303',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push({
          name: `On-Kill Healing`,
          value: [{ scaling: calcRefinement(0.08, 0.02, r), multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
        return base
      })
      return base
    },
  },
  {
    id: '11303',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push({
          name: `Particle Healing`,
          value: [{ scaling: calcRefinement(0.01, 0.0025, r), multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
        return base
      })
      return base
    },
  },
  {
    id: '12303',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base.SKILL_SCALING.push({
          name: `On-Kill Healing`,
          value: [{ scaling: calcRefinement(0.08, 0.02, r), multiplier: Stats.HP }],
          element: TalentProperty.HEAL,
          property: TalentProperty.HEAL,
        })
        return base
      })
      return base
    },
  },
]

export default WeaponBonus
