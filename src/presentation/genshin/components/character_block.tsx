import { useStore } from '@src/data/providers/app_store_provider'
import { useCallback, useMemo } from 'react'
import { CharacterModal } from './character_modal'
import { observer } from 'mobx-react-lite'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { AscensionOptions, ConstellationOptions, ElementIcon, WeaponIcon } from '@src/domain/genshin/constant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { findBaseLevel } from '@src/core/utils/data_format'
import _ from 'lodash'
import { findMaxLevel } from '../../../core/utils/data_format'
import classNames from 'classnames'

interface CharacterBlockProps {
  index: number
}

export const CharacterBlock = observer((props: CharacterBlockProps) => {
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

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<CharacterModal index={props.index} />)
  }, [modalStore, props.index])

  return (
    <div className="w-full font-bold text-white rounded-lg bg-primary-dark">
      <div className="flex justify-center px-5 py-3 text-xl rounded-t-lg bg-primary-lighter">Character</div>
      <div className="flex gap-x-3">
        <div className="w-1/2"></div>
        <div className="w-1/2 px-2 py-3 space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Name</p>
            <PillInput onClick={onOpenModal} value={teamStore.characters[props.index]?.name} />
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
              <SelectInput
                onChange={(value) =>
                  teamStore.setMemberInfo(props.index, {
                    cons: parseInt(value) || 0,
                  })
                }
                options={ConstellationOptions}
                value={cons?.toString()}
                style="w-fit"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex gap-0.5">
              <p className="[writing-mode:vertical-rl] rotate-180 text-[10px]">Weapon</p>
              <div className="w-10 h-10 rounded-lg bg-primary-light">
                <img src={WeaponIcon[teamStore.characters[props.index]?.weapon]} />
              </div>
            </div>
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
            <div className="flex gap-0.5">
              <div className="w-10 h-10 rounded-lg bg-primary-light">
                <img src={ElementIcon[teamStore.characters[props.index]?.element]} />
              </div>
              <p className="[writing-mode:vertical-rl] text-[10px]">Element</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
