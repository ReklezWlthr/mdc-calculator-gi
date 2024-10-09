import { StatsObject } from '../../baseConstant'
import { calcRefinement } from '../../../../../core/utils/data_format'
import { Element, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import _ from 'lodash'
import { findCharacter } from '@src/core/utils/finder'
import { toPercentage } from '@src/core/utils/converter'

const WeaponBonus: {
  id: string
  scaling: (base: StatsObject, refinement: number, team?: ITeamChar[]) => StatsObject
}[] = [
  {
    id: '15502',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Amos' Bow` })
      base.CHARGE_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Amos' Bow` })
      return base
    },
  },
  {
    id: '15508',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Aqua Simulacra` })
      return base
    },
  },
  {
    id: '11501',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Aquila Favonia` })
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
            self: true,
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
      base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Calamity Queller` })
      return base
    },
  },
  {
    id: '15503',
    scaling: (base, r) => {
      base[Stats.EM].push({ value: calcRefinement(60, 15, r), name: 'Passive', source: `Elegy for the End` })
      return base
    },
  },
  {
    id: '14506',
    scaling: (base, r) => {
      base[Stats.HEAL].push({ value: calcRefinement(0.1, 0.025, r), name: 'Passive', source: `Everlasting Moonglow` })
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_F_DMG.push({
          value: calcRefinement(0.01, 0.005, r) * base.getHP(),
          name: 'Passive',
          source: `Everlasting Moonglow`,
          base: base.getHP(),
          multiplier: toPercentage(calcRefinement(0.01, 0.005, r)),
        })
        return base
      })
      return base
    },
  },
  {
    id: '11503',
    scaling: (base, r) => {
      base[Stats.ALL_DMG].push({ value: calcRefinement(0.1, 0.025, r), name: 'Passive', source: `Freedom-Sworn` })
      return base
    },
  },
  {
    id: '11510',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({
        value: calcRefinement(0.12, 0.03, r),
        name: 'Passive',
        source: `Haran Geppaku Futsu`,
      })
      return base
    },
  },
  {
    id: '15511',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Hunter's Path` })
      return base
    },
  },
  {
    id: '11511',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Key of Khaj-Nisut` })
      return base
    },
  },
  {
    id: '11512',
    scaling: (base, r) => {
      base[Stats.CRIT_RATE].push({
        value: calcRefinement(0.04, 0.01, r),
        name: 'Passive',
        source: `Light of Foliar Incision`,
      })
      return base
    },
  },
  {
    id: '14504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Memory of Dust` })
      return base
    },
  },
  {
    id: '11509',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({
        value: calcRefinement(0.12, 0.03, r),
        name: 'Passive',
        source: `Mistsplitter Reforged`,
      })
      return base
    },
  },
  {
    id: '15507',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Polar Star` })
      base.BURST_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Polar Star` })
      return base
    },
  },
  {
    id: '11505',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Primordial Jade Cutter` })
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK].push({
          value: calcRefinement(0.012, 0.003, r) * base.getHP(),
          name: 'Passive',
          source: `Primordial Jade Cutter`,
          base: base.getHP(),
          multiplier: toPercentage(calcRefinement(0.012, 0.003, r)),
        })
        return base
      })
      return base
    },
  },
  {
    id: '12510',
    scaling: (base, r) => {
      base[Stats.P_DEF].push({ value: calcRefinement(0.27, 0.08, r), name: 'Passive', source: `Redhorn Stonethresher` })
      base.CALLBACK.push((base: StatsObject) => {
        base.BASIC_F_DMG.push({
          value: calcRefinement(0.4, 0.1, r) * base.getDef(),
          name: 'Passive',
          source: `Redhorn Stonethresher`,
          base: base.getDef(),
          multiplier: toPercentage(calcRefinement(0.4, 0.1, r)),
        })
        base.CHARGE_F_DMG.push({
          value: calcRefinement(0.4, 0.1, r) * base.getDef(),
          name: 'Passive',
          source: `Redhorn Stonethresher`,
          base: base.getDef(),
          multiplier: toPercentage(calcRefinement(0.4, 0.1, r)),
        })
        return base
      })
      return base
    },
  },
  {
    id: '14501',
    scaling: (base, r) => {
      base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Skyward Atlas` })
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
      base[Stats.CRIT_RATE].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `Skyward Blade` })
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
      base[Stats.CRIT_DMG].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Skyward Harp` })
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
      base[Stats.ALL_DMG].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `Skyward Pride` })
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
      base[Stats.CRIT_RATE].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `Skyward Spine` })
      base.ATK_SPD.push({ value: 0.12, name: 'Passive', source: `Skyward Spine` })
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
      base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Song of Broken Pines` })
      return base
    },
  },
  {
    id: '13501',
    scaling: (base, r) => {
      base[Stats.P_HP].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Staff of Homa` })
      base.CALLBACK.push((base: StatsObject) => {
        base[Stats.ATK].push({
          value: calcRefinement(0.008, 0.002, r) * base.getHP(),
          name: 'Passive',
          source: `Staff of Homa`,
          base: base.getHP(),
          multiplier: calcRefinement(0.008, 0.002, r),
        })
        return base
      })
      return base
    },
  },
  {
    id: '13509',
    scaling: (base, r) => {
      base.CALLBACK.push((base: StatsObject) => {
        const mult = calcRefinement(0.28, 0.07, r)
        const cap = calcRefinement(0.8, 0.1, r)
        base[Stats.P_ATK].push({
          value: _.min([mult * (base.getValue(Stats.ER) - 1), cap]),
          name: 'Passive',
          source: `Engulfing Lightning`,
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
        base[Stats.ATK].push({
          value: calcRefinement(0.52, 0.13, r) * base.getEM(),
          name: 'Passive',
          source: `Staff of the Scarlet Sands`,
          base: base.getEM(),
          multiplier: toPercentage(calcRefinement(0.52, 0.13, r)),
        })
        return base
      })
      return base
    },
  },
  {
    id: '11504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Summit Shaper` })
      return base
    },
  },
  {
    id: '15512',
    scaling: (base, r, team) => {
      base.CHARGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `The First Great Magic` })
      const count =
        _.filter(
          _.map(team, (item) => findCharacter(item.cId)?.element),
          (item) => item === base.ELEMENT
        ).length - 1
      if (count === 1)
        base[Stats.P_ATK].push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Gimmick',
          source: `The First Great Magic`,
        })
      if (count === 2)
        base[Stats.P_ATK].push({
          value: calcRefinement(0.32, 0.08, r),
          name: 'Gimmick',
          source: `The First Great Magic`,
        })
      if (count === 3)
        base[Stats.P_ATK].push({
          value: calcRefinement(0.48, 0.12, r),
          name: 'Gimmick',
          source: `The First Great Magic`,
        })
      return base
    },
  },
  {
    id: '12504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `The Unforged` })
      return base
    },
  },
  {
    id: '15509',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Thundering Pulse` })
      return base
    },
  },
  {
    id: '14514',
    scaling: (base, r) => {
      base[Stats.P_HP].push({
        value: calcRefinement(0.16, 0.04, r),
        name: 'Passive',
        source: `Tome of the Eternal Flow`,
      })
      return base
    },
  },
  {
    id: '14512',
    scaling: (base, r) => {
      base.ATK_SPD.push({ value: calcRefinement(0.1, 0.025, r), name: 'Passive', source: `Tulaytullah's Remembrance` })
      return base
    },
  },
  {
    id: '11514',
    scaling: (base, r) => {
      base[Stats.P_DEF].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Uraku Misugiri` })
      base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Uraku Misugiri` })
      base.SKILL_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `Uraku Misugiri` })
      return base
    },
  },
  {
    id: '12512',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Verdict` })
      return base
    },
  },
  {
    id: '13504',
    scaling: (base, r) => {
      base[Stats.SHIELD].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Vortex Vanquisher` })
      return base
    },
  },
  {
    id: '12502',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Wolf's Gravestone` })
      return base
    },
  },
  {
    id: '12426',
    scaling: (base, r) => {
      base[Stats.P_ATK].push({
        value: calcRefinement(0.12, 0.03, r),
        name: 'Passive',
        source: `"Ultimate Overlord's Mega Magic Sword"`,
      })
      return base
    },
  },
  {
    id: '13301',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `White Tassel` })
      return base
    },
  },
  {
    id: '11424',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Wolf-Fang` })
      base.BURST_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Wolf-Fang` })
      return base
    },
  },
  {
    id: '15402',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `The Stringless` })
      base.BURST_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `The Stringless` })
      return base
    },
  },
  {
    id: '11409',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `The Black Sword` })
      base.CHARGE_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `The Black Sword` })
      return base
    },
  },
  {
    id: '15405',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: 'Passive', source: `Rust` })
      base.CHARGE_DMG.push({ value: -0.1, name: 'Passive', source: `Rust` })
      return base
    },
  },
  {
    id: '12412',
    scaling: (base, r) => {
      base.BURST_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Luxurious Sea-Lord` })
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
    id: '12416',
    scaling: (base, r, team) => {
      const totalEnergy = _.sumBy(team, (item) => findCharacter(item.cId)?.stat?.energy || 0)
      base.BURST_DMG.push({
        value: _.min([calcRefinement(0.0012, 0.0003, r) * totalEnergy, calcRefinement(0.4, 0.02, r)]),
        name: 'Passive',
        source: `Akuoumaru`,
        base: _.min([totalEnergy, 4 / 0.012]),
        multiplier: toPercentage(calcRefinement(0.0012, 0.0003, r), 2),
      })
      return base
    },
  },
  {
    id: '13416',
    scaling: (base, r, team) => {
      const totalEnergy = _.sumBy(team, (item) => findCharacter(item.cId)?.stat?.energy || 0)
      base.BURST_DMG.push({
        value: _.min([calcRefinement(0.0012, 0.0003, r) * totalEnergy, calcRefinement(0.4, 0.02, r)]),
        name: 'Passive',
        source: `Wavebreaker's Fin`,
        base: _.min([totalEnergy, 4 / 0.012]),
        multiplier: toPercentage(calcRefinement(0.0012, 0.0003, r), 2),
      })
      return base
    },
  },
  {
    id: '15416',
    scaling: (base, r, team) => {
      const totalEnergy = _.sumBy(team, (item) => findCharacter(item.cId)?.stat?.energy || 0)
      base.BURST_DMG.push({
        value: _.min([calcRefinement(0.0012, 0.0003, r) * totalEnergy, calcRefinement(0.4, 0.02, r)]),
        name: 'Passive',
        source: `Mouun's Moon`,
        base: _.min([totalEnergy, 4 / 0.012]),
        multiplier: toPercentage(calcRefinement(0.0012, 0.0003, r), 2),
      })
      return base
    },
  },
  {
    id: '13414',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `Kitain Cross Spear` })
      return base
    },
  },
  {
    id: '12414',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `Katsuragikiri Nagamasa` })
      return base
    },
  },
  {
    id: '15414',
    scaling: (base, r) => {
      base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Hamayumi` })
      base.CHARGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Hamayumi` })
      return base
    },
  },
  {
    id: '11426',
    scaling: (base, r) => {
      base.SKILL_CR.push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `Fleuve Cendre Ferryman` })
      return base
    },
  },
  {
    id: '11413',
    scaling: (base, r) => {
      base.SKILL_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Festering Desire` })
      base.SKILL_CR.push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `Festering Desire` })
      return base
    },
  },
  {
    id: '13415',
    scaling: (base, r) => {
      base.BURST_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: 'Passive', source: `"The Catch"` })
      base.BURST_CR.push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `"The Catch"` })
      return base
    },
  },
  {
    id: '13419',
    scaling: (base, r, team) => {
      const count = _.uniq(_.map(team, (item) => findCharacter(item.cId)?.element)).length
      if (count >= 3)
        base[Stats.EM].push({ value: calcRefinement(120, 20, r), name: 'Passive', source: `Ballad of the Fjords` })
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
          self: true,
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
          self: true,
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
          self: true,
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
          self: true,
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
      base.CALLBACK.push(function N100(x, a) {
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
  {
    id: '15514',
    scaling: (base, r, team) => {
      const count = _.filter(team, (item) => findCharacter(item.cId)?.element !== base.ELEMENT).length
      if (count === 1) {
        base.CHARGE_DMG.push({
          value: calcRefinement(0.2, 0.05, r),
          name: 'Passive',
          source: `Astral Vulture's Crimson Plumage`,
        })
        base.BURST_DMG.push({
          value: calcRefinement(0.1, 0.025, r),
          name: 'Passive',
          source: `Astral Vulture's Crimson Plumage`,
        })
      }
      if (count >= 2) {
        base.CHARGE_DMG.push({
          value: calcRefinement(0.48, 0.12, r),
          name: 'Passive',
          source: `Astral Vulture's Crimson Plumage`,
        })
        base.BURST_DMG.push({
          value: calcRefinement(0.24, 0.06, r),
          name: 'Passive',
          source: `Astral Vulture's Crimson Plumage`,
        })
      }
      return base
    },
  },
]

export default WeaponBonus
