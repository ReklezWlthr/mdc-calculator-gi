import { useStore } from '@src/data/providers/app_store_provider'
import { useCallback, useMemo } from 'react'
import { CharacterModal } from './character_modal'
import { observer } from 'mobx-react-lite'
import { PillInput } from '@src/presentation/components/inputs/pill_input'
import { AscensionOptions, ConstellationOptions, ITeamChar, WeaponIcon } from '@src/domain/constant'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import { findBaseLevel } from '@src/core/utils/data_format'
import _ from 'lodash'
import { findMaxLevel } from '../../../core/utils/data_format'
import classNames from 'classnames'
import { RarityGauge } from '@src/presentation/components/rarity_gauge'
import { DefaultCharacter } from '@src/data/stores/team_store'
import { findCharacter } from '@src/core/utils/finder'

interface CharacterBlockProps {
  index: number
  override?: ITeamChar[]
  disabled?: boolean
}

export const CharacterBlock = observer((props: CharacterBlockProps) => {
  const { modalStore, teamStore, settingStore } = useStore()
  const selectedChar = props.override?.[props.index] || teamStore.characters[props.index]
  const ascension = selectedChar?.ascension || 0
  const level = selectedChar?.level || 1
  const cons = selectedChar?.cons || 0

  const characterData = findCharacter(selectedChar?.cId)
  const rarity = characterData?.rarity

  const isEmpty = !characterData

  const codeName =
    characterData?.codeName === 'Player' ? settingStore.settings.travelerGender : characterData?.codeName || 'Paimon'

  const levels = useMemo(
    () =>
      _.map(
        Array(findMaxLevel(ascension) - findBaseLevel(ascension) + 1 || 1).fill(findBaseLevel(ascension)),
        (item, index) => ({
          name: _.toString(item + index),
          value: _.toString(item + index),
        })
      ).reverse(),
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
            src={`https://enka.network/ui/UI_AvatarIcon_${codeName}.png`}
            className="object-contain w-full border rounded-lg bg-primary-darker border-primary-border aspect-square"
          />
        </div>
        <div className="w-1/2 px-2 py-3 space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Name</p>
            <PillInput
              onClick={onOpenModal}
              value={characterData?.name}
              onClear={() => teamStore.setMember(props.index, DefaultCharacter)}
              disabled={props.disabled}
            />
          </div>
          <div className="space-y-1">
            <p className="w-full text-sm font-semibold">Level</p>
            <div className="flex w-full gap-2">
              <SelectInput
                onChange={(value) => teamStore.setMemberInfo(props.index, { level: parseInt(value) || 0 })}
                options={levels}
                value={level?.toString()}
                disabled={isEmpty || props.disabled}
              />
              <SelectInput
                onChange={(value) => {
                  const max = _.max([1, (parseInt(value) - 1) * 2])
                  teamStore.setMemberInfo(props.index, {
                    ascension: parseInt(value) || 0,
                    level: findBaseLevel(parseInt(value) || 0),
                  })
                  _.forEach(teamStore.characters[props.index]?.talents, (item, key: 'normal' | 'skill' | 'burst') => {
                    if (item > max) teamStore.setTalentLevel(props.index, key, max)
                  })
                }}
                options={AscensionOptions}
                value={ascension?.toString()}
                style="w-fit"
                disabled={isEmpty || props.disabled}
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
                disabled={isEmpty || props.disabled || characterData?.id === '10000062'}
              />
            </div>
          </div>
          {characterData && (
            <div className="flex items-center justify-between gap-2 px-3 pt-1">
              <div className="flex gap-0.5">
                <div className="p-1 rounded-full w-11 h-11 bg-primary" title={characterData?.weapon}>
                  <img src={`https://enka.network/ui/${WeaponIcon[characterData?.weapon]}`} />
                </div>
              </div>
              <RarityGauge rarity={rarity} />
              <div className="flex gap-0.5">
                <div className="p-2 rounded-full w-11 h-11 bg-primary" title={characterData?.element}>
                  <img
                    src={`https://cdn.wanderer.moe/genshin-impact/elements/${characterData?.element?.toLowerCase()}.png`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
