import { StatsObject } from '@src/data/lib/stats/baseConstant'
import { Tooltip } from '../../components/tooltip'
import { ElementIconColor, TooltipBody } from './cons_circle'
import { ITalent } from '@src/domain/conditional'
import classNames from 'classnames'
import { Element } from '@src/domain/constant'

interface AscensionProps {
  talents: ITalent
  stats?: StatsObject
  ascension: number
  codeName: string
  element: Element
}

export const A1Icon = ({ talents, stats, ascension, codeName, element }: AscensionProps) => {
  return (
    <Tooltip
      title={talents?.a1?.title}
      body={<TooltipBody talent={talents?.a1} stats={stats} unlocked={ascension >= 1} />}
      style="w-[25vw]"
    >
      <img
        src={`https://enka.network/ui/UI_Talent_${codeName === 'PlayerGrass' ? 'U' : 'S'}_${codeName}${
          codeName === 'PlayerGrass'
            ? '_01'
            : codeName === 'Ningguang'
            ? '_02'
            : codeName === 'Tartaglia'
            ? '_03'
            : '_05'
        }.png`}
        className={classNames(
          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
          ascension >= 1 ? ElementIconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
        )}
      />
    </Tooltip>
  )
}

export const A4Icon = ({ talents, stats, ascension, codeName, element }: AscensionProps) => {
  return (
    <Tooltip
      title={talents?.a4?.title}
      body={<TooltipBody talent={talents?.a4} stats={stats} unlocked={ascension >= 4} />}
      style="w-[25vw]"
    >
      <img
        src={`https://enka.network/ui/UI_Talent_${codeName === 'PlayerGrass' ? 'U' : 'S'}_${codeName}${
          codeName === 'PlayerGrass' ? '_02' : '_06'
        }.png`}
        className={classNames(
          'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
          ascension >= 4 ? ElementIconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
        )}
      />
    </Tooltip>
  )
}

export const AscensionIcons = (props: AscensionProps) => {
  return (
    <div className="flex items-center justify-around w-full">
      <A1Icon {...props} />
      <p className="text-sm font-bold">Ascension</p>
      <A4Icon {...props} />
    </div>
  )
}
