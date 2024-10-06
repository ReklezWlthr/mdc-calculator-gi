import { ITalentDisplay } from '@src/domain/conditional'
import { Element } from '@src/domain/constant'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

interface ScalingWrapperProps {
  children: React.ReactNode[]
  talent: ITalentDisplay
  element: Element
  level?: number
  upgraded: boolean
  childeBuff?: boolean
}

interface TalentIconProps {
  element: Element
  talent?: ITalentDisplay
  size?: string
  tooltipSize?: string
  level?: number
  showLevel?: boolean
  showUpgrade?: boolean
  upgraded?: boolean
  active?: boolean
  type?: string
  energy?: number
  hideTip?: boolean
}

export const TalentIcon = observer(
  ({
    talent,
    element,
    size,
    tooltipSize,
    level,
    showLevel,
    upgraded,
    showUpgrade,
    type,
    active = true,
    energy,
    hideTip,
  }: TalentIconProps) => {
    const iconColor = {
      [Element.PYRO]: 'bg-genshin-pyro ring-genshin-pyro',
      [Element.HYDRO]: 'bg-genshin-hydro ring-genshin-hydro',
      [Element.CRYO]: 'bg-genshin-cryo ring-genshin-cryo',
      [Element.ELECTRO]: 'bg-genshin-electro ring-genshin-electro',
      [Element.GEO]: 'bg-genshin-geo ring-genshin-geo',
      [Element.ANEMO]: 'bg-genshin-anemo ring-genshin-anemo',
      [Element.DENDRO]: 'bg-genshin-dendro ring-genshin-dendro',
    }

    if (!talent)
      return (
        <div
          className={classNames(
            'p-[5%] rounded-full bg-opacity-35 ring-2 ring-offset-2 ring-offset-primary-darker bg-primary-light ring-primary-lighter opacity-50',
            size || 'w-12 h-12'
          )}
        />
      )

    const IconComp = () => (
      <div className="relative">
        <div
          className={classNames(
            'rounded-full bg-opacity-35 ring-2 ring-offset-2 duration-200 ring-offset-primary-darker flex justify-center items-center shrink-0',
            active ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50',
            size || 'w-12 h-12',
            { 'group-hover:ring-offset-4': !hideTip }
          )}
        >
          <img
            src={`https://homdgcat.wiki/homdgcat-res/AvatarSkill/${talent?.image}.png`}
            className="w-full h-full scale-90"
          />
          <div className="hidden">?</div>
        </div>
        {hideTip && showUpgrade && !!upgraded && (
          <div className="absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-2 bg-cyan-600 text-white">
            +{upgraded}
          </div>
        )}
      </div>
    )

    if (hideTip) return <IconComp />

    return (
      <Tooltip
        title={
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-normal opacity-75 text-gray">{type}</p>
              <p>{talent?.title}</p>
            </div>
            <div className="flex flex-col items-end">
              {!!level && (
                <p className="text-xs font-normal text-gray">
                  Level:{' '}
                  <span className="text-desc">
                    {level} {!!upgraded && <span className="text-blue">(+{upgraded})</span>}
                  </span>
                </p>
              )}
              {!!energy && (
                <p className="text-xs font-normal text-gray">
                  Energy: <span className="text-desc"></span>
                </p>
              )}
            </div>
          </div>
        }
        body={<p dangerouslySetInnerHTML={{ __html: talent?.content }} />}
        style={tooltipSize || 'w-[35vw]'}
      >
        <div className="relative group">
          <IconComp />
          {!!level && showLevel && (
            <div
              className={classNames(
                'absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-1 -right-3 text-white',
                upgraded ? 'bg-cyan-600' : 'bg-primary-light'
              )}
            >
              {level + (upgraded ? 3 : 0)}
            </div>
          )}
          {!showLevel && showUpgrade && !!upgraded && (
            <div className="absolute flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full -bottom-2 -right-2 bg-cyan-600 text-white">
              +{upgraded}
            </div>
          )}
        </div>
      </Tooltip>
    )
  }
)

export const ScalingWrapper = observer(
  ({ children, talent, element, level, upgraded, childeBuff }: ScalingWrapperProps) => {
    return (
      <div className="flex w-full">
        <div className="flex flex-col items-center justify-center w-1/5 px-2 py-5">
          <TalentIcon talent={talent} element={element} level={level} upgraded={upgraded} type={talent?.trace} />
          <p className="w-full mt-2 font-bold text-center">{talent?.title}</p>
          {level && (
            <p className="text-xs text-gray">
              Level <span className={upgraded ? 'text-blue font-bold' : 'text-gray'}>{level + (upgraded ? 3 : 0)}</span>
              {childeBuff && <span className="text-desc"> (+1)</span>}
            </p>
          )}
        </div>
        <div className="w-4/5 space-y-0.5">{children}</div>
      </div>
    )
  }
)

//crowned={level === 10}
