import { calcRefinement } from '@src/core/utils/data_format'
import { findCharacter, findContentById } from '@src/core/utils/finder'
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
  {
    type: 'toggle',
    text: `Current HP Below Threshold`,
    show: true,
    default: true,
    id: '12301',
    scaling: (base, form, r) => {
      if (form['12301']) base.CHARGE_DMG += calcRefinement(0.3, 0.05, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bloodtainted Greatsword`,
    show: true,
    default: true,
    id: '12302',
    scaling: (base, form, r) => {
      if (form['12302']) base[Stats.ALL_DMG] += calcRefinement(0.12, 0.03, r)
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
      if (form['12306']) base[Stats.P_ATK] += calcRefinement(0.06, 0.01, r) * form['12306']
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
      if (form['12402']) base[Stats.ALL_DMG] += calcRefinement(0.12, 0.03, r)
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
      if (form['12404']) base[Stats.CRIT_RATE] += form['12404'] * calcRefinement(0.08, 0.02, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Rainslasher`,
    show: true,
    default: true,
    id: '12405',
    scaling: (base, form, r) => {
      if (form['12405']) base[Stats.ALL_DMG] += calcRefinement(0.2, 0.04, r)
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
        base[Stats.P_ATK] += calcRefinement(0.06, 0.015, r)
        base[Stats.P_DEF] += calcRefinement(0.06, 0.015, r)
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
      if (form['12408']) base[Stats.P_ATK] += form['12408'] * calcRefinement(0.12, 0.03, r)
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
    id: '13408',
    scaling: (base, form, r) => {
      if (form['13408']) base[Stats.P_ATK] += form['13408'] * calcRefinement(0.12, 0.03, r)
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
      if (form['14408']) base[Stats.P_ATK] += form['14408'] * calcRefinement(0.12, 0.03, r)
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
      if (form['15408']) base[Stats.P_ATK] += form['15408'] * calcRefinement(0.12, 0.03, r)
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
        base[Stats.ALL_DMG] += form['12409'] * calcRefinement(0.06, 0.01, r)
        base.DMG_REDUCTION -= form['12409'] * calcRefinement(0.03, -0.0025, r)
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Lithic Blade Bonus`,
    show: true,
    default: true,
    id: '12410',
    scaling: (base, form, r, { team }) => {
      if (form['12410']) {
        const count = _.filter(
          _.map(team, (item) => findCharacter(item.cId)?.region),
          (item) => item === 'Liyue'
        ).length
        base[Stats.P_ATK] += count * calcRefinement(0.07, 0.01, r)
        base[Stats.CRIT_RATE] += count * calcRefinement(0.03, 0.01, r)
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus ATK from EM`,
    show: true,
    default: true,
    id: '12415',
    scaling: (base, form, r) => {
      if (form['12415']) base[Stats.ATK] += calcRefinement(0.24, 0.06, r) * base[Stats.EM]
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus Burst DMG from Energy`,
    show: true,
    default: true,
    id: '12416',
    scaling: (base, form, r, { totalEnergy }) => {
      if (form['12416'])
        base.BURST_DMG += _.min([calcRefinement(0.0012, 0.0003, r) * totalEnergy, calcRefinement(0.4, 0.02, r)])
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
      if (form['12417']) base[Stats.EM] += calcRefinement(60, 15, r)
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
        base[Stats.P_ATK] += calcRefinement(0.12, 0.03, r)
        base[Stats.EM] += calcRefinement(40, 12, r)
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
      if (form['12424']) base[Stats.P_ATK] += calcRefinement(0.16, 0.04, r)
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
      if (form['12424_2']) base[Stats.ALL_DMG] += calcRefinement(0.12, 0.03, r)
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
      if (form['12425']) base[Stats.P_ATK] += calcRefinement(0.24, 0.06, r)
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
      if (form['12426']) base[Stats.P_ATK] += calcRefinement(0.12 / 6, 0.06 / 6, r) * form['12426']
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
    id: '12427',
    scaling: (base, form, r) => {
      if (form['12427']) base[Stats.EM] += calcRefinement(40, 10, r) * form['12427']
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
      if (form['12504']) base[Stats.P_ATK] += calcRefinement(0.04, 0.01, r) * form['12504']
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
      if (form['12504']) base[Stats.P_ATK] += calcRefinement(0.04, 0.01, r) * form['12504']
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
      if (form['12511']) base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
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
      if (form['12511_2']) base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
      return base
    },
  },
  {
    type: 'toggle',
    text: `Not Shielded Bonus`,
    show: true,
    default: false,
    id: '12511_3',
    scaling: (base, form, r) => {
      if (form['12511_3']) base[Stats.P_HP] += calcRefinement(0.32, 0.08, r)
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
      if (form['12512']) base.SKILL_DMG += calcRefinement(0.18, 0.045, r) * form['12512']
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
    text: `Leaf of Consciousness`,
    show: true,
    default: false,
    id: '12417_a',
    scaling: (base, form, r) => {
      if (form['12417_a']) base[Stats.EM] += calcRefinement(60, 15, r)
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
      if (form['11418_2']) base[Stats.ER] += own[Stats.EM] * calcRefinement(0.00036, 0.00009, r) * 0.3
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
  {
    type: 'toggle',
    text: `Bonus ATK from Ally EM`,
    show: true,
    default: true,
    id: '12415_a',
    scaling: (base, form, r, { own }) => {
      if (form['12415_a']) base[Stats.ATK] += calcRefinement(0.24, 0.06, r) * own[Stats.EM] * 0.3
      return base
    },
  },
]

export const WeaponTeamConditionals: IWeaponContent[] = [
  {
    type: 'toggle',
    text: `Hit Target HP < 30%`,
    show: true,
    default: true,
    id: '12502',
    scaling: (base, form, r) => {
      if (form['12502']) base[Stats.P_ATK] += calcRefinement(0.4, 0.1, r)
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
        base[Stats.P_ATK] += calcRefinement(0.2, 0.05, r)
        base.ATK_SPD += calcRefinement(0.12, 0.03, r)
      }
      return base
    },
  },
]
