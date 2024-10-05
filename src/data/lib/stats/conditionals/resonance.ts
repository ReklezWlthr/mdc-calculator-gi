import { getResonanceCount } from '@src/core/utils/data_format'
import { IWeaponContent } from '@src/domain/conditional'
import { Element, ITeamChar, Stats } from '@src/domain/constant'

export const ResonanceConditionals: (characters: ITeamChar[]) => IWeaponContent[] = (characters) => {
  const set = getResonanceCount(characters)

  return [
    {
      type: 'toggle',
      text: `Geo Resonance DMG Bonus`,
      show: set[Element.GEO] >= 2,
      default: true,
      id: 'geo_1',
      scaling: (base, form) => {
        if (form.geo_1) base[Stats.ALL_DMG].push({ value: 0.15, name: 'Geo Resonance', source: `Team` })
        return base
      },
    },
    {
      type: 'toggle',
      text: `Geo Resonance RES Shred`,
      show: set[Element.GEO] >= 2,
      default: true,
      debuff: true,
      id: 'geo_2',
      scaling: (base, form) => {
        if (form.geo_2) base.GEO_RES_PEN.push({ value: 0.2, name: 'Geo Resonance', source: `Team` })
        return base
      },
    },
    {
      type: 'toggle',
      text: `Dendro Res. 1-Layer EM Bonus`,
      show: set[Element.DENDRO] >= 2,
      default: true,
      id: 'dendro_1',
      scaling: (base, form) => {
        if (form.dendro_1) base[Stats.EM].push({ value: 30, name: 'Dendro Resonance [1-Layer]', source: `Team` })
        return base
      },
    },
    {
      type: 'toggle',
      text: `Dendro Res. 2-Layer EM Bonus`,
      show: set[Element.DENDRO] >= 2,
      default: true,
      id: 'dendro_2',
      scaling: (base, form) => {
        if (form.dendro_2) base[Stats.EM].push({ value: 20, name: 'Dendro Resonance [2-Layer]', source: `Team` })
        return base
      },
    },
  ]
}
