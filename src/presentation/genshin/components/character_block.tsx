import { useStore } from '@src/data/providers/app_store_provider'
import { useCallback, useMemo } from 'react'
import { CharacterModal } from './character_modal'
import { observer } from 'mobx-react-lite'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import {
  AscensionOptions,
  ConstellationOptions,
  Element,
  ElementIcon,
  WeaponIcon,
  WeaponType,
} from '@src/domain/genshin/constant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { findBaseLevel } from '@src/core/utils/data_format'
import _ from 'lodash'
import { findMaxLevel } from '../../../core/utils/data_format'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'

interface CharacterBlockProps {
  index: number
}

export const CharacterBlock = observer((props: CharacterBlockProps) => {
  const { modalStore, teamStore } = useStore()
  const ascension = teamStore.characters[props.index]?.ascension || 0
  const level = teamStore.characters[props.index]?.level || 1
  const cons = teamStore.characters[props.index]?.cons || 0
  const rarity = teamStore.characters[props.index]?.data?.rarity

  const isEmpty = !teamStore.characters[props.index]?.data

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
    modalStore.openModal(<CharacterModal index={props.index} />)
  }, [modalStore, props.index])

  return (
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark">
      <div className="flex justify-center px-5 py-3 text-xl rounded-t-lg bg-primary-lighter">Character</div>
      <div className="flex">
        <div className="flex items-center w-1/2 px-5 py-3">
          <img
            src={`https://enka.network/ui/UI_AvatarIcon_${
              teamStore.characters[props.index]?.data?.codeName || 'Paimon'
            }.png`}
            className="w-full border rounded-lg bg-primary-darker border-primary-border"
          />
        </div>
        <div className="w-1/2 px-2 py-3 space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Name</p>
            <PillInput onClick={onOpenModal} value={teamStore.characters[props.index]?.data?.name} />
          </div>
          <div className="space-y-1">
            <p className="w-full text-sm font-semibold">Level</p>
            <div className="flex w-full gap-2">
              <SelectInput
                onChange={(value) => teamStore.setMemberInfo(props.index, { level: parseInt(value) || 0 })}
                options={levels}
                value={level?.toString()}
                disabled={isEmpty}
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
                disabled={isEmpty}
              />
              <SelectInput
                onChange={(value) =>
                  teamStore.setMemberInfo(props.index, {
                    cons: parseInt(value) || 0,
                  })
                }
                options={ConstellationOptions}
                value={cons?.toString()}
                style="w-fit"
                disabled={isEmpty}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 px-3 pt-1">
            <div className="flex gap-0.5">
              {/* <p className="[writing-mode:vertical-rl] rotate-180 text-[10px]">Weapon</p> */}
              <div className="p-1 rounded-full w-11 h-11 bg-primary">
                <img src={WeaponIcon[teamStore.characters[props.index]?.data?.weapon]} />
              </div>
            </div>
            <RarityGauge rarity={rarity} />
            <div className="flex gap-0.5">
              <div className="p-1 rounded-full w-11 h-11 bg-primary">
                <img src={ElementIcon[teamStore.characters[props.index]?.data?.element]} />
              </div>
              {/* <p className="[writing-mode:vertical-rl] text-[10px]">Element</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
