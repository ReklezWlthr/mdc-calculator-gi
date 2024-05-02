import { findBaseLevel, findMaxLevel } from '@src/core/utils/data_format'
import { useStore } from '@src/data/providers/app_store_provider'
import { AscensionOptions } from '@src/domain/genshin/constant'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'

interface StatBlockProps {
  index: number
}

export const WeaponBlock = observer((props: StatBlockProps) => {
  const { modalStore, teamStore } = useStore()
  const ascension = teamStore.characters[props.index]?.ascension || 0
  const level = teamStore.characters[props.index]?.level || 1
  const cons = teamStore.characters[props.index]?.cons || 0
  const rarity = teamStore.characters[props.index]?.rarity

  const levels = useMemo(
    () =>
      _.map(
        Array(findMaxLevel(ascension) - findBaseLevel(ascension) + 1 || 1).fill(findBaseLevel(ascension)),
        (item, index) => ({
          name: _.toString(item + index),
          value: _.toString(item + index),
        })
      ),
    [ascension]
  )

  const onOpenModal = useCallback(() => {}, [modalStore, props.index])

  return (
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark">
      <div className="flex justify-center px-5 py-3 text-xl rounded-t-lg bg-primary-lighter">Weapon</div>
      <div className="flex gap-x-3">
        <div className="w-1/2"></div>
        <div className="w-1/2 px-2 py-3 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Name</p>
              <div
                className={classNames('text-[10px]', {
                  'text-genshin-electro': rarity === 4,
                  'text-genshin-geo': rarity === 5,
                })}
              >
                {_.map(Array(rarity || 0), () => (
                  <span>✦</span>
                ))}
              </div>
            </div>
            <PillInput
              onClick={onOpenModal}
              value={teamStore.characters[props.index]?.name}
              disabled={!teamStore.characters[props.index]?.name}
            />
          </div>
          <div className="space-y-1">
            <p className="w-full text-sm font-semibold">Level</p>
            <div className="flex w-full gap-2">
              <SelectInput
                onChange={(value) => teamStore.setMemberInfo(props.index, { level: parseInt(value) || 0 })}
                options={levels}
                value={level?.toString()}
              />
              <SelectInput
                onChange={(value) =>
                  teamStore.setMemberInfo(props.index, {
                    ascension: parseInt(value) || 0,
                    level: findBaseLevel(parseInt(value) || 0),
                  })
                }
                options={AscensionOptions}
                value={ascension?.toString()}
                style="w-fit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
