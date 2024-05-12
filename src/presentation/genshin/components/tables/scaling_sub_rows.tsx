import { IScaling } from '@src/domain/genshin/conditional'
import { Element, Stats } from '@src/domain/genshin/constant'
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
    Heal: 'text-green-200',
    Shield: 'text-blue-200',
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
  }

  return (
    <div className="grid items-center grid-cols-8 gap-2 pr-2">
      <p className="col-span-2 text-center">{scaling.property}</p>
      <p className={classNames('col-span-1 text-center', elementColor[scaling.element])}>{scaling.element}</p>
      <p className="col-span-1 text-center text-gray">{_.round(scaling.value)}</p>
      <p className="col-span-1 text-center text-gray">{_.round(scaling.value * (1 + cd))}</p>
      <p className={classNames('col-span-1 font-bold text-center', propertyColor[scaling.property] || 'text-red')}>
        {_.round(scaling.value * (1 + cd * cr))}
      </p>
      <p className="col-span-2 text-xs">{scaling.name}</p>
    </div>
  )
})
