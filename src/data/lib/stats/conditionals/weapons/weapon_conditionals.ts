import { calcRefinement } from '@src/core/utils/data_format'
import { checkBuffExist, findCharacter, findContentById } from '@src/core/utils/finder'
import { IWeaponContent } from '@src/domain/conditional'
import { Element, Stats } from '@src/domain/constant'
import _ from 'lodash'
import { StatsObject } from '../../baseConstant'
import { toPercentage } from '@src/core/utils/converter'

export const WeaponConditionals: IWeaponContent[] = [
  {
    type: 'number',
    text: `Seconds the Shot Is Airborne`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '15502',
    scaling: (base, form, r) => {
      if (form['15502']) {
        base.BASIC_DMG.push({
          value: form['15502'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: `Amos' Bow`,
        })
        base.CHARGE_DMG.push({
          value: form['15502'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: `Amos' Bow`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Cool Steel`,
    show: true,
    default: true,
    id: '11301',
    scaling: (base, form, r) => {
      if (form['11301'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Cool Steel` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Current HP >= 90%`,
    show: true,
    default: true,
    id: '11302',
    scaling: (base, form, r) => {
      if (form['11302'])
        base[Stats.CRIT_RATE].push({
          value: calcRefinement(0.14, 0.035, r),
          name: 'Passive',
          source: `Harbinger of Dawn`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Electro Reaction ATK Bonus`,
    show: true,
    default: true,
    id: '11304',
    scaling: (base, form, r) => {
      if (form['11304'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Dark Iron Sword` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Burst ATK Buff`,
    show: true,
    default: true,
    id: '11306',
    scaling: (base, form, r) => {
      if (form['11306'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Skyrider Sword` })
      return base
    },
  },
  {
    type: 'number',
    text: `CRIT Rate Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '11404',
    scaling: (base, form, r) => {
      if (form['11404'])
        base[Stats.CRIT_RATE].push({
          value: form['11404'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: 'Royal Longsword',
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bane of Fire and Thunder`,
    show: true,
    default: true,
    id: '11405',
    scaling: (base, form, r) => {
      if (form['11405'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `Lion's Roar` })
      return base
    },
  },
  {
    type: 'number',
    text: `Prototype Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '11406',
    scaling: (base, form, r) => {
      if (form['11406']) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `Prototype Rancour` })
        base[Stats.P_DEF].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `Prototype Rancour` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill Bonus DMG`,
    show: true,
    default: true,
    id: '11415',
    scaling: (base, form, r) => {
      if (form['11415'])
        base.CALLBACK.push(function (x) {
          x.SKILL_F_DMG.push({
            value: x.getDef() * calcRefinement(0.4, 0.1, r),
            name: 'Passive',
            source: 'Cinnabar Spindle',
            base: x.getDef(),
            multiplier: calcRefinement(0.4, 0.1, r),
          })
          return x
        })
      return base
    },
  },
  {
    type: 'number',
    text: `DMG Bonus Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '11407',
    scaling: (base, form, r) => {
      if (form['11407'])
        base[Stats.ALL_DMG].push({
          value: form['11407'] * calcRefinement(0.06, 0.015, r),
          name: 'Passive',
          source: 'Iron Sting',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `On-Kill ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11408',
    scaling: (base, form, r) => {
      if (form['11408'])
        base[Stats.P_ATK].push({
          value: form['11408'] * calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: 'Blackcliff Longsword',
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Active DMG Bonus`,
    show: true,
    default: true,
    id: '11410',
    scaling: (base, form, r) => {
      if (form['11410'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.04, r), name: 'Passive', source: `The Alley Flash` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Hit ATK Bonus`,
    show: true,
    default: true,
    id: '11416',
    scaling: (base, form, r) => {
      if (form['11416']) base[Stats.P_ATK].push({ value: 0.15, name: 'Hewing Gale', source: `Kagotsurube Isshin` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '11417',
    scaling: (base, form, r) => {
      if (form['11417'])
        base[Stats.EM].push({
          value: calcRefinement(60, 15, r),
          name: 'Leaf of Consciousness',
          source: `Sapwood Blade`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Cursed Parasol`,
    show: true,
    default: true,
    id: '11422',
    scaling: (base, form, r) => {
      if (form['11422'])
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Cursed Parasol',
          source: `Toukabou Shigure`,
        })
      return base
    },
    debuff: true,
  },
  {
    type: 'number',
    text: `CRIT Rate Statcks`,
    show: true,
    default: 0,
    min: 0,
    max: 4,
    id: '11424',
    scaling: (base, form, r) => {
      if (form['11424'])
        base[Stats.CRIT_RATE].push({
          value: form['11424'] * calcRefinement(0.02, 0.005, r),
          name: 'Passive',
          source: 'Wolf-Fang',
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill ATK Buff`,
    show: true,
    default: true,
    id: '11425',
    scaling: (base, form, r) => {
      if (form['11425'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Finale of the Deep` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `BoL% Cleared`,
    show: true,
    default: true,
    id: '11425_2',
    scaling: (base, form, r) => {
      if (form['11425'] && form['11425_2'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({
            value: _.min([0.25 * calcRefinement(0.024, 0.006, r) * base.getHP(), calcRefinement(150, 37.5, r)]),
            name: 'Passive',
            source: 'Finale of the Deep',
            base: _.min([base.getHP() * 0.25, 6250]),
            multiplier: calcRefinement(0.024, 0.006, r),
          })
          return base
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill ER Buff`,
    show: true,
    default: true,
    id: '11426',
    scaling: (base, form, r) => {
      if (form['11426'])
        base[Stats.ER].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Fleuve Cendre Ferryman` })
      return base
    },
  },
  {
    type: 'number',
    text: `Stoic Symbols`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11427',
    scaling: (base, form, r) => {
      if (form['11427'])
        base[Stats.EM].push({
          value: calcRefinement(40, 10, r) * form['11427'],
          name: 'Roused',
          source: `The Dockhand's Assistant`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skypiercing Might`,
    show: true,
    default: true,
    id: '11502',
    scaling: (base, form, r) => {
      if (form['11502']) base.ATK_SPD.push({ value: 0.1, name: 'Skypiercing Might', source: `Skyward Blade` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Millennial Movement: Song of Resistance`,
    show: true,
    default: true,
    id: '11503',
    scaling: (base, form, r) => {
      if (form['11503']) {
        base[Stats.P_ATK].push({
          value: calcRefinement(0.2, 0.05, r),
          name: 'Song of Resistance',
          source: `Freedom-Sworn`,
        })
        base.BASIC_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Song of Resistance',
          source: `Freedom-Sworn`,
        })
        base.CHARGE_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Song of Resistance',
          source: `Freedom-Sworn`,
        })
        base.PLUNGE_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Song of Resistance',
          source: `Freedom-Sworn`,
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Bonus ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '11504',
    scaling: (base, form, r) => {
      if (form['11504'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.04, 0.01, r) * form['11504'],
          name: 'Passive',
          source: `Summit Shaper`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Doubled ATK Bonus`,
    show: true,
    default: true,
    id: '11504_2',
    scaling: (base, form, r) => {
      if (form['11504_2'] && form['11504']) {
        const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'Summit Shaper')
        buff.value *= 2
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Mistsplitter's Emblem`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11509',
    scaling: (base, form, r, { element }) => {
      if (form['11509'] === 1)
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.08, 0.02, r),
          name: `Mistsplitter's Emblem`,
          source: `Mistsplitter Reforged`,
        })
      if (form['11509'] === 2)
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Mistsplitter's Emblem`,
          source: `Mistsplitter Reforged`,
        })
      if (form['11509'] === 3)
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.28, 0.07, r),
          name: `Mistsplitter's Emblem`,
          source: `Mistsplitter Reforged`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Wavespike Stack Consumed`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '11510',
    scaling: (base, form, r) => {
      if (form['11510'])
        base.BASIC_DMG.push({
          value: calcRefinement(0.2, 0.05, r) * form['11510'],
          name: 'Rippling Upheaval',
          source: `Haran Geppaku Futsu`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Foliar Incision`,
    show: true,
    default: true,
    id: '11512',
    scaling: (base, form, r) => {
      if (form['11512']) {
        base.CALLBACK.push((base: StatsObject) => {
          base.BASIC_F_DMG.push({
            value: calcRefinement(1.2, 0.3, r) * base.getValue(Stats.EM),
            name: 'Foliar Incision',
            source: `Light of Foliar Incision`,
            base: base.getValue(Stats.EM),
            multiplier: toPercentage(calcRefinement(1.2, 0.3, r)),
          })
          base.SKILL_F_DMG.push({
            value: calcRefinement(1.2, 0.3, r) * base.getValue(Stats.EM),
            name: 'Foliar Incision',
            source: `Light of Foliar Incision`,
            base: base.getValue(Stats.EM),
            multiplier: toPercentage(calcRefinement(1.2, 0.3, r)),
          })
          return base
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Self HP Change Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11513',
    scaling: (base, form, r) => {
      if (form['11513'])
        base.SKILL_DMG.push({
          value: calcRefinement(0.08, 0.02, r) * form['11513'],
          name: 'Passive',
          source: `Splendor of Tranquil Waters`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Ally HP Change Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '11513_2',
    scaling: (base, form, r) => {
      if (form['11513_2'])
        base[Stats.P_HP].push({
          value: calcRefinement(0.14, 0.035, r) * form['11513_2'],
          name: 'Passive',
          source: `Splendor of Tranquil Waters`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Geo DMG Enhanced Passive`,
    show: true,
    default: true,
    id: '11514',
    scaling: (base, form, r) => {
      if (form['11514']) {
        const b1 = _.find(base.BASIC_DMG, (item) => item.source === 'Uraku Misugiri')
        const b2 = _.find(base.SKILL_DMG, (item) => item.source === 'Uraku Misugiri')
        b1.value *= 2
        b2.value *= 2
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Current HP Below Threshold`,
    show: true,
    default: true,
    id: '12301',
    scaling: (base, form, r) => {
      if (form['12301'])
        base.CHARGE_DMG.push({ value: calcRefinement(0.3, 0.05, r), name: 'Passive', source: `Ferrous Shadow` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bane of Fire and Thunder`,
    show: true,
    default: true,
    id: '12302',
    scaling: (base, form, r) => {
      if (form['12302'])
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: `Bloodtainted Greatsword`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Bonus ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 4,
    id: '12306',
    scaling: (base, form, r) => {
      if (form['12306'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.06, 0.01, r) * form['12306'],
          name: 'Passive',
          source: `Skyrider Greatsword`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Shielded Bonus`,
    show: true,
    default: true,
    id: '12402',
    scaling: (base, form, r) => {
      if (form['12402'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `The Bell` })
      return base
    },
  },
  {
    type: 'number',
    text: `CRIT Rate Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '12404',
    scaling: (base, form, r) => {
      if (form['12404'])
        base[Stats.CRIT_RATE].push({
          value: form['11404'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: 'Royal Greatsword',
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bane of Storm and Tide`,
    show: true,
    default: true,
    id: '12405',
    scaling: (base, form, r) => {
      if (form['12405'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `Rainslasher` })
      return base
    },
  },
  {
    type: 'number',
    text: `Whiteblind Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 4,
    id: '12407',
    scaling: (base, form, r) => {
      if (form['12407']) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `Whiteblind` })
        base[Stats.P_DEF].push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `Whiteblind` })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `On-Kill ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '12408',
    scaling: (base, form, r) => {
      if (form['12408'])
        base[Stats.P_ATK].push({
          value: form['12408'] * calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: 'Blackcliff Slasher',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `On-Kill ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '13404',
    scaling: (base, form, r) => {
      if (form['13404'])
        base[Stats.P_ATK].push({
          value: form['13404'] * calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: 'Blackcliff Pole',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `On-Kill ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '14408',
    scaling: (base, form, r) => {
      if (form['14408'])
        base[Stats.P_ATK].push({
          value: form['14408'] * calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: 'Blackcliff Agate',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `On-Kill ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15408',
    scaling: (base, form, r) => {
      if (form['15408'])
        base[Stats.P_ATK].push({
          value: form['15408'] * calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: 'Blackcliff Warbow',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `On-Field Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '12409',
    scaling: (base, form, r) => {
      if (form['12409']) {
        base[Stats.ALL_DMG].push({
          value: form['12409'] * calcRefinement(0.06, 0.01, r),
          name: 'Passive',
          source: 'Serpent Spine',
        })
        base.DMG_REDUCTION.push({
          value: form['12409'] * -calcRefinement(0.03, -0.0025, r),
          name: 'Passive',
          source: 'Serpent Spine',
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '12417',
    scaling: (base, form, r) => {
      if (form['12417'])
        base[Stats.EM].push({
          value: calcRefinement(60, 15, r),
          name: 'Leaf of Consciousness',
          source: `Forest Regalia`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Mailed Flower`,
    show: true,
    default: false,
    id: '12418',
    scaling: (base, form, r) => {
      if (form['12418']) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Mailed Flower` })
        base[Stats.EM].push({ value: calcRefinement(40, 12, r), name: 'Passive', source: `Mailed Flower` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Hit by Pyro`,
    show: true,
    default: false,
    id: '12424',
    scaling: (base, form, r) => {
      if (form['12424'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Talking Stick` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Hit by Hydro/Cryo/Electro/Dendro`,
    show: true,
    default: false,
    id: '12424_2',
    scaling: (base, form, r) => {
      if (form['12424_2'])
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: `Talking Stick`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus ATK On-Healed`,
    show: true,
    default: false,
    id: '12425',
    scaling: (base, form, r) => {
      if (form['12425'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `Tidal Shadow` })
      return base
    },
  },
  {
    type: 'number',
    text: `Melusines Helped!`,
    show: true,
    default: 6,
    min: 0,
    max: 6,
    id: '12426',
    scaling: (base, form, r) => {
      if (form['12426']) {
        const buff = _.find(base[Stats.P_ATK], (item) => item.source === `"Ultimate Overlord's Mega Magic Sword"`)
        buff.value += calcRefinement(0.02, 0.005, r) * form['12426']
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Stoic Symbols`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '12427',
    scaling: (base, form, r) => {
      if (form['12427'])
        base[Stats.EM].push({
          value: calcRefinement(40, 10, r) * form['12427'],
          name: 'Roused',
          source: `Portable Power Saw`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Bonus ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '12504',
    scaling: (base, form, r) => {
      if (form['12504'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.04, 0.01, r) * form['12504'],
          name: 'Passive',
          source: `The Unforged`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Doubled ATK Bonus`,
    show: true,
    default: true,
    id: '12504_2',
    scaling: (base, form, r) => {
      if (form['12504_2'] && form['12504']) {
        const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'The Unforged')
        buff.value *= 2
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill Hit Bonus`,
    show: true,
    default: false,
    id: '12511',
    scaling: (base, form, r) => {
      if (form['12511']) {
        if (form['12511_2']) {
          const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'Beacon of the Reed Sea')
          buff.value += calcRefinement(0.2, 0.05, r)
        } else {
          base[Stats.P_ATK].push({
            value: calcRefinement(0.2, 0.05, r),
            name: 'Passive',
            source: `Beacon of the Reed Sea`,
          })
        }
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Take DMG Bonus`,
    show: true,
    default: false,
    id: '12511_2',
    scaling: (base, form, r) => {
      if (form['12511_2']) {
        if (form['12511']) {
          const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'Beacon of the Reed Sea')
          buff.value += calcRefinement(0.2, 0.05, r)
        } else {
          base[Stats.P_ATK].push({
            value: calcRefinement(0.2, 0.05, r),
            name: 'Passive',
            source: `Beacon of the Reed Sea`,
          })
        }
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Shieldless HP Bonus`,
    show: true,
    default: false,
    id: '12511_3',
    scaling: (base, form, r) => {
      if (form['12511_3'])
        base[Stats.P_HP].push({
          value: calcRefinement(0.32, 0.08, r),
          name: 'Passive',
          source: `Beacon of the Reed Sea`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Seal Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '12512',
    scaling: (base, form, r) => {
      if (form['12512'])
        base.SKILL_DMG.push({ value: calcRefinement(0.18, 0.045, r) * form['12512'], name: 'Seal', source: `Verdict` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Slime Bonus DMG`,
    show: true,
    default: false,
    id: '13303',
    scaling: (base, form, r) => {
      if (form['13303'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.4, 0.2, r), name: 'Passive', source: `Black Tassel` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bane of Flame and Water`,
    show: true,
    default: false,
    id: '13401',
    scaling: (base, form, r) => {
      if (form['13401'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `Dragon's Bane` })
      return base
    },
  },
  {
    type: 'number',
    text: `Prototype Skill Buff`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '13402',
    scaling: (base, form, r) => {
      if (form['13402']) {
        base.CHARGE_DMG.push({
          value: calcRefinement(0.08, 0.02, r) * form['13402'],
          name: 'Passive',
          source: `Prototype Starglitter`,
        })
        base.BASIC_DMG.push({
          value: calcRefinement(0.08, 0.02, r) * form['13402'],
          name: 'Passive',
          source: `Prototype Starglitter`,
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `CRIT Rate Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '13408',
    scaling: (base, form, r) => {
      if (form['13408'])
        base[Stats.CRIT_RATE].push({
          value: form['11404'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: 'Royal Spear',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Nearby Opponents Count`,
    show: true,
    default: 0,
    min: 0,
    id: '13405',
    scaling: (base, form, r) => {
      if (form['13405'] >= 2) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Deathmatch` })
        base[Stats.P_DEF].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Deathmatch` })
      }
      if (form['13405'] < 2)
        base[Stats.P_ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `Deathmatch` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Revival`,
    show: true,
    default: false,
    id: '13417',
    scaling: (base, form, r) => {
      if (form['13417'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Leaf of Revival', source: `Moonpiercer` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Reaction Bonus`,
    show: true,
    default: false,
    id: '13419',
    scaling: (base, form, r) => {
      if (form['13419']) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Missive Windspear` })
        base[Stats.EM].push({ value: calcRefinement(48, 12, r), name: 'Passive', source: `Missive Windspear` })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Unity's Symbols`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '13427',
    scaling: (base, form, r) => {
      if (form['13427']) {
        base[Stats.P_ATK].push({
          value: calcRefinement(0.03, 0.01, r) * form['13427'],
          name: 'Struggle',
          source: `Prospector's Drill`,
        })
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.07, 0.015, r) * form['13427'],
          name: 'Struggle',
          source: `Prospector's Drill`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Current HP < 50%`,
    show: true,
    default: false,
    id: '13501',
    scaling: (base, form, r) => {
      if (form['13501'])
        base.CALLBACK.push(function (x) {
          const buff = _.find(x[Stats.ATK], (item) => item.source === 'Staff of Homa')
          buff.multiplier += calcRefinement(0.01, 0.002, r)
          buff.value += calcRefinement(0.01, 0.002, r) * x.getHP()
          return x
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Bonus ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '13504',
    scaling: (base, form, r) => {
      if (form['13504'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.04, 0.01, r) * form['11504'],
          name: 'Passive',
          source: `Vortex Vanquisher`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Doubled ATK Bonus`,
    show: true,
    default: true,
    id: '13504_2',
    scaling: (base, form, r) => {
      if (form['13504_2'] && form['13504']) {
        const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'Vortex Vanquisher')
        buff.value *= 2
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Consummation Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 6,
    id: '13507',
    scaling: (base, form, r) => {
      if (form['13507'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.032, 0.008, r) * form['13507'],
          name: 'Consummation',
          source: `Calamity Queller`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Off-Field Bonus`,
    show: true,
    default: true,
    id: '13507_2',
    scaling: (base, form, r) => {
      if (form['13507_2'] && form['13507']) {
        const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'Calamity Queller')
        buff.value *= 2
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Burst Bonus ER`,
    show: true,
    default: true,
    id: '13509',
    scaling: (base, form, r) => {
      if (form['13509'])
        base[Stats.ER].push({ value: calcRefinement(0.3, 0.05, r), name: 'Passive', source: `Engulfing Lightning` })
      return base
    },
  },
  {
    type: 'number',
    text: `Dream of the Scarlet Sands Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '13511',
    scaling: (base, form, r) => {
      if (form['13511'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({
            value: calcRefinement(0.28, 0.07, r) * base.getEM() * form['13511'],
            name: 'Dream of the Scarlet Sands',
            source: `Staff of the Scarlet Sands`,
            base: base.getEM(),
            multiplier: calcRefinement(0.28, 0.07, r) * form['13511'],
          })
          return base
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bond of Life Bonus`,
    show: true,
    default: true,
    id: '13512',
    scaling: (base, form, r) => {
      if (form['13512'])
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.12, 0.035, r),
          name: 'Passive',
          source: `Crimson Moon's Semblance`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bond of Life >= 30%`,
    show: true,
    default: false,
    id: '13512_2',
    scaling: (base, form, r) => {
      if (form['13512_2'] && form['13512']) {
        const buff = _.find(base[Stats.ALL_DMG], (item) => item.source === `Crimson Moon's Semblance`)
        buff.value += calcRefinement(0.24, 0.08, r)
      }
      return base
    },
  },
  {
    type: 'number',
    text: `On-Hit ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 7,
    id: '13505',
    scaling: (base, form, r) => {
      if (form['13505'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.032, 0.007, r) * form['13505'],
          name: 'Passive',
          source: `Primordial Jade Winged-Spear`,
        })
      if (form['13505'] === 7)
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: `Primordial Jade Winged-Spear`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bane of Storm and Tide`,
    show: true,
    default: false,
    id: '14301',
    scaling: (base, form, r) => {
      if (form['14301'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `Magic Guide` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Hydro Reaction ATK Bonus`,
    show: true,
    default: false,
    id: '14304',
    scaling: (base, form, r) => {
      if (form['14304'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Emerald Orb` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Kill Bonus`,
    show: true,
    default: false,
    id: '14305',
    scaling: (base, form, r) => {
      if (form['14305'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.02, r), name: 'Passive', source: `Twin Nephrite` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Recitative [ATK]`,
    show: true,
    default: false,
    id: '14402',
    scaling: (base, form, r) => {
      if (form['14402'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.6, 0.15, r), name: 'Recitative', source: `The Widsith` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Aria [DMG]`,
    show: true,
    default: false,
    id: '14402_2',
    scaling: (base, form, r) => {
      if (form['14402_2'])
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.48, 0.12, r), name: 'Aria', source: `The Widsith` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Interlude [EM]`,
    show: true,
    default: false,
    id: '14402_3',
    scaling: (base, form, r) => {
      if (form['14402_3'])
        base[Stats.EM].push({ value: calcRefinement(240, 60, r), name: 'Interlude', source: `The Widsith` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Normal Attack Hit`,
    show: true,
    default: false,
    id: '14405',
    scaling: (base, form, r) => {
      if (form['14405']) {
        base.SKILL_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Solar Pearl` })
        base.BURST_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Solar Pearl` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill/Burst Hit`,
    show: true,
    default: false,
    id: '14405_2',
    scaling: (base, form, r) => {
      if (form['14405_2'])
        base.BASIC_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Solar Pearl` })
      return base
    },
  },
  {
    type: 'number',
    text: `On-Reaction Bonus`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '14407',
    scaling: (base, form, r) => {
      if (form['14407'])
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.08, 0.02, r) * form['14407'],
          name: 'Passive',
          source: `Mappa Mare`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `CRIT Rate Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '14404',
    scaling: (base, form, r) => {
      if (form['14404'])
        base[Stats.CRIT_RATE].push({
          value: form['11404'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: 'Royal Grimoire',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Ballad Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '14426',
    scaling: (base, form, r) => {
      if (form['14426']) {
        base.BASIC_DMG.push({
          value: form['14426'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: 'Ballad of the Boundless Blue',
        })
        base.CHARGE_DMG.push({
          value: form['14426'] * calcRefinement(0.06, 0.015, r),
          name: 'Passive',
          source: 'Ballad of the Boundless Blue',
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Sprint Bonus`,
    show: true,
    default: false,
    id: '14410',
    scaling: (base, form, r) => {
      if (form['14410'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Wine and Song` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Normal to Charge Bonus`,
    show: true,
    default: false,
    id: '14413',
    scaling: (base, form, r) => {
      if (form['14413'])
        base.CHARGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Dodoco Tales` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Charge to ATK Bonus`,
    show: true,
    default: false,
    id: '14413_2',
    scaling: (base, form, r) => {
      if (form['14413_2'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `Dodoco Tales` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill ER Bonus`,
    show: true,
    default: false,
    id: '14415',
    scaling: (base, form, r) => {
      if (form['14415'])
        base[Stats.ER].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `Oathsworn Eye` })
      return base
    },
  },
  {
    type: 'number',
    text: `Wax and Wane Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '14417',
    scaling: (base, form, r) => {
      if (form['14417']) {
        base[Stats.EM].push({
          value: calcRefinement(24, 6, r) * form['14417'],
          name: 'Wax and Wane',
          source: `Fruit of Fulfillment`,
        })
        base[Stats.P_ATK].push({ value: -0.05 * form['14417'], name: 'Wax and Wane', source: `Fruit of Fulfillment` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Off-Field Bonus`,
    show: true,
    default: true,
    id: '14424',
    scaling: (base, form, r) => {
      if (form['14424']) {
        base[Stats.EM].push({ value: calcRefinement(40, 10, r), name: 'Passive', source: `Sacrificial Jade` })
        base[Stats.P_HP].push({ value: calcRefinement(0.32, 0.08, r), name: 'Passive', source: `Sacrificial Jade` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill ATK Buff`,
    show: true,
    default: true,
    id: '14425',
    scaling: (base, form, r) => {
      if (form['14425'])
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: `Flowing Purity`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `BoL% Cleared`,
    show: true,
    default: true,
    id: '14425_2',
    scaling: (base, form, r) => {
      if (form['14425'] && form['14425_2'])
        base.CALLBACK.push((base: StatsObject) => {
          const buff = _.find(base[Stats.ELEMENTAL_DMG], (item) => item.source === 'Flowing Purity')
          buff.flat = toPercentage(buff.value)
          buff.value += _.min([
            ((0.24 * base.getHP()) / 1000) * calcRefinement(0.02, 0.005, r),
            calcRefinement(0.12, 0.03, r),
          ])
          buff.base = (0.24 * _.min([base.getHP(), 25000])) / 1000
          buff.multiplier = calcRefinement(0.02, 0.005, r)
          return base
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Seconds In-Combat`,
    show: true,
    default: 0,
    min: 0,
    max: 4,
    id: '14502',
    scaling: (base, form, r) => {
      if (form['14502'])
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.08, 0.02, r) * form['14502'],
          name: 'Passive',
          source: `Lost Prayer to the Sacred Winds`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Bonus ATK Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '14504',
    scaling: (base, form, r) => {
      if (form['14504'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.04, 0.01, r) * form['14504'],
          name: 'Passive',
          source: `Memory of Dust`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Doubled ATK Bonus`,
    show: true,
    default: true,
    id: '14504_2',
    scaling: (base, form, r) => {
      if (form['14504_2'] && form['14504']) {
        const buff = _.find(base[Stats.P_ATK], (item) => item.source === 'Memory of Dust')
        buff.value *= 2
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Primordial Jade Regalia`,
    show: true,
    default: true,
    id: '14505',
    scaling: (base, form, r, { element }) => {
      if (form['14505'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats[`${element.toUpperCase()}_DMG`]].push({
            value: _.min([calcRefinement(0.003, 0.002, r) * (base.getHP() / 1000), calcRefinement(0.12, 0.08, r)]),
            name: 'Primordial Jade Regalia',
            source: `Jadefall's Splendor`,
            base: _.min([base.getHP(), 40000]) / 1000,
            multiplier: calcRefinement(0.003, 0.002, r),
          })
          return base
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Kagura Dance Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '14509',
    scaling: (base, form, r) => {
      if (form['14509'])
        base.SKILL_DMG.push({
          value: calcRefinement(0.12, 0.03, r) * form['14509'],
          name: 'Kagura Dance',
          source: `Kagura's Verity`,
        })
      if (form['14509'] === 3)
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.12, 0.03, r),
          name: 'Kagura Dance',
          source: `Kagura's Verity`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Normal ATK DMG Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 10,
    id: '14512',
    scaling: (base, form, r) => {
      if (form['14512'])
        base.BASIC_DMG.push({
          value: calcRefinement(0.048, 0.012, r) * form['14512'],
          name: 'Passive',
          source: `Tulaytullah's Remembrance`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `HP Change Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '14513',
    scaling: (base, form, r) => {
      if (form['14513']) {
        base.BASIC_DMG.push({
          value: calcRefinement(0.14, 0.035, r) * form['14513'],
          name: 'Passive',
          source: `Cashflow Supervision`,
        })
        base.CHARGE_DMG.push({
          value: calcRefinement(0.14, 0.035, r) * form['14513'],
          name: 'Passive',
          source: `Cashflow Supervision`,
        })
      }
      if (form['14513'] === 3)
        base.ATK_SPD.push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `Cashflow Supervision` })
      return base
    },
  },
  {
    type: 'number',
    text: `HP Change Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '14514',
    scaling: (base, form, r) => {
      if (form['14514'])
        base.CHARGE_DMG.push({
          value: calcRefinement(0.14, 0.04, r) * form['14514'],
          name: 'Passive',
          source: `Tome of the Eternal Flow`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bane of Flame and Water`,
    show: true,
    default: true,
    id: '15301',
    scaling: (base, form, r) => {
      if (form['15301'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Raven Bow` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Against Weakspot`,
    show: true,
    default: true,
    id: '15302',
    scaling: (base, form, r) => {
      if (form['15302'])
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.24, 0.06, r),
          name: 'Passive',
          source: `Sharpshooter's Oath`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Close-Ranged Bonus`,
    show: true,
    default: true,
    id: '15304',
    scaling: (base, form, r) => {
      if (form['15304'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.36, 0.06, r), name: 'Passive', source: `Slingshot` })
      return base
    },
  },
  {
    type: 'number',
    text: `CRIT Rate Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 5,
    id: '15404',
    scaling: (base, form, r) => {
      if (form['15404'])
        base[Stats.CRIT_RATE].push({
          value: form['11404'] * calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: 'Royal Bow',
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Weakspot Hit Buff`,
    show: true,
    default: true,
    id: '15406',
    scaling: (base, form, r) => {
      if (form['15406'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.36, 0.09, r),
          name: 'Passive',
          source: 'Prototype Crescent',
        })
      return base
    },
  },
  {
    type: 'number',
    text: `NA/CA Hit Buff Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 4,
    id: '15407',
    scaling: (base, form, r) => {
      if (form['15407']) {
        base[Stats.P_ATK].push({
          value: form['15407'] * calcRefinement(0.04, 0.01, r),
          name: 'Passive',
          source: 'Compound Bow',
        })
        base.ATK_SPD.push({
          value: form['15407'] * calcRefinement(0.012, 0.003, r),
          name: 'Passive',
          source: 'Compound Bow',
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Off-Field Buff Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 10,
    id: '15410',
    scaling: (base, form, r) => {
      if (form['15410'])
        base[Stats.ALL_DMG].push({
          value: form['15410'] * calcRefinement(0.02, 0.005, r),
          name: 'Passive',
          source: `Alley Hunter`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Fading Twilight State Cycle`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15411',
    scaling: (base, form, r) => {
      if (form['15411'] === 1)
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.06, 0.015, r),
          name: 'Evengleam',
          source: `Fading Twilight`,
        })
      if (form['15411'] === 2)
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.1, 0.025, r), name: 'Afterglow', source: `Fading Twilight` })
      if (form['15411'] === 3)
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.14, 0.035, r),
          name: 'Dawnblaze',
          source: `Fading Twilight`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `NA to Skill DMG Bonus`,
    show: true,
    default: true,
    id: '15412',
    scaling: (base, form, r) => {
      if (form['15412'])
        base.SKILL_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Mitternachts Waltz` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill to NA DMG Bonus`,
    show: true,
    default: true,
    id: '15412',
    scaling: (base, form, r) => {
      if (form['15412'])
        base.BASIC_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Mitternachts Waltz` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Wish of the Windblume`,
    show: true,
    default: true,
    id: '15413',
    scaling: (base, form, r) => {
      if (form['15413'])
        base[Stats.P_ATK].push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Wish of the Windblume',
          source: `Windblume Ode`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Energy Full`,
    show: true,
    default: true,
    id: '15414',
    scaling: (base, form, r) => {
      if (form['15414']) {
        const b1 = _.find(base.BASIC_DMG, (item) => item.source === 'Hamayumi')
        const b2 = _.find(base.CHARGE_DMG, (item) => item.source === 'Hamayumi')
        b1.value *= 2
        b2.value *= 2
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Teachings of the Forest`,
    show: true,
    default: true,
    id: '15417',
    scaling: (base, form, r) => {
      if (form['15417'])
        base[Stats.EM].push({
          value: calcRefinement(60, 20, r),
          name: 'Teachings of the Forest',
          source: `King's Squire`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `EM Bonus Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '15419',
    scaling: (base, form, r) => {
      if (form['15419'])
        base[Stats.EM].push({
          value: form['15419'] * calcRefinement(40, 10, r),
          name: 'Passive',
          source: `Ibis Piercer`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Heartsearer`,
    show: true,
    default: true,
    id: '15424',
    scaling: (base, form, r) => {
      if (form['15424'])
        base.CHARGE_DMG.push({
          value: calcRefinement(0.28, 0.07, r),
          name: 'Heartsearer',
          source: `Scion of the Blazing Sun`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Healed Bonus`,
    show: true,
    default: true,
    id: '15425',
    scaling: (base, form, r) => {
      if (form['15425'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Song of Stillness` })
      return base
    },
  },
  {
    type: 'number',
    text: `Unity's Symbols`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15427',
    scaling: (base, form, r) => {
      if (form['15427']) {
        base[Stats.P_ATK].push({
          value: calcRefinement(0.03, 0.01, r) * form['13427'],
          name: 'Struggle',
          source: `Range Gauge`,
        })
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.07, 0.015, r) * form['13427'],
          name: 'Struggle',
          source: `Range Gauge`,
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Ashen Nightstar Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 4,
    id: '15507',
    scaling: (base, form, r) => {
      if (form['15507'] === 1)
        base[Stats.P_ATK].push({ value: calcRefinement(0.1, 0.025, r), name: 'Ashen Nightstar', source: `Polar Star` })
      if (form['15507'] === 2)
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Ashen Nightstar', source: `Polar Star` })
      if (form['15507'] === 3)
        base[Stats.P_ATK].push({ value: calcRefinement(0.3, 0.075, r), name: 'Ashen Nightstar', source: `Polar Star` })
      if (form['15507'] === 4)
        base[Stats.P_ATK].push({ value: calcRefinement(0.48, 0.12, r), name: 'Ashen Nightstar', source: `Polar Star` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Nearby Enemy Present`,
    show: true,
    default: true,
    id: '15508',
    scaling: (base, form, r) => {
      if (form['15508'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Aqua Simulacra` })
      return base
    },
  },
  {
    type: 'number',
    text: `Thunder Emblem Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15509',
    scaling: (base, form, r) => {
      if (form['15509'] === 1)
        base.BASIC_DMG.push({
          value: calcRefinement(0.12, 0.03, r),
          name: 'Thunder Emblem',
          source: `Thundering Pulse`,
        })
      if (form['15509'] === 2)
        base.BASIC_DMG.push({
          value: calcRefinement(0.24, 0.06, r),
          name: 'Thunder Emblem',
          source: `Thundering Pulse`,
        })
      if (form['15509'] === 3)
        base.BASIC_DMG.push({ value: calcRefinement(0.4, 0.1, r), name: 'Thunder Emblem', source: `Thundering Pulse` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Tireless Hunt`,
    show: true,
    default: true,
    id: '15511',
    scaling: (base, form, r) => {
      if (form['15511'])
        base.CALLBACK.push((base: StatsObject) => {
          base.CHARGE_F_DMG.push({
            value: calcRefinement(1.6, 0.4, r) * base.getEM(),
            name: 'Tireless Hunt',
            source: `Hunter's Path`,
            base: base.getEM(),
            multiplier: calcRefinement(1.6, 0.4, r),
          })
          return base
        })
      return base
    },
  },
  {
    type: 'number',
    text: `BoL Increase`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11515',
    scaling: (base, form, r) => {
      if (form['11515'])
        base[Stats.ALL_DMG].push({
          value: form['11515'] * calcRefinement(0.16, 0.04, r),
          name: 'Passive',
          source: `Absolution`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Ode to Flower Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '11516',
    scaling: (base, form, r) => {
      if (form['11516']) {
        base[Stats.ELEMENTAL_DMG].push({
          value: form['11516'] * calcRefinement(0.1, 0.05, r),
          name: 'Ode to Flowers',
          source: `Peak Patrol Song`,
        })
        base[Stats.P_DEF].push({
          value: form['11516'] * calcRefinement(0.08, 0.02, r),
          name: 'Ode to Flowers',
          source: `Peak Patrol Song`,
        })
        if (form['11516'] >= 2) {
          base.CALLBACK.push(function (x, a) {
            _.forEach(a, (member) => {
              member[Stats.ELEMENTAL_DMG].push({
                value: (x.getDef() / 1000) * calcRefinement(0.08, 0.02, r),
                name: 'Ode to Flowers',
                source: `Peak Patrol Song`,
                base: (x.getDef() / 1000).toLocaleString(undefined, { maximumFractionDigits: 2 }),
                multiplier: calcRefinement(0.08, 0.02, r),
              })
            })
            return x
          })
        }
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Remedy Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15513',
    scaling: (base, form, r) => {
      if (form['15513'] === 1)
        base[Stats.P_HP].push({
          value: calcRefinement(0.12, 0.03, r),
          name: 'Remedy',
          source: `Silvershower Heartstring`,
        })
      if (form['15513'] === 2)
        base[Stats.P_HP].push({
          value: calcRefinement(0.24, 0.06, r),
          name: 'Remedy',
          source: `Silvershower Heartstring`,
        })
      if (form['15513'] === 3) {
        base[Stats.P_HP].push({
          value: calcRefinement(0.4, 0.1, r),
          name: 'Remedy',
          source: `Silvershower Heartstring`,
        })
        base.BURST_CR.push({ value: calcRefinement(0.28, 0.07, r), name: 'Remedy', source: `Silvershower Heartstring` })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Bonus EM Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '15426',
    scaling: (base, form, r) => {
      if (form['15426'])
        base[Stats.EM].push({
          value: calcRefinement(40, 10, r) * form['15426'],
          name: 'Passive',
          source: `Cloudforged`,
        })
      return base
    },
  },
  {
    type: 'number',
    text: `Canopy's Favor Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 6,
    id: '12513',
    scaling: (base, form, r) => {
      if (form['12513']) {
        base.SKILL_DMG.push({
          value: calcRefinement(0.1, 0.025, r) * form['12513'],
          name: `Canopy's Favor`,
          source: `Fang of the Mountain King`,
        })
        base.BURST_DMG.push({
          value: calcRefinement(0.1, 0.025, r) * form['12513'],
          name: `Canopy's Favor`,
          source: `Fang of the Mountain King`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Scorching Summer`,
    show: true,
    default: true,
    id: '14516',
    scaling: (base, form, r) => {
      if (form['14516']) {
        base.BASIC_DMG.push({
          value: calcRefinement(0.12, 0.03, r),
          name: `Scorching Summer`,
          source: `Surf's Up`,
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Burning Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '13513',
    scaling: (base, form, r) => {
      if (form['13513']) {
        base[Stats.ALL_DMG].push({
          value: calcRefinement(0.18, 0.05, r) * form['13513'],
          name: `Passive`,
          source: `Lumidouce Elegy`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Jade-Forged Crown`,
    show: true,
    default: true,
    id: '14431',
    scaling: (base, form, r) => {
      if (form['14431']) {
        base.CALLBACK.push((x: StatsObject) => {
          const base = x.getHP() / 1000
          const multiplier = calcRefinement(0.006, 0.001, r)
          x.BASIC_DMG.push({
            value: _.min([base * multiplier, calcRefinement(0.16, 0.04, r)]),
            name: `Jade-Forged Crown`,
            source: `Ring of Yaxche`,
            base: base.toFixed(1),
            multiplier,
          })
          return x
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Skill DEF Bonus`,
    show: true,
    default: true,
    id: '13431',
    scaling: (base, form, r) => {
      if (form['13431']) {
        base[Stats.P_DEF].push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Passive`,
          source: `Footprint of the Rainbow`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Party Skill Cast Bonus`,
    show: true,
    default: true,
    id: '13430',
    scaling: (base, form, r) => {
      if (form['13430']) {
        const buff = _.find(base.SKILL_DMG, (item) => item.source === 'Mountain-Bracing Bolt')
        buff.value *= 2
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Pyro Reaction Bonus`,
    show: true,
    default: true,
    id: '12431',
    scaling: (base, form, r) => {
      if (form['12431']) {
        base.SKILL_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Passive`,
          source: `Earth Shaker`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Plunge Bonus`,
    show: true,
    default: true,
    id: '12430',
    scaling: (base, form, r) => {
      if (form['12430']) {
        base.BASIC_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Passive`,
          source: `Fruitful Hook`,
        })
        base.CHARGE_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Passive`,
          source: `Fruitful Hook`,
        })
        base.PLUNGE_DMG.push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Passive`,
          source: `Fruitful Hook`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Skill DEF Bonus`,
    show: true,
    default: true,
    id: '11431',
    scaling: (base, form, r) => {
      if (form['11431']) {
        base[Stats.P_DEF].push({
          value: calcRefinement(0.16, 0.04, r),
          name: `Passive`,
          source: `Flute of Ezpitzal`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Sprint DMG Bonus`,
    show: true,
    default: true,
    id: '11430',
    scaling: (base, form, r) => {
      if (form['11430']) {
        base.CALLBACK.push((x: StatsObject) => {
          x.BASIC_F_DMG.push({
            value: calcRefinement(0.16, 0.04, r) * x.getAtk(),
            name: 'Passive',
            source: `Sturdy Bone`,
            base: x.getAtk(),
            multiplier: calcRefinement(0.16, 0.04, r),
          })
          return x
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Skill HP Bonus`,
    show: true,
    default: true,
    id: '14430',
    scaling: (base, form, r, { team }) => {
      if (form['14430']) {
        const count = _.min([_.filter(team, (item) => findCharacter(item.cId)?.element === Element.HYDRO).length, 2])
        base[Stats.P_HP].push({
          value: calcRefinement(0.2, 0.05, r) + count * calcRefinement(0.12, 0.03, r),
          name: 'Passive',
          source: `Waveriding Whirl`,
        })
      }
      return base
    },
  },
  {
    type: 'number',
    text: `Aimed Shot Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 6,
    id: '15430',
    scaling: (base, form, r) => {
      if (form['15430']) {
        base.CHARGE_DMG.push({
          value: calcRefinement(0.06, 0.015, r) + form['15430'],
          name: 'Passive',
          source: `Flower-Wreathed Feathers`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Shielded NA/CA Bonus`,
    show: true,
    default: true,
    id: '11432',
    scaling: (base, form, r) => {
      if (form['11432']) {
        base.BASIC_DMG.push({
          value: calcRefinement(0.2, 0.05, r),
          name: 'Passive',
          source: `The Calamity of the Blighted Springs`,
        })
        base.CHARGE_DMG.push({
          value: calcRefinement(0.2, 0.05, r),
          name: 'Passive',
          source: `The Calamity of the Blighted Springs`,
        })
        base.BASIC_CR.push({
          value: calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: `The Calamity of the Blighted Springs`,
        })
        base.CHARGE_CR.push({
          value: calcRefinement(0.08, 0.02, r),
          name: 'Passive',
          source: `The Calamity of the Blighted Springs`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `On-Swirl ATK Bonus`,
    show: true,
    default: true,
    id: '15514',
    scaling: (base, form, r) => {
      if (form['15514']) {
        base[Stats.P_ATK].push({
          value: calcRefinement(0.24, 0.06, r),
          name: 'Passive',
          source: `Astral Vulture's Crimson Plumage`,
        })
      }
      return base
    },
  },
]

export const WeaponAllyConditionals: IWeaponContent[] = [
  {
    type: 'toggle',
    text: `TToDS Switch Bonus`,
    show: true,
    default: false,
    id: '14302',
    scaling: (base, form, r, { owner }) => {
      const e = checkBuffExist(base[Stats.P_ATK], { source: 'Thrilling Tales of Dragon Slayers' })
      if (form['14302_' + owner] && !e) {
        base[Stats.P_ATK].push({
          value: calcRefinement(0.24, 0.06, r),
          name: 'Passive',
          source: `Thrilling Tales of Dragon Slayers`,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '11417_a',
    scaling: (base, form, r, { owner }) => {
      if (form['11417_a_' + owner])
        base[Stats.EM].push({
          value: calcRefinement(60, 15, r),
          name: 'Leaf of Consciousness',
          source: `Sapwood Blade`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '12417_a',
    scaling: (base, form, r, { owner }) => {
      if (form['12417_a_' + owner])
        base[Stats.EM].push({
          value: calcRefinement(60, 15, r),
          name: 'Leaf of Consciousness',
          source: `Forest Regalia`,
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Revival`,
    show: true,
    default: false,
    id: '13417_a',
    scaling: (base, form, r, { owner }) => {
      if (form['13417_a_' + owner])
        base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Leaf of Revival', source: `Moonpiercer` })
      return base
    },
  },
]

export const WeaponTeamConditionals: IWeaponContent[] = [
  {
    type: 'number',
    text: `Grand Hymn Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11511',
    scaling: (base, form, r, { own }) => {
      if (form['11511'])
        base.CALLBACK.push((x: StatsObject) => {
          if (x.NAME === own.NAME) {
            const multiplier =
              calcRefinement(0.0012, 0.0003, r) * form['11511'] +
              (form['11511'] >= 3 ? calcRefinement(0.002, 0.0005, r) : 0)
            x[Stats.EM].push({
              value: multiplier * x.getHP(),
              name: 'Grand Hymn',
              source: `Key of Khaj-Nisut`,
              base: x.getHP(),
              multiplier: toPercentage(multiplier, 2),
            })
          } else {
            if (form['11511'] >= 3)
              x[Stats.EM].push({
                value: calcRefinement(0.002, 0.0005, r) * x.getHP(),
                name: 'Grand Hymn',
                source: 'Key of Khaj-Nisut',
                base: x.getHP(),
                multiplier: toPercentage(calcRefinement(0.002, 0.0005, r)),
              })
          }
          return x
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Xiphos' Moonlight`,
    show: true,
    default: true,
    id: '11418',
    scaling: (base, form, r, { own }) => {
      if (form['11418'])
        base.CALLBACK.push((base: StatsObject) => {
          const o = own.NAME === base.NAME
          base[Stats.ER].push({
            value: calcRefinement(0.00036, 0.00009, r) * base.getEM() * (o ? 1 : 0.3),
            name: o ? 'Passive' : `Xiphos' Moonlight`,
            source: o ? `Xiphos' Moonlight` : base.NAME,
            base: base.getEM(),
            multiplier: toPercentage(calcRefinement(0.00036, 0.00009, r) * (o ? 1 : 0.3), 3),
          })
          return base
        })

      return base
    },
  },
  {
    type: 'toggle',
    text: `Makhaira Aquamarine`,
    show: true,
    default: true,
    id: '12415',
    scaling: (base, form, r, { own }) => {
      if (form['12415'])
        base.CALLBACK.push((base: StatsObject) => {
          const o = own.NAME === base.NAME
          base[Stats.ATK].push({
            value: calcRefinement(0.24, 0.06, r) * base.getEM() * (o ? 1 : 0.3),
            name: o ? 'Passive' : 'Makhaira Aquamarine',
            source: o ? 'Makhaira Aquamarine' : base.NAME,
            base: base.getEM(),
            multiplier: toPercentage(calcRefinement(0.24, 0.06, r) * (o ? 1 : 0.3), 2),
          })
          return base
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Wandering Evenstar`,
    show: true,
    default: true,
    id: '14416',
    scaling: (base, form, r, { own }) => {
      if (form['14416'])
        base.CALLBACK.push((base: StatsObject) => {
          const o = own.NAME === base.NAME
          base[Stats.ATK].push({
            value: calcRefinement(0.24, 0.06, r) * base.getEM() * (o ? 1 : 0.3),
            name: o ? 'Passive' : 'Wandering Evenstar',
            source: o ? 'Wandering Evenstar' : base.NAME,
            base: base.getEM(),
            multiplier: toPercentage(calcRefinement(0.24, 0.06, r) * (o ? 1 : 0.3), 2),
          })
          return base
        })
      return base
    },
  },
  {
    type: 'multiple',
    text: `Electro Reaction Bonus`,
    show: true,
    default: [],
    options: _.map(
      _.filter(Element, (item) => !_.includes([Element.ELECTRO, Element.PHYSICAL], item)),
      (item) => ({ name: item, value: item })
    ),
    id: '14414',
    scaling: (base, form, r) => {
      if (form['14414'])
        base[Stats.ELECTRO_DMG].push({
          value: calcRefinement(0.1, 0.025, r),
          name: 'Passive',
          source: `Hakushin Ring`,
        })
      _.forEach(form['14414'], (e) => {
        base[Stats[`${e.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.1, 0.025, r),
          name: 'Passive',
          source: `Hakushin Ring`,
        })
      })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Hit Target HP < 30%`,
    show: true,
    default: true,
    id: '12502',
    scaling: (base, form, r) => {
      if (form['12502'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.4, 0.1, r), name: 'Passive', source: `Wolf's Gravestone` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Millennial Movement: Banner-Hymn`,
    show: true,
    default: true,
    id: '12503',
    scaling: (base, form, r) => {
      if (form['12503']) {
        base[Stats.P_ATK].push({
          value: calcRefinement(0.2, 0.05, r),
          name: 'Banner-Hymn',
          source: `Song of Broken Pines`,
        })
        base.ATK_SPD.push({ value: calcRefinement(0.12, 0.03, r), name: 'Banner-Hymn', source: `Song of Broken Pines` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Team Plunge DMG Bonus`,
    show: true,
    default: true,
    id: '14515',
    scaling: (base, form, r) => {
      if (form['14515'])
        base.PLUNGE_DMG.push({ value: calcRefinement(0.28, 0.13, r), name: 'Passive', source: `Crane's Echoing Call` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Millennial Movement: Farewell Song`,
    show: true,
    default: true,
    id: '15503',
    scaling: (base, form, r) => {
      if (form['15503']) {
        base[Stats.EM].push({ value: calcRefinement(100, 25, r), name: 'Farewell Song', source: `Elegy for the End` })
        base[Stats.P_ATK].push({
          value: calcRefinement(0.2, 0.05, r),
          name: 'Farewell Song',
          source: `Elegy for the End`,
        })
      }
      return base
    },
  },
]
