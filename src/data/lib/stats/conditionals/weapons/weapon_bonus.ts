import { StatsObject } from '../../baseConstant'
import { calcRefinement } from '../../../../../core/utils/data_format'
import { Element, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import _ from 'lodash'
import { findCharacter } from '@src/core/utils/finder'

const WeaponBonus: {
  id: string
  scaling: (base: StatsObject, refinement: number, team?: ITeamChar[]) => StatsObject
}[] = [
  {
    id: '15502',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      base.CHARGE_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15508',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11501',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
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
      base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15503',
    scaling: (base, r) => {
      base[Stats.EM].push({ value: calcRefinement(60, 15, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '14506',
    scaling: (base, r) => {
      base[Stats.HEAL].push({ value: calcRefinement(0.1, 0.025, r), name: '', source: `` })
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_F_DMG.push({ value: calcRefinement(0.01, 0.005, r), name: '', source: `` }) * base.getHP()
        return base
      })
      return base
    },
  },
  {
    id: '11503',
    scaling: (base, r) => {
      base[Stats.ALL_DMG].push({ value: calcRefinement(0.1, 0.025, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11510',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15511',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11511',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11512',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE].push({ value: calcRefinement(0.04, 0.01, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '14504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15507',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      base.BURST_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11505',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK].push({ value: calcRefinement(0.012, 0.003, r), name: '', source: `` }) * base.getHP()
        return base
      })
      return base
    },
  },
  {
    id: '12510',
    scaling: (base, r) => {
      base[Stats.P_DEF].push({ value: calcRefinement(0.27, 0.08, r), name: '', source: `` })
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_F_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: '', source: `` }) * base.getDef()
        base.CHARGE_F_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: '', source: `` }) * base.getDef()
        return base
      })
      return base
    },
  },
  {
    id: '14501',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
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
      base[Stats.CRIT_RATE].push({ value: calcRefinement(0.04, 0.01, r), name: '', source: `` })
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
      base[Stats.CRIT_DMG].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
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
      base[Stats.ALL_DMG].push({ value: calcRefinement(0.08, 0.02, r), name: '', source: `` })
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
      base[Stats.CRIT_RATE].push({ value: calcRefinement(0.08, 0.02, r), name: '', source: `` })
      base.ATK_SPD.push({ value: 0.12, name: '', source: `` })
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
      base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '13501',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK].push({ value: calcRefinement(0.008, 0.002, r), name: '', source: `` }) * base.getHP()
        return base
      })
      return base
    },
  },
  {
    id: '13508',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK].push({
          value: _.min([calcRefinement(0.28, 0.07, r) * (base.getValue(Stats.ER) - 1), calcRefinement(0.8, 0.1, r)]),
          name: '',
          source: ``,
        })
        return base
      })
      return base
    },
  },
  {
    id: '13511',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK].push({ value: calcRefinement(0.52, 0.13, r), name: '', source: `` }) * base.getEM()
        return base
      })
      return base
    },
  },
  {
    id: '11504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15512',
    scaling: (base, r) => {
      base.CHARGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '12504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15509',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '14514',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '14512',
    scaling: (base, r) => {
      base.ATK_SPD.push({ value: calcRefinement(0.1, 0.025, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11514',
    scaling: (base, r) => {
      base[Stats.P_DEF].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      base.SKILL_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '12512',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '13504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '12502',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '12426',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `"Ultimate Overlord's Mega Magic Sword"` })
      return base
    },
  },
  {
    id: '13301',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11424',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      base.BURST_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15402',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: '', source: `` })
      base.BURST_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11409',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      base.CHARGE_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15405',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: '', source: `` })
      base.CHARGE_DMG.push({ value: -0.1, name: '', source: `` })
      return base
    },
  },
  {
    id: '12412',
    scaling: (base, r) => {
      base.BURST_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: '', source: `` })
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
      base.SKILL_DMG.push({ value: calcRefinement(0.06, 0.015, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '12414',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.06, 0.015, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '15414',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      base.CHARGE_DMG.push({ value: -calcRefinement(0.16, 0.04, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11426',
    scaling: (base, r) => {
      base.SKILL_CR.push({ value: calcRefinement(0.08, 0.02, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11413',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: '', source: `` })
      base.SKILL_CR.push({ value: calcRefinement(0.06, 0.015, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '13415',
    scaling: (base, r) => {
      base.BURST_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: '', source: `` })
      base.BURST_CR.push({ value: calcRefinement(0.06, 0.015, r), name: '', source: `` })
      return base
    },
  },
  {
    id: '11515',
    scaling: (base, r) => {
      base[Stats.CRIT_DMG].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Absolution` })
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
  {
    id: '14516',
    scaling: (base, r) => {
      base[Stats.P_HP].push({
        value: calcRefinement(0.2, 0.05, r),
        name: 'Passive',
        source: `Surf's Up`,
      })
      return base
    },
  },
  {
    id: '13513',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({
        value: calcRefinement(0.15, 0.04, r),
        name: 'Passive',
        source: `Lumidouce Elegy`,
      })
      return base
    },
  },
  {
    id: '15431',
    scaling: (base, r, team) => {
      const count = _.filter(team, (item) => {
        const c = findCharacter(item.cId)
        return c?.region === 'Natlan' || (c?.element !== base.ELEMENT && c?.name !== base.NAME)
      }).length
      base[Stats.P_ATK].push({
        value: calcRefinement(0.048, 0.012, r) * count,
        name: 'Passive',
        source: `Chain Breaker`,
      })
      if (count >= 3)
        base[Stats.EM].push({
          value: calcRefinement(24, 6, r),
          name: 'Passive',
          source: `Chain Breaker`,
        })
      return base
    },
  },
  {
    id: '12410',
    scaling: (base, r, team) => {
      const count = _.filter(
        _.map(team, (item) => findCharacter(item.cId)?.region),
        (item) => item === 'Liyue'
      ).length
      base[Stats.P_ATK].push({
        value: count * calcRefinement(0.07, 0.01, r),
        name: 'Passive',
        source: `Lithic Blade`,
      })
      base[Stats.CRIT_RATE].push({
        value: count * calcRefinement(0.03, 0.01, r),
        name: 'Passive',
        source: `Lithic Blade`,
      })
      return base
    },
  },
  {
    id: '13406',
    scaling: (base, r, team) => {
      const count = _.filter(
        _.map(team, (item) => findCharacter(item.cId)?.region),
        (item) => item === 'Liyue'
      ).length
      base[Stats.P_ATK].push({
        value: count * calcRefinement(0.07, 0.01, r),
        name: 'Passive',
        source: `Lithic Spear`,
      })
      base[Stats.CRIT_RATE].push({
        value: count * calcRefinement(0.03, 0.01, r),
        name: 'Passive',
        source: `Lithic Spear`,
      })
      return base
    },
  },
  {
    id: '14427',
    scaling: (base, r) => {
      base.CALLBACK.push((x) => {
        x.SKILL_SCALING.push({
          name: `Ash-Graven Drinking Horn DMG`,
          value: [{ scaling: calcRefinement(0.4, 0.1, r), multiplier: Stats.HP }],
          element: Element.PHYSICAL,
          property: TalentProperty.ADD,
        })
        return x
      })
      return base
    },
  },
  {
    id: '13430',
    scaling: (base, r) => {
      base.SKILL_DMG.push({
        value: calcRefinement(0.12, 0.03, r),
        name: 'Passive',
        source: `Mountain-Bracing Bolt`,
      })
      return base
    },
  },
  {
    id: '12430',
    scaling: (base, r) => {
      base.PLUNGE_CR.push({
        value: calcRefinement(0.16, 0.04, r),
        name: 'Passive',
        source: `Fruitful Hook`,
      })
      return base
    },
  },
  {
    id: '14511',
    scaling: (base, r, team) => {
      base.CALLBACK.push(function (x, a) {
        _.forEach(a, (member) => {
          if (member.NAME === base.NAME) {
            const elements = _.map(team, (item) => findCharacter(item.cId)?.element)
            const same = _.filter(elements, (item) => item === base.ELEMENT).length - 1
            const diff = _.filter(elements, (item) => !!item && item !== base.ELEMENT).length

            member[Stats.EM].push({
              value: calcRefinement(32, 8, r) * same,
              name: 'Passive',
              source: `A Thousand Floating Dreams`,
            })
            member[Stats[`${base.ELEMENT.toUpperCase()}_DMG`]].push({
              value: calcRefinement(0.1, 0.04, r) * diff,
              name: 'Passive',
              source: `A Thousand Floating Dreams`,
            })
          } else {
            member[Stats.EM].push({
              value: calcRefinement(40, 2, r),
              name: 'A Thousand Floating Dreams',
              source: base.NAME,
            })
          }
        })
        return x
      })
      return base
    },
  },
]

export default WeaponBonus
