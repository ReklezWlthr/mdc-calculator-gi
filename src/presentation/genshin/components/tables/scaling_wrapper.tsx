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
}

export const ScalingWrapper = observer(({ children, icon, talent, element }: ScalingWrapperProps) => {
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
    <div className="flex w-full">
      <div className="flex flex-col items-center justify-center w-1/5 gap-2 px-2 py-5">
        <Tooltip
          title={talent?.title}
          body={<p dangerouslySetInnerHTML={{ __html: talent?.content }} />}
          style="w-[40vw]"
        >
          <img
            src={icon}
            className={classNames(
              'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 ring-offset-primary-darker',
              iconColor[element]
            )}
          />
        </Tooltip>
        <p className="w-full font-bold text-center">{talent?.title}</p>
      </div>
      <div className="w-4/5">{children}</div>
    </div>
  )
})
