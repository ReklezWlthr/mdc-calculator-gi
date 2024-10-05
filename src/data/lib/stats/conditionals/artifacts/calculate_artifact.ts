import { Element, IArtifactEquip, ITeamChar, Stats, TalentProperty } from '@src/domain/constant'
import { StatsObject } from '../../baseConstant'
import { getSetCount } from '@src/core/utils/data_format'
import _ from 'lodash'
import { ArtifactForm } from './artifact_form'
import { findCharacter } from '@src/core/utils/finder'

export const getArtifactConditionals = (artifacts: IArtifactEquip[]) => {
  const setBonus = getSetCount(artifacts)
  const { content, teamContent } = ArtifactForm()
  const set = _.findKey(setBonus, (item) => item >= 4)

  return {
    content: _.filter(content, (item) => _.includes(item.id, set)),
    teamContent: _.filter(teamContent, (item) => _.includes(item.id, set)),
  }
}

export const calculateArtifact = (base: StatsObject, form: Record<string, any>, team: ITeamChar[], index: number) => {
  if (form['1751039235']) base.BURST_DMG.push({value: 0.2, name: '', source: ``})
  if (form['1541919827']) base.CHARGE_DMG.push({value: 0.5, name: '', source: ``})
  if (form['83115355']) base[Stats.I_HEALING].push({value: 0.2, name: '', source: ``})
  if (form['1562601179']) base[`${form['1562601179'].toUpperCase()}_RES_PEN`].push({value: 0.4, name: '', source: ``})
  if (form['2040573235']) base[Stats[`${form['2040573235'].toUpperCase()}_DMG`]].push({value: 0.35, name: '', source: ``})
  if (form['1438974835']) {
    base.BASIC_DMG.push({value: 0.4, name: '', source: ``})
    base.CHARGE_DMG.push({value: 0.4, name: '', source: ``})
  }
  if (form['1873342283']) base[Stats.ALL_DMG].push({value: 0.35, name: '', source: ``})
  if (form['1632377563']) base[Stats.ALL_DMG].push({value: 0.35, name: '', source: ``})
  if (form['1524173875']) {
    const crimsonT = 0.2 * form['1524173875']
    const crimsonA = 0.075 * form['1524173875']

    base.OVERLOAD_DMG += crimsonT
    base.BURNING_DMG += crimsonT
    base.BURGEON_DMG += crimsonT
    base.VAPE_DMG += crimsonA
    base.MELT_DMG += crimsonA
  }
  if (form['933076627']) base[Stats.CRIT_RATE].push({value: 0.2, name: '', source: ``}) * form['933076627']
  if (form['156294403']) {
    base.BASIC_DMG.push({value: 0.3, name: '', source: ``})
    base.CHARGE_DMG.push({value: 0.3, name: '', source: ``})
  }
  if (form['1337666507']) {
    base[Stats.P_ATK].push({value: 0.2, name: '', source: ``})
    base[Stats.SHIELD].push({value: 0.3, name: '', source: ``})
  }
  if (form['862591315']) base[Stats.P_ATK].push({value: 0.09, name: '', source: ``}) * form['862591315']
  if (form['4144069251']) {
    base.BASIC_DMG.push({value: 0.5, name: '', source: ``})
    base.CHARGE_DMG.push({value: 0.5, name: '', source: ``})
    base.PLUNGE_DMG.push({value: 0.5, name: '', source: ``})
  }
  if (form['2546254811']) {
    base[Stats.P_DEF].push({value: 0.06, name: '', source: ``}) * form['2546254811']
    base[Stats.GEO_DMG].push({value: 0.06, name: '', source: ``}) * form['2546254811']
  }
  if (form['1756609915']) {
    base.CALLBACK.push((x: StatsObject) => {
      x.SKILL_SCALING.push({
        name: 'Sea-Dyed Foam DMG',
        element: Element.PHYSICAL,
        property: TalentProperty.STATIC,
        value: [{ multiplier: Stats.HEAL, scaling: 0.9, override: parseFloat(form['1756609915']) }],
      })
      return x
    })
  }
  if (form['1558036915']) {
    base[Stats.P_ATK].push({value: 0.08, name: '', source: ``})
    if (form['1558036915_2']) base[Stats.P_ATK].push({value: 0.1, name: '', source: ``}) * form['1558036915_2']
  }
  if (form['3626268211']) base.BASIC_F_DMG.push({value: 0.7, name: '', source: ``}) * base.getAtk()
  if (form['1675079283']) base.DENDRO_RES_PEN.push({value: 0.3, name: '', source: ``})
  if (form['4145306051']) {
    const teamElement = _.map(team, (item) => findCharacter(item.cId)?.element)
    const wearer = teamElement[index]
    const sameCount = _.filter(teamElement, (item) => item === wearer).length - 1
    const diffCount = _.filter(teamElement, (item) => item !== wearer).length

    base[Stats.P_ATK].push({value: 0.14, name: '', source: ``}) * sameCount
    base[Stats.EM].push({value: 50 , name: '', source: ``})* diffCount
  }
  if (form['2538235187']) {
    base.ATK_SPD.push({value: 0.1, name: '', source: ``})
    base.BASIC_DMG.push({value: 0.4, name: '', source: ``})
    base.CHARGE_DMG.push({value: 0.4, name: '', source: ``})
    base.PLUNGE_DMG.push({value: 0.4, name: '', source: ``})
  }
  if (form['3094139291']) {
    base.BLOOM_DMG += form['3094139291'] * 0.1
    base.HYPERBLOOM_DMG += form['3094139291'] * 0.1
    base.BURGEON_DMG += form['3094139291'] * 0.1
  }
  if (form['1925210475'] === 1) {
    base[Stats.P_ATK].push({value: 0.07, name: '', source: ``})
    base[Stats.HYDRO_DMG].push({value: 0.04, name: '', source: ``})
  }
  if (form['1925210475'] === 2) {
    base[Stats.P_ATK].push({value: 0.16, name: '', source: ``})
    base[Stats.HYDRO_DMG].push({value: 0.09, name: '', source: ``})
  }
  if (form['1925210475'] === 3) {
    base[Stats.P_ATK].push({value: 0.25, name: '', source: ``})
    base[Stats.HYDRO_DMG].push({value: 0.15, name: '', source: ``})
  }
  if (form['235897163']) {
    base.SKILL_DMG.push({value: 0.08, name: '', source: ``}) * form['235897163']
    base.BURST_DMG.push({value: 0.08, name: '', source: ``}) * form['235897163']
  }
  if (form['1249831867']) base[Stats.CRIT_RATE] += form['1249831867'] * 0.12
  if (form['3410220315']) base.SKILL_DMG.push({value: 0.25, name: '', source: ``})
  if (form['2803305851']) {
    base.BASIC_F_DMG += form['2803305851'] * 0.08
    base.CHARGE_F_DMG += form['2803305851'] * 0.08
    base.PLUNGE_F_DMG += form['2803305851'] * 0.08
    base.SKILL_F_DMG += form['2803305851'] * 0.08
    base.BURST_F_DMG += form['2803305851'] * 0.08
  }
  if (form['279470883']) {
    base[Stats.GEO_DMG].push({value: 0.2, name: '', source: ``})
    if (form['279470883_2']) base[Stats.GEO_DMG].push({value: 0.3, name: '', source: ``})
  }
  if (form['1492570003']) base[Stats.ALL_DMG] += form['1492570003'] * 0.18
  if (form['352459163']) base[Stats.ALL_DMG] += form['352459163'] * 0.1

  if (form['1383639611']) base[`${form['1383639611'].toUpperCase()}_RES`].push({value: 0.3, name: '', source: ``})
  if (form['855894507']) base[Stats.CRIT_RATE].push({value: 0.24, name: '', source: ``})
  if (form['3890292467']) base[Stats.EM].push({value: 120, name: '', source: ``})
  if (form['3535784755']) base[Stats.ALL_DMG].push({value: 0.3, name: '', source: ``})
  if (form['2890909531']) {
    base.BASIC_DMG.push({value: 0.25, name: '', source: ``})
    base.CHARGE_DMG.push({value: 0.25, name: '', source: ``})
  }

  return base
}

export const calculateTeamArtifact = (base: StatsObject, form: Record<string, any>) => {
  if (form['1751039235']) base.BURST_DMG.push({value: 0.2, name: '', source: ``})
  if (form['83115355']) base[Stats.I_HEALING].push({value: 0.2, name: '', source: ``})
  if (form['1562601179']) base[`${form['1562601179'].toUpperCase()}_RES_PEN`].push({value: 0.4, name: '', source: ``})
  if (form['2040573235']) base[Stats[`${form['2040573235'].toUpperCase()}_DMG`]].push({value: 0.35, name: '', source: ``})
  if (form['1337666507']) {
    base[Stats.P_ATK].push({value: 0.2, name: '', source: ``})
    base[Stats.SHIELD].push({value: 0.3, name: '', source: ``})
  }
  if (form['1756609915']) {
    base.SKILL_SCALING.push({
      name: 'Sea-Dyed Foam DMG',
      element: Element.PHYSICAL,
      property: TalentProperty.STATIC,
      value: [{ multiplier: Stats.ATK, scaling: 0 }],
      flat: parseFloat(form['2546254811']) * 0.9,
    })
  }
  if (form['1675079283']) base.DENDRO_RES_PEN.push({value: 0.3, name: '', source: ``})
  if (form['2803305851']) {
    base.BASIC_F_DMG += form['2803305851'] * 0.08
    base.CHARGE_F_DMG += form['2803305851'] * 0.08
    base.PLUNGE_F_DMG += form['2803305851'] * 0.08
    base.SKILL_F_DMG += form['2803305851'] * 0.08
    base.BURST_F_DMG += form['2803305851'] * 0.08
  }
  if (form['3890292467']) base[Stats.EM].push({value: 120, name: '', source: ``})

  return base
}
