import { getResonanceCount } from '@src/core/utils/data_format'
import { IWeaponContent } from '@src/domain/genshin/conditional'
import { Element, ITeamChar, Stats } from '@src/domain/genshin/constant'

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
        if (form.geo_1) base[Stats.ALL_DMG] += 0.15
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
        if (form.geo_2) base.GEO_RES_PEN += 0.2
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
        if (form.dendro_1) base[Stats.EM] += 30
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
        console.log(form.dendro_2)
        if (form.dendro_2) base[Stats.EM] += 20
        return base
      },
    },
  ]
}
