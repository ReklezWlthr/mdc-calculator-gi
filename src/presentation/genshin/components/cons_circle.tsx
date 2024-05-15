import { ITalent } from '@src/domain/genshin/conditional'
import { Element } from '@src/domain/genshin/constant'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import { observer } from 'mobx-react-lite'

export const ConsCircle = observer(
  ({
    talents,
    element,
    codeName,
    name,
    cons,
  }: {
    talents: ITalent
    element: Element
    codeName: string
    name: string
    cons: number
  }) => {
    const iconColor = {
      [Element.PYRO]: 'bg-genshin-pyro ring-genshin-pyro',
      [Element.HYDRO]: 'bg-genshin-hydro ring-genshin-hydro',
      [Element.CRYO]: 'bg-genshin-cryo ring-genshin-cryo',
      [Element.ELECTRO]: 'bg-genshin-electro ring-genshin-electro',
      [Element.GEO]: 'bg-genshin-geo ring-genshin-geo',
      [Element.ANEMO]: 'bg-genshin-anemo ring-genshin-anemo',
      [Element.DENDRO]: 'bg-genshin-dendro ring-genshin-dendro',
    }

    return (
      <div className="flex flex-col justify-around w-[252px] h-[252px] relative">
        <div
          className={classNames(
            'absolute w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-1/2 ring top-1/2 left-1/2 bg-opacity-10',
            iconColor[element]
          )}
        />
        <div className="flex justify-center">
          <Tooltip
            title={talents?.c1?.title}
            body={<p dangerouslySetInnerHTML={{ __html: talents?.c1?.content }} />}
            style="w-[40vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_S_${codeName}_01.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                cons >= 1 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
        </div>
        <div className="flex justify-between px-3">
          <Tooltip
            title={talents?.c6?.title}
            body={<p dangerouslySetInnerHTML={{ __html: talents?.c6?.content }} />}
            style="w-[40vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_S_${codeName}_04.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                cons >= 6 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
          <Tooltip
            title={talents?.c2?.title}
            body={<p dangerouslySetInnerHTML={{ __html: talents?.c2?.content }} />}
            style="w-[40vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_S_${codeName}_02.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                cons >= 2 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
        </div>
        <div className="flex items-center justify-center h-12">
          <p className="w-1/2 px-1 text-lg font-bold text-center">{name}</p>
        </div>
        <div className="flex justify-between px-3">
          <Tooltip
            title={talents?.c5?.title}
            body={<p dangerouslySetInnerHTML={{ __html: talents?.c5?.content }} />}
            style="w-[25vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_U_${codeName}_02.png`}
              className={classNames(
                'shrink-0 w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                cons >= 5 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
          <Tooltip
            title={talents?.c3?.title}
            body={<p dangerouslySetInnerHTML={{ __html: talents?.c3?.content }} />}
            style="w-[25vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_U_${codeName}_01.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                cons >= 3 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
        </div>
        <div className="flex justify-center">
          <Tooltip
            title={talents?.c4?.title}
            body={<p dangerouslySetInnerHTML={{ __html: talents?.c4?.content }} />}
            style="w-[40vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_S_${codeName}_03.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                cons >= 4 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
        </div>
      </div>
    )
  }
)
