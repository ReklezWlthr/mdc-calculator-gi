import { calcRefinement } from '@src/core/utils/data_format'
import { findCharacter, findContentById } from '@src/core/utils/finder'
import { IWeaponContent } from '@src/domain/conditional'
import { Stats } from '@src/domain/constant'
import _ from 'lodash'
import { StatsObject } from '../../baseConstant'

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
      if (form['11301']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
        base[Stats.CRIT_RATE].push({ value: calcRefinement(0.14, 0.035, r), name: 'Passive', source: `` })
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
      if (form['11304']) base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
      if (form['11306']) base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
      if (form['11405']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `` })
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
      if (form['11410']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.04, r), name: 'Passive', source: `` })
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
      if (form['11417']) base[Stats.EM].push({ value: calcRefinement(60, 15, r), name: 'Passive', source: `` })
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
      if (form['11418'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ER] += base[Stats.EM] * calcRefinement(0.00036, 0.00009, r)
          return base
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
      if (form['11422']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
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
      if (form['11425']) base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK] += _.min([
            (form['11425_2'] / 100) * calcRefinement(0.024, 0.006, r) * base.getHP(),
            calcRefinement(150, 37.5, r),
          ])
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
      if (form['11426']) base[Stats.ER].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
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
      if (form['11427'])
        base[Stats.EM].push({ value: calcRefinement(40, 10, r), name: 'Passive', source: `` }) * form['11427']
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
      if (form['11502']) base.ATK_SPD.push({ value: 0.1, name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
        base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
        base.CHARGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
        base.PLUNGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `` }) * form['11504']
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
      if (form['11504_2'] && form['11504'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `` }) * form['11504']
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
          name: 'Passive',
          source: ``,
        })
      if (form['11509'] === 2)
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.16, 0.04, r),
          name: 'Passive',
          source: ``,
        })
      if (form['11509'] === 3)
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.28, 0.07, r),
          name: 'Passive',
          source: ``,
        })
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
      if (form['11510'])
        base.BASIC_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` }) * form['11510']
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
      if (form['11511'])
        base[Stats.EM].push({ value: calcRefinement(0.0012, 0.0003, r), name: 'Passive', source: `` }) *
          base.getHP() *
          form['11510']
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
          base.BASIC_F_DMG.push({ value: calcRefinement(1.2, 0.3, r), name: 'Passive', source: `` }) * base[Stats.EM]
          base.SKILL_F_DMG.push({ value: calcRefinement(1.2, 0.3, r), name: 'Passive', source: `` }) * base[Stats.EM]
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
        base.SKILL_DMG.push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` }) * form['11513']
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
        base[Stats.P_HP].push({ value: calcRefinement(0.14, 0.035, r), name: 'Passive', source: `` }) * form['11513_2']
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
        base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
        base.SKILL_DMG.push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
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
      if (form['12301']) base.CHARGE_DMG.push({ value: calcRefinement(0.3, 0.05, r), name: 'Passive', source: `` })
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
      if (form['12302']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.06, 0.01, r), name: 'Passive', source: `` }) * form['12306']
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
      if (form['12402']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
      if (form['12405']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `` })
        base[Stats.P_DEF].push({ value: calcRefinement(0.06, 0.015, r), name: 'Passive', source: `` })
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
    text: `Bonus ATK from EM`,
    show: true,
    default: true,
    id: '12415',
    scaling: (base, form, r) => {
      if (form['12415'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` }) * base[Stats.EM]
          return base
        })
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
      if (form['12417']) base[Stats.EM].push({ value: calcRefinement(60, 15, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
        base[Stats.EM].push({ value: calcRefinement(40, 12, r), name: 'Passive', source: `` })
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
      if (form['12424']) base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
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
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
      if (form['12425']) base[Stats.P_ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
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
      if (form['12427'])
        base[Stats.EM].push({ value: calcRefinement(40, 10, r), name: 'Passive', source: `` }) * form['12427']
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `` }) * form['12504']
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `` }) * form['12504']
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
      if (form['12511']) base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
      if (form['12511_2']) base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
      if (form['12511_3']) base[Stats.P_HP].push({ value: calcRefinement(0.32, 0.08, r), name: 'Passive', source: `` })
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
        base.SKILL_DMG.push({ value: calcRefinement(0.18, 0.045, r), name: 'Passive', source: `` }) * form['12512']
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
      if (form['13303']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.4, 0.2, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Against Target with Hydro/Pyro`,
    show: true,
    default: false,
    id: '13401',
    scaling: (base, form, r) => {
      if (form['13401']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `` })
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
        base.CHARGE_DMG.push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` }) * form['13402']
        base.BASIC_DMG.push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` }) * form['13402']
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
    id: '13404',
    scaling: (base, form, r) => {
      if (form['13404']) base[Stats.CRIT_RATE] += form['13404'] * calcRefinement(0.08, 0.02, r)
      return base
    },
  },
  {
    type: 'number',
    text: `Nearby Opponents`,
    show: true,
    default: 0,
    min: 0,
    id: '13405',
    scaling: (base, form, r) => {
      if (form['13405'] >= 2) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
        base[Stats.P_DEF].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
      }
      if (form['13405'] < 2)
        base[Stats.P_ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus Burst DMG from Energy`,
    show: true,
    default: true,
    id: '13416',
    scaling: (base, form, r, { totalEnergy }) => {
      if (form['13416'])
        base.BURST_DMG += _.min([calcRefinement(0.0012, 0.0003, r) * totalEnergy, calcRefinement(0.4, 0.02, r)])
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
      if (form['13417']) base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
        base[Stats.EM].push({ value: calcRefinement(48, 12, r), name: 'Passive', source: `` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `3+ Team Element Bonus`,
    show: true,
    default: false,
    id: '13419',
    scaling: (base, form, r, { team }) => {
      const count = _.uniq(_.map(team, (item) => findCharacter(item.cId)?.element)).length
      if (form['13419'] && count >= 3)
        base[Stats.EM].push({ value: calcRefinement(120, 20, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'number',
    text: `Unity Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '13419',
    scaling: (base, form, r) => {
      if (form['13419']) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.03, 0.01, r), name: 'Passive', source: `` })
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.07, 0.015, r), name: 'Passive', source: `` })
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
        base[Stats.ATK].push({ value: calcRefinement(0.01, 0.002, r), name: 'Passive', source: `` }) * base.getHP()
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `` }) * form['13504']
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.032, 0.008, r), name: 'Passive', source: `` }) * form['13507']
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
      if (form['13507_2'] && form['13507'])
        base[Stats.P_ATK].push({ value: calcRefinement(0.032, 0.008, r), name: 'Passive', source: `` }) * form['13507']
      return base
    },
  },
  {
    type: 'toggle',
    text: `Burst Bonus ER`,
    show: true,
    default: true,
    id: '13508',
    scaling: (base, form, r) => {
      if (form['13508']) base[Stats.ER].push({ value: calcRefinement(0.3, 0.05, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Burst Bonus ER`,
    show: true,
    default: true,
    id: '13508',
    scaling: (base, form, r) => {
      if (form['13508']) base[Stats.ER].push({ value: calcRefinement(0.3, 0.05, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'number',
    text: `Skill Hit Bonus ATK`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '13511',
    scaling: (base, form, r) => {
      if (form['13511'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({ value: calcRefinement(0.28, 0.07, r), name: 'Passive', source: `` }) *
            base[Stats.EM] *
            form['13511']
          return base
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bond of Life`,
    show: true,
    default: true,
    id: '13512',
    scaling: (base, form, r) => {
      if (form['13512'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.035, r), name: 'Passive', source: `` })
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
      if (form['13512_2'] && form['13512'])
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.24, 0.08, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.032, 0.007, r), name: 'Passive', source: `` }) * form['13505']
      if (form['13505'] === 7)
        base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Against Target with Hydro/Electro`,
    show: true,
    default: false,
    id: '14301',
    scaling: (base, form, r) => {
      if (form['14301']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.2, 0.04, r), name: 'Passive', source: `` })
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
      if (form['14304']) base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
      if (form['14305']) base[Stats.P_ATK].push({ value: calcRefinement(0.12, 0.02, r), name: 'Passive', source: `` })
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
      if (form['14402']) base[Stats.P_ATK].push({ value: calcRefinement(0.6, 0.15, r), name: 'Passive', source: `` })
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
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.48, 0.12, r), name: 'Passive', source: `` })
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
      if (form['14402_3']) base[Stats.EM].push({ value: calcRefinement(240, 60, r), name: 'Passive', source: `` })
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
        base.SKILL_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
        base.BURST_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
      if (form['14405_2']) base.BASIC_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` }) *
          form['14407']
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
      if (form['14404']) base[Stats.CRIT_RATE] += form['14404'] * calcRefinement(0.08, 0.02, r)
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
        base.BASIC_DMG += form['14426'] * calcRefinement(0.08, 0.02, r)
        base.CHARGE_DMG += form['14426'] * calcRefinement(0.06, 0.015, r)
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
      if (form['14410']) base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
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
      if (form['14413']) base.CHARGE_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
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
      if (form['14413_2']) base[Stats.P_ATK].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Electro Reaction Bonus`,
    show: true,
    default: false,
    id: '14414',
    scaling: (base, form, r, { element }) => {
      if (form['14414'])
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.1, 0.025, r),
          name: 'Passive',
          source: ``,
        })
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
      if (form['14415']) base[Stats.ER].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus ATK from EM`,
    show: true,
    default: true,
    id: '14416',
    scaling: (base, form, r) => {
      if (form['14416'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` }) * base[Stats.EM]
          return base
        })
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
        base[Stats.EM].push({ value: calcRefinement(24, 6, r), name: 'Passive', source: `` }) * form['14417']
        base[Stats.P_ATK] -= 0.05 * form['14417']
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
        base[Stats.EM].push({ value: calcRefinement(40, 10, r), name: 'Passive', source: `` })
        base[Stats.P_HP].push({ value: calcRefinement(0.32, 0.08, r), name: 'Passive', source: `` })
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
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'number',
    text: `BoL% Cleared`,
    show: true,
    default: 0,
    min: 0,
    max: 24,
    id: '14425_2',
    scaling: (base, form, r) => {
      if (form['14425'] && form['14425_2'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ELEMENTAL_DMG] += _.min([
            (((form['14425_2'] / 100) * base.getHP()) / 1000) * calcRefinement(0.02, 0.005, r),
            calcRefinement(0.12, 0.03, r),
          ])
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
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` }) *
          form['14502']
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.04, 0.01, r), name: 'Passive', source: `` }) * form['14504']
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill/Shield DMG Bonus`,
    show: true,
    default: true,
    id: '14505',
    scaling: (base, form, r, { element }) => {
      if (form['14505'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats[`${element.toUpperCase()}_DMG`]] += _.min([
            calcRefinement(0.003, 0.002, r) * (base.getHP() / 1000),
            calcRefinement(0.12, 0.08, r),
          ])
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
        base.SKILL_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` }) * form['14509']
      if (form['14509'] === 3)
        base[Stats.ELEMENTAL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
        base.BASIC_DMG.push({ value: calcRefinement(0.048, 0.012, r), name: 'Passive', source: `` }) * form['14512']
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
        base.BASIC_DMG.push({ value: calcRefinement(0.14, 0.035, r), name: 'Passive', source: `` }) * form['14513']
        base.CHARGE_DMG.push({ value: calcRefinement(0.14, 0.035, r), name: 'Passive', source: `` }) * form['14513']
      }
      if (form['14513'] === 3) base.ATK_SPD.push({ value: calcRefinement(0.08, 0.02, r), name: 'Passive', source: `` })
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
        base.CHARGE_DMG.push({ value: calcRefinement(0.14, 0.04, r), name: 'Passive', source: `` }) * form['14514']
      return base
    },
  },
  {
    type: 'toggle',
    text: `Against Target with Hydro/Pyro`,
    show: true,
    default: true,
    id: '15301',
    scaling: (base, form, r) => {
      if (form['15301']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
      if (form['15302']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
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
      if (form['15304']) base[Stats.ALL_DMG].push({ value: calcRefinement(0.36, 0.06, r), name: 'Passive', source: `` })
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
      if (form['15404']) base[Stats.CRIT_RATE] += form['15404'] * calcRefinement(0.08, 0.02, r)
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
      if (form['15406']) base[Stats.P_ATK] += form['15404'] * calcRefinement(0.36, 0.09, r)
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
        base[Stats.P_ATK] += form['15407'] * calcRefinement(0.04, 0.01, r)
        base.ATK_SPD += form['15407'] * calcRefinement(0.012, 0.003, r)
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
    id: '15406',
    scaling: (base, form, r) => {
      if (form['15406'])
        base.SKILL_DMG.push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `Mitternachts Waltz` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Skill to NA DMG Bonus`,
    show: true,
    default: true,
    id: '15406',
    scaling: (base, form, r) => {
      if (form['15406'])
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
        base.BASIC_DMG.push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `Hamayumi` })
        base.CHARGE_DMG.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `Hamayumi` })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus Burst DMG from Energy`,
    show: true,
    default: true,
    id: '15416',
    scaling: (base, form, r, { totalEnergy }) => {
      if (form['15416'])
        base.BURST_DMG.push({
          value: _.min([calcRefinement(0.0012, 0.0003, r) * totalEnergy, calcRefinement(0.4, 0.02, r)]),
          name: 'Passive',
          source: `Mouun's Moon`,
        })
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
    text: `Unity Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15427',
    scaling: (base, form, r) => {
      if (form['15427']) {
        base[Stats.P_ATK].push({ value: calcRefinement(0.03, 0.01, r), name: `Unity's Symbol`, source: `Range Gauge` })
        base[Stats.ELEMENTAL_DMG].push({
          value: calcRefinement(0.07, 0.015, r),
          name: `Unity's Symbol`,
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
          })
          return base
        })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Gimmick Stacks`,
    show: true,
    default: true,
    id: '15512',
    scaling: (base, form, r, { team, element }) => {
      if (form['15512']) {
        const count =
          _.filter(
            _.map(team, (item) => findCharacter(item.cId)?.element),
            (item) => item === element
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
      }
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
    text: `Remedy Stacks`,
    show: true,
    default: 0,
    min: 0,
    max: 3,
    id: '15513',
    scaling: (base, form, r) => {
      if (form['15513'] === 1)
        base[Stats.P_HP].push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
      if (form['15513'] === 2)
        base[Stats.P_HP].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
      if (form['15513'] === 3) {
        base[Stats.P_HP].push({ value: calcRefinement(0.4, 0.1, r), name: 'Passive', source: `` })
        base.BURST_CR.push({ value: calcRefinement(0.28, 0.07, r), name: 'Passive', source: `` })
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
      if (form['15426']) base[Stats.EM].push({ value: calcRefinement(40, 10, r), name: 'Passive', source: `` })
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
        buff.value += buff.value
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
]

export const WeaponAllyConditionals: IWeaponContent[] = [
  {
    type: 'toggle',
    text: `Electro Reaction Bonus`,
    show: true,
    default: false,
    id: '14414_a',
    scaling: (base, form, r, { team, index, owner }) => {
      if (form['14414_a_' + owner]) {
        const element = findCharacter(team[index].cId)?.element
        base[Stats[`${element.toUpperCase()}_DMG`]].push({
          value: calcRefinement(0.1, 0.025, r),
          name: 'Passive',
          source: ``,
        })
      }
      return base
    },
  },
  {
    type: 'toggle',
    text: `TToDS Switch Bonus`,
    show: true,
    default: false,
    id: '14302',
    scaling: (base, form, r) => {
      // TToDS cannot stack
      if (form['14302']) base[Stats.P_ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` })
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
        base[Stats.EM].push({ value: calcRefinement(60, 15, r), name: 'Passive', source: `` })
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
        base[Stats.EM].push({ value: calcRefinement(60, 15, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Xiphos Bonus ER`,
    show: true,
    default: true,
    id: '11418_2',
    scaling: (base, form, r, { own, owner }) => {
      if (form['11418_2_' + owner])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ER].push({
            value: own.getEM() * calcRefinement(0.00036, 0.00009, r) * 0.3,
            name: 'Passive',
            source: `Xiphos' Moonglow`,
          })
          return base
        })
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
      if (form['11511_a'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.EM].push({ value: calcRefinement(0.002, 0.0005, r), name: 'Passive', source: `` }) * own.getHP()
          return base
        })
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
      if (form['12415_a'])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` }) *
            own.getEM() *
            0.3
          return base
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.16, 0.04, r), name: 'Passive', source: `` })
      return base
    },
  },
  {
    type: 'toggle',
    text: `Bonus ATK from Ally EM`,
    show: true,
    default: true,
    id: '14416_a',
    scaling: (base, form, r, { own, owner }) => {
      if (form['14416_a_' + owner])
        base.CALLBACK.push((base: StatsObject) => {
          base[Stats.ATK].push({ value: calcRefinement(0.24, 0.06, r), name: 'Passive', source: `` }) *
            own.getEM() *
            0.3
          return base
        })
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
      if (form['12502']) base[Stats.P_ATK].push({ value: calcRefinement(0.4, 0.1, r), name: 'Passive', source: `` })
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
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
        base.ATK_SPD.push({ value: calcRefinement(0.12, 0.03, r), name: 'Passive', source: `` })
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
      if (form['14515']) base.PLUNGE_DMG.push({ value: calcRefinement(0.28, 0.13, r), name: 'Passive', source: `` })
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
        base[Stats.EM].push({ value: calcRefinement(100, 25, r), name: 'Passive', source: `` })
        base[Stats.P_ATK].push({ value: calcRefinement(0.2, 0.05, r), name: 'Passive', source: `` })
      }
      return base
    },
  },
]
