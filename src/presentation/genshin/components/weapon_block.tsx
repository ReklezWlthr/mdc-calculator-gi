import { findBaseLevel, findMaxLevel } from '@src/core/utils/data_format'
import { useStore } from '@src/data/providers/app_store_provider'
import { AscensionOptions, RefinementOptions, StatIcons, Stats } from '@src/domain/genshin/constant'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import classNames from 'classnames'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { WeaponModal } from './weapon_modal'
import { useStat } from '@src/core/hooks/useStat'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { DefaultWeapon } from '@src/data/stores/team_store'

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
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark h-[300px]">
      <div className="flex justify-center px-5 py-2 rounded-t-lg bg-primary-lighter">Weapon</div>
      <div className="flex flex-col p-3 gap-y-3">
        <div className="flex items-center gap-2">
          <PillInput
            onClick={onOpenModal}
            onClear={() => teamStore.setWeapon(props.index, DefaultWeapon)}
            value={weapon?.data?.name}
            disabled={!teamStore.characters[props.index]?.data}
          />
          <SelectInput
            onChange={(value) =>
              teamStore.setWeapon(props.index, {
                refinement: parseInt(value) || 1,
              })
            }
            options={RefinementOptions}
            value={refinement?.toString()}
            style="w-fit"
            disabled={!weapon?.data || weapon?.data?.name === 'Kagotsurube Isshin'}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col justify-between w-1/2 gap-1">
            <img
              src={`https://enka.network/ui/${weapon?.data?.icon || 'UI_EquipIcon_Sword_Blunt'}${
                ascension >= 2 ? '_Awaken' : ''
              }.png`}
              className="pt-1 border rounded-lg bg-primary-darker border-primary-border"
            />
            <RarityGauge rarity={rarity} />
          </div>
          <div className="w-1/2 space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Level</p>
              <div className="flex items-center w-full gap-2">
                <SelectInput
                  onChange={(value) => teamStore.setWeapon(props.index, { level: parseInt(value) || 0 })}
                  options={levels}
                  value={level?.toString()}
                  disabled={!weapon?.data}
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
                  disabled={!weapon?.data}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <img className="w-4 h-4" src={`/icons/${StatIcons[Stats.ATK]}`} />
              <p>Base ATK</p>
            </div>
            <hr className="w-full border border-primary-border" />
            <p className="font-normal text-gray">{weaponBaseAtk}</p>
          </div>
          {weapon?.data && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 shrink-0">
                <img className="w-4 h-4" src={`/icons/${StatIcons[weapon?.data?.ascStat]}`} />
                {weapon?.data?.ascStat || 'N/A'}
              </div>
              <hr className="w-full border border-primary-border" />
              <p className="font-normal text-gray">{weaponSecondary?.formatted}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
