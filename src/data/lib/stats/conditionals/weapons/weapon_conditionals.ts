import { calcRefinement } from '@src/core/utils/data_format'
import { findContentById } from '@src/core/utils/finder'
import { IWeaponContent } from '@src/domain/genshin/conditional'
import { Stats } from '@src/domain/genshin/constant'
import _ from 'lodash'

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
        base.BASIC_DMG += form['15502'] * calcRefinement(0.08, 0.02, r)
        base.CHARGE_DMG += form['15502'] * calcRefinement(0.08, 0.02, r)
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
      if (form['11301']) base[Stats.ALL_DMG] += calcRefinement(0.12, 0.03, r)
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
      if (form['11302']) base[Stats.CRIT_RATE] += calcRefinement(0.14, 0.035, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Electro Reaction Buff`,
    show: true,
    default: true,
    id: '11304',
    scaling: (base, form, r) => {
      if (form['11304']) base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
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
      if (form['11306']) base[Stats.P_ATK] += calcRefinement(0.12, 0.03, r)
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
      if (form['11404']) base[Stats.CRIT_RATE] += form['11404'] * calcRefinement(0.08, 0.02, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Lion's Roar`,
    show: true,
    default: true,
    id: '11405',
    scaling: (base, form, r) => {
      if (form['11405']) base[Stats.ALL_DMG] += calcRefinement(0.2, 0.04, r)
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
      if (form['11415']) base.SKILL_F_DMG += base.getDef() * calcRefinement(0.4, 0.1, r)
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
      if (form['11407']) base[Stats.ALL_DMG] += form['11407'] * calcRefinement(0.06, 0.015, r)
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
      if (form['11408']) base[Stats.P_ATK] += form['11408'] * calcRefinement(0.12, 0.03, r)
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
      if (form['11410']) base[Stats.ALL_DMG] += calcRefinement(0.12, 0.04, r)
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
      if (form['11417']) base[Stats.EM] += calcRefinement(60, 15, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Xiphos Bonus ER`,
    show: true,
    default: true,
    id: '11418',
    scaling: (base, form, r) => {
      if (form['11418']) base[Stats.ER] += base[Stats.EM] * calcRefinement(0.00036, 0.00009, r)
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
      if (form['11422']) base[Stats.ALL_DMG] += calcRefinement(0.16, 0.04, r)
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
      if (form['11424']) base[Stats.CRIT_RATE] += form['11424'] * calcRefinement(0.02, 0.005, r)
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
      if (form['11425']) base[Stats.P_ATK] += calcRefinement(0.12, 0.03, r)
      return base
    },
  },
  {
    type: 'number',
    text: `BoL% Cleared`,
    show: true,
    default: 0,
    min: 0,
    max: 25,
    id: '11425_2',
    scaling: (base, form, r) => {
      if (form['11425'] && form['11425_2'])
        base[Stats.ATK] += _.min([
          (form['11425_2'] / 100) * calcRefinement(0.024, 0.006, r) * base.getHP(),
          calcRefinement(150, 37.5, r),
        ])
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
      if (form['11426']) base[Stats.ER] += calcRefinement(0.16, 0.04, r)
      return base
    },
  },
  {
    type: 'number',
    text: `Stoic Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11427',
    scaling: (base, form, r) => {
      if (form['11427']) base[Stats.EM] += calcRefinement(40, 10, r) * form['11427']
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
      if (form['11502']) base.ATK_SPD += 0.1
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
        base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
        base.BASIC_DMG += calcRefinement(0.16, 0.04, r)
        base.CHARGE_DMG += calcRefinement(0.16, 0.04, r)
        base.PLUNGE_DMG += calcRefinement(0.16, 0.04, r)
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
      if (form['11504']) base[Stats.P_ATK] += calcRefinement(0.04, 0.01, r) * form['11504']
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skypiercing Might`,
    show: true,
    default: true,
    id: '11504_2',
    scaling: (base, form, r) => {
      if (form['11504_2'] && form['11504']) base[Stats.P_ATK] += calcRefinement(0.04, 0.01, r) * form['11504']
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus ATK from HP`,
    show: true,
    default: true,
    id: '11505',
    scaling: (base, form, r) => {
      base[Stats.ATK] += calcRefinement(0.012, 0.003, r) * base.getHP()
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
      if (form['11509'] === 1) base[Stats[`${element.toUpperCase()}_DMG`]] += calcRefinement(0.08, 0.02, r)
      if (form['11509'] === 2) base[Stats[`${element.toUpperCase()}_DMG`]] += calcRefinement(0.16, 0.04, r)
      if (form['11509'] === 3) base[Stats[`${element.toUpperCase()}_DMG`]] += calcRefinement(0.28, 0.07, r)
      return base
    },
  },
  {
    type: 'number',
    text: `Wavespike Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 2,
    id: '11510',
    scaling: (base, form, r) => {
      if (form['11510']) base.BASIC_DMG += calcRefinement(0.2, 0.05, r) * form['11510']
      return base
    },
  },
  {
    type: 'number',
    text: `Grandhymn Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '11511',
    scaling: (base, form, r) => {
      if (form['11511']) base[Stats.EM] += calcRefinement(0.0012, 0.0003, r) * base.getHP() * form['11510']
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
        base.BASIC_F_DMG += calcRefinement(1.2, 0.3, r) * base[Stats.EM]
        base.SKILL_F_DMG += calcRefinement(1.2, 0.3, r) * base[Stats.EM]
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
      if (form['11513']) base.SKILL_DMG += calcRefinement(0.08, 0.02, r) * form['11513']
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
      if (form['11513_2']) base[Stats.P_HP] += calcRefinement(0.14, 0.035, r) * form['11513_2']
      return base
    },
  },
  {
    type: 'toggle',
    text: `Enhanced Passive`,
    show: true,
    default: true,
    id: '11514',
    scaling: (base, form, r) => {
      if (form['11514']) {
        base.BASIC_DMG += calcRefinement(0.16, 0.04, r)
        base.SKILL_DMG += calcRefinement(0.24, 0.06, r)
      }
      return base
    },
  },
]

export const WeaponAllyConditionals: IWeaponContent[] = [
  {
    type: 'toggle',
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '11417_a',
    scaling: (base, form, r) => {
      if (form['11417_a']) base[Stats.EM] += calcRefinement(60, 15, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Xiphos Allied Bonus ER`,
    show: true,
    default: true,
    id: '11418_2',
    scaling: (base, form, r, { own }) => {
      if (form['11418']) base[Stats.ER] += own[Stats.EM] * calcRefinement(0.00036, 0.00009, r) * 0.3
      return base
    },
  },
  {
    type: 'toggle',
    text: `Allied Grandhymn Buff`,
    show: true,
    default: false,
    id: '11511_a',
    scaling: (base, form, r, { own }) => {
      if (form['11511_a']) base[Stats.EM] += calcRefinement(0.002, 0.0005, r) * own.getHP()
      return base
    },
  },
]

export const WeaponTeamConditionals: IWeaponContent[] = []
