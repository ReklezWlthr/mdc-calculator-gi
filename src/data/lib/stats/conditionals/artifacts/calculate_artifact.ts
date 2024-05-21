import { Element, IArtifactEquip, ITeamChar, Stats, TalentProperty } from '@src/domain/genshin/constant'
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
    content: _.filter(content, (item) => item.id === set),
    teamContent: _.filter(teamContent, (item) => item.id === set),
  }
}

export const calculateArtifact = (base: StatsObject, form: Record<string, any>, team: ITeamChar[], index: number) => {
  if (form['1751039235']) base.BURST_DMG += 0.2
  if (form['1541919827']) base.CHARGE_DMG += 0.5
  if (form['83115355']) base[Stats.I_HEALING] += 0.2
  if (form['1562601179']) base[`${form['1562601179'].toUpperCase()}_RES_PEN`] += 0.4
  if (form['2040573235']) base[Stats[`${form['2040573235'].toUpperCase()}_DMG`]] += 0.35
  if (form['1438974835']) {
    base.BASIC_DMG += 0.4
    base.CHARGE_DMG += 0.4
  }
  if (form['1873342283']) base[Stats.ALL_DMG] += 0.35
  if (form['1632377563']) base[Stats.ALL_DMG] += 0.35
  if (form['1524173875']) {
    const crimsonT = 0.2 * form['1524173875']
    const crimsonA = 0.075 * form['1524173875']

    base.OVERLOAD_DMG += crimsonT
    base.BURNING_DMG += crimsonT
    base.BURGEON_DMG += crimsonT
    base.VAPE_DMG += crimsonA
    base.MELT_DMG += crimsonA
  }
  if (form['933076627']) base[Stats.CRIT_RATE] += 0.2 * form['933076627']
  if (form['156294403']) {
    base.BASIC_DMG += 0.3
    base.CHARGE_DMG += 0.3
  }
  if (form['1337666507']) {
    base[Stats.P_ATK] += 0.2
    base[Stats.SHIELD] += 0.3
  }
  if (form['862591315']) base[Stats.P_ATK] += 0.09 * form['862591315']
  if (form['4144069251']) {
    base.BASIC_DMG += 0.5
    base.CHARGE_DMG += 0.5
    base.PLUNGE_DMG += 0.5
  }
  if (form['2546254811']) {
    base[Stats.P_DEF] += 0.06 * form['2546254811']
    base[Stats.GEO_DMG] += 0.06 * form['2546254811']
  }
  if (form['2546254811']) {
    base.SKILL_SCALING.push({
      name: 'Sea-Dyed Foam DMG',
      element: Element.PHYSICAL,
      property: TalentProperty.STATIC,
      value: [{ multiplier: Stats.ATK, scaling: 0 }],
      flat: parseFloat(form['2546254811']) * 0.9,
    })
  }
  if (form['1558036915']) {
    base[Stats.P_ATK] += 0.08
    if (form['1558036915_2']) base[Stats.P_ATK] += 0.1 * form['1558036915_2']
  }
  if (form['3626268211']) base.BASIC_F_DMG += 0.7 * base.getAtk()
  if (form['1675079283']) base.DENDRO_RES_PEN += 0.3
  if (form['4145306051']) {
    const teamElement = _.map(team, (item) => findCharacter(item.cId)?.element)
    const wearer = teamElement[index]
    const sameCount = _.filter(teamElement, (item) => item === wearer).length - 1
    const diffCount = _.filter(teamElement, (item) => item !== wearer).length

    base[Stats.P_ATK] += 0.14 * sameCount
    base[Stats.EM] += 50 * diffCount
  }
  if (form['4145306051']) {
    base.ATK_SPD += 0.1
    base.BASIC_DMG += 0.4
    base.CHARGE_DMG += 0.4
    base.PLUNGE_DMG += 0.4
  }
  if (form['3094139291']) {
    base.BLOOM_DMG += form['3094139291'] * 0.1
    base.HYPERBLOOM_DMG += form['3094139291'] * 0.1
    base.BURGEON_DMG += form['3094139291'] * 0.1
  }
  if (form['1925210475'] === 1) {
    base[Stats.P_ATK] += 0.07
    base[Stats.HYDRO_DMG] += 0.04
  }
  if (form['1925210475'] === 2) {
    base[Stats.P_ATK] += 0.16
    base[Stats.HYDRO_DMG] += 0.09
  }
  if (form['1925210475'] === 3) {
    base[Stats.P_ATK] += 0.25
    base[Stats.HYDRO_DMG] += 0.15
  }
  if (form['235897163']) {
    base.SKILL_DMG += 0.08 * form['235897163']
    base.BURST_DMG += 0.08 * form['235897163']
  }
  if (form['1249831867']) base[Stats.CRIT_RATE] += form['1249831867'] * 0.12
  if (form['3410220315']) base.SKILL_DMG += 0.25
  if (form['2803305851']) {
    base.BASIC_F_DMG += form['2803305851'] * 0.08
    base.CHARGE_F_DMG += form['2803305851'] * 0.08
    base.PLUNGE_F_DMG += form['2803305851'] * 0.08
    base.SKILL_F_DMG += form['2803305851'] * 0.08
    base.BURST_F_DMG += form['2803305851'] * 0.08
  }
  if (form['279470883']) {
    base[Stats.GEO_DMG] += 0.2
    if (form['279470883_2']) base[Stats.GEO_DMG] += 0.3
  }
  if (form['1492570003']) base[Stats.ALL_DMG] += form['1492570003'] * 0.18
  if (form['352459163']) base[Stats.ALL_DMG] += form['352459163'] * 0.1

  if (form['1383639611']) base[`${form['1383639611'].toUpperCase()}_RES`] += 0.3
  if (form['855894507']) base[Stats.CRIT_RATE] += 0.24
  if (form['3890292467']) base[Stats.EM] += 120
  if (form['3535784755']) base[Stats.ALL_DMG] += 0.3
  if (form['2890909531']) {
    base.BASIC_DMG += 0.25
    base.CHARGE_DMG += 0.25
  }

  return base
}
