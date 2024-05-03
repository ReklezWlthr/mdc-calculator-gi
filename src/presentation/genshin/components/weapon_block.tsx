import { findBaseLevel, findMaxLevel } from '@src/core/utils/data_format'
import { useStore } from '@src/data/providers/app_store_provider'
import { AscensionOptions } from '@src/domain/genshin/constant'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { WeaponModal } from './weapon_modal'
import { useStat } from '@src/core/hooks/useStat'

interface StatBlockProps {
  index: number
}

export const WeaponBlock = observer((props: StatBlockProps) => {
  const { modalStore, teamStore } = useStore()
  const weapon = teamStore.characters[props.index]?.equipments?.weapon
  const ascension = weapon?.ascension || 0
  const level = weapon?.level || 1
  const refinement = weapon?.refinement || 1
  const rarity = weapon?.data?.rarity

  const { weaponBaseAtk, weaponSecondary } = useStat(props.index)

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

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<WeaponModal index={props.index} />)
  }, [modalStore, props.index])

  return (
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark h-1/2">
      <div className="flex justify-center px-5 py-2 text-xl rounded-t-lg bg-primary-lighter">Weapon</div>
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
              value={weapon?.data?.name}
              disabled={!teamStore.characters[props.index]?.data}
            />
          </div>
          <div className="space-y-1">
            <p className="w-full text-sm font-semibold">Level</p>
            <div className="flex w-full gap-2">
              <SelectInput
                onChange={(value) => teamStore.setWeapon(props.index, { level: parseInt(value) || 0 })}
                options={levels}
                value={level?.toString()}
              />
              <SelectInput
                onChange={(value) =>
                  teamStore.setWeapon(props.index, {
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
      <div className="px-4 pb-3 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <p className="shrink-0">Base ATK</p>
              <hr className="w-full border border-primary-border" />
              <p className="font-normal text-gray">{weaponBaseAtk}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <p className="shrink-0">{weapon?.data?.ascStat || 'N/A'}</p>
              <hr className="w-full border border-primary-border" />
              <p className="font-normal text-gray">{weaponSecondary?.formatted}</p>
            </div>
          </div>
    </div>
  )
})
