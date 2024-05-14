import { Element } from '@src/domain/genshin/constant'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

interface ScalingWrapperProps {
  children: React.ReactNode[]
  icon: string
  talent: { title: string; content: string; upgrade?: string[] }
  element: Element
  level?: number
  upgraded: boolean
}

export const TalentIcon = observer(
  ({
    talent,
    icon,
    element,
    size,
  }: {
    icon: string
    element: Element
    talent: { title: string; content: string; upgrade?: string[] }
    size?: string
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
      <Tooltip
        title={talent?.title}
        body={<p dangerouslySetInnerHTML={{ __html: talent?.content }} />}
        style="w-[40vw]"
      >
        <img
          src={icon}
          className={classNames(
            'p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
            iconColor[element],
            size || 'w-12 h-12'
          )}
        />
      </Tooltip>
    )
  }
)

export const ScalingWrapper = observer(({ children, icon, talent, element, level, upgraded }: ScalingWrapperProps) => {
  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center justify-center w-1/5 px-2 py-5">
        <TalentIcon talent={talent} icon={icon} element={element} />
        <p className="w-full mt-2 font-bold text-center">{talent?.title}</p>
        {level && (
          <p className="text-xs text-gray">
            Level <span className={upgraded ? 'text-blue font-bold' : 'text-gray'}>{level + (upgraded ? 3 : 0)}</span>
          </p>
        )}
      </div>
      <div className="w-4/5 space-y-0.5">{children}</div>
    </div>
  )
})
