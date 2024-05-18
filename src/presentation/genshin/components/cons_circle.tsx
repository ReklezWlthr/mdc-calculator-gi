import { StatsObject } from '@src/data/lib/stats/baseConstant'
import { ReverseConsList } from '@src/data/lib/stats/conditionals/conditionals'
import { ITalent, ITalentDisplay } from '@src/domain/genshin/conditional'
import { Element, Stats } from '@src/domain/genshin/constant'
import { Tooltip } from '@src/presentation/components/tooltip'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'

export const ConsCircle = observer(
  ({
    talents,
    element,
    codeName,
    name,
    cons,
    ascension,
    stats,
  }: {
    talents: ITalent
    element: Element
    codeName: string
    name: string
    cons: number
    ascension: number
    stats?: StatsObject
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
    const statForScale = {
      [Stats.ATK]: stats?.getAtk(),
      [Stats.DEF]: stats?.getDef(),
      [Stats.HP]: stats?.getHP(),
      [Stats.EM]: stats?.[Stats.EM],
      [Stats.ER]: stats?.[Stats.ER],
      [Stats.HEAL]: stats?.[Stats.HEAL],
    }
    const TooltipBody = ({ talent, unlocked }: { talent: ITalentDisplay; unlocked: boolean }) => {
      return (
        <div className="space-y-3">
          <p dangerouslySetInnerHTML={{ __html: talent?.content }} />
          {!!_.size(talent?.value) && unlocked && (
            <div>
              {_.map(talent?.value, (item) => (
                <p>
                  {item.name}: <span className="text-desc">{item.value.scaling(statForScale[item.value.stat])}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-around">
          <Tooltip
            title={talents?.a1?.title}
            body={<TooltipBody talent={talents?.a1} unlocked={ascension >= 1} />}
            style="w-[40vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_S_${codeName}${
                codeName === 'Ningguang' ? '_02' : codeName === 'Tartaglia' ? '_03' : '_05'
              }.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                ascension >= 1 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
          <p className="text-sm font-bold">Ascension</p>
          <Tooltip
            title={talents?.a4?.title}
            body={<TooltipBody talent={talents?.a4} unlocked={ascension >= 4} />}
            style="w-[40vw]"
          >
            <img
              src={`https://enka.network/ui/UI_Talent_S_${codeName}_06.png`}
              className={classNames(
                'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                ascension >= 4 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
              )}
            />
          </Tooltip>
        </div>
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
              body={<TooltipBody talent={talents?.c1} unlocked={cons >= 1} />}
              style="w-[40vw]"
            >
              <img
                src={`https://enka.network/ui/UI_Talent_S_${codeName}${codeName === 'Shenhe' ? '_02' : '_01'}.png`}
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
              body={<TooltipBody talent={talents?.c6} unlocked={cons >= 6} />}
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
              body={<TooltipBody talent={talents?.c2} unlocked={cons >= 2} />}
              style="w-[40vw]"
            >
              <img
                src={`https://enka.network/ui/UI_Talent_S_${codeName}${
                  codeName === 'Ningguang' ? '_05' : codeName === 'Shenhe' ? '_01' : '_02'
                }.png`}
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
              body={<TooltipBody talent={talents?.c5} unlocked={cons >= 5} />}
              style="w-[25vw]"
            >
              <img
                src={`https://enka.network/ui/UI_Talent_U_${codeName}${
                  _.includes(ReverseConsList, codeName) ? '_01' : '_02'
                }.png`}
                className={classNames(
                  'shrink-0 w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                  cons >= 5 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
                )}
              />
            </Tooltip>
            <Tooltip
              title={talents?.c3?.title}
              body={<TooltipBody talent={talents?.c3} unlocked={cons >= 3} />}
              style="w-[25vw]"
            >
              <img
                src={`https://enka.network/ui/UI_Talent_U_${codeName}${
                  _.includes(ReverseConsList, codeName) ? '_02' : '_01'
                }.png`}
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
              body={<TooltipBody talent={talents?.c4} unlocked={cons >= 4} />}
              style="w-[40vw]"
            >
              <img
                src={`https://enka.network/ui/UI_Talent_S_${codeName}${codeName === 'Tartaglia' ? '_05' : '_03'}.png`}
                className={classNames(
                  'w-12 h-12 p-1 rounded-full bg-opacity-60 ring-2 ring-offset-2 hover:ring-offset-4 duration-200 ring-offset-primary-darker',
                  cons >= 4 ? iconColor[element] : 'bg-primary-light ring-primary-lighter opacity-50'
                )}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
)
