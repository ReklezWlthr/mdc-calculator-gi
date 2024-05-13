import { IScaling } from '@src/domain/genshin/conditional'
import { Element, Stats, TalentProperty } from '@src/domain/genshin/constant'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

interface ScalingSubRowsProps {
  scaling: IScaling
  cr: number
  cd: number
}

export const ScalingSubRows = observer(({ scaling, cr, cd }: ScalingSubRowsProps) => {
  const propertyColor = {
    [TalentProperty.HEAL]: 'text-green-300',
    [TalentProperty.SHIELD]: 'text-blue-200',
  }

  const elementColor = {
    [Element.PHYSICAL]: 'text-gray',
    [Element.PYRO]: 'text-genshin-pyro',
    [Element.HYDRO]: 'text-genshin-hydro',
    [Element.CRYO]: 'text-genshin-cryo',
    [Element.ELECTRO]: 'text-genshin-electro',
    [Element.GEO]: 'text-genshin-geo',
    [Element.ANEMO]: 'text-genshin-anemo',
    [Element.DENDRO]: 'text-genshin-dendro',
    ...propertyColor,
  }

  const dmg = scaling.value * (1 + (scaling.bonus || 0))
  const totalCr = cr + (scaling.cr || 0)
  const totalCd = cd + (scaling.cd || 0)

  return (
    <div className="grid items-center grid-cols-8 gap-2 pr-2">
      <p className="col-span-2 text-center">{scaling.property}</p>
      <p className={classNames('col-span-1 text-center', elementColor[scaling.element])}>{scaling.element}</p>
      <p className="col-span-1 text-center text-gray">{_.round(dmg)}</p>
      <p className="col-span-1 text-center text-gray">
        {_.includes([TalentProperty.HEAL, TalentProperty.SHIELD], scaling.property)
          ? '-'
          : _.round(dmg * (1 + totalCd))}
      </p>
      <p className={classNames('col-span-1 font-bold text-center', propertyColor[scaling.property] || 'text-red')}>
        {_.includes([TalentProperty.HEAL, TalentProperty.SHIELD], scaling.property)
          ? _.round(dmg)
          : _.round(dmg * (1 + totalCd * totalCr))}
      </p>
      <p className="col-span-2 text-xs truncate" title={scaling.name}>
        {scaling.name}
      </p>
    </div>
  )
})
