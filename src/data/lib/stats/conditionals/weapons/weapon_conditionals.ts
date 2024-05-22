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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
      if (form['11410']) base[Stats.ALL_DMG] += calcRefinement(0.12, 0.04, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '114117',
    scaling: (base, form, team, r) => {
      if (form['114117']) base[Stats.EM] += calcRefinement(60, 15, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Xiphos Bonus ER`,
    show: true,
    default: true,
    id: '11418',
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
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
    scaling: (base, form, team, r) => {
      if (form['11427']) base[Stats.EM] += calcRefinement(40, 10, r) * form['11427']
      return base
    },
  },
]

export const WeaponAllyConditionals: IWeaponContent[] = [{
  type: 'toggle',
  text: `Leaf of Consciousness`,
  show: true,
  default: false,
  id: '114117_a',
  scaling: (base, form, team, r) => {
    if (form['114117_a']) base[Stats.EM] += calcRefinement(60, 15, r)
    return base
  },
},]

export const WeaponTeamConditionals: IWeaponContent[] = [
  {
    type: 'toggle',
    text: `Xiphos Bonus ER`,
    show: true,
    default: true,
    id: '11418_2',
    scaling: (base, form, team, r) => {
      if (form['11418']) base[Stats.ER] += base[Stats.EM] * calcRefinement(0.00036, 0.00009, r) * 0.3
      return base
    },
  },
]
