import { useCallback, useState } from 'react'
import { CharacterBlock } from '../components/character_block'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { StatBlock } from '../components/stat_block'
import { WeaponBlock } from '../components/weapon_block'
import { ArtifactBlock } from '../components/artifact_block'
import { useStore } from '@src/data/providers/app_store_provider'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { TextInput } from '@src/presentation/components/inputs/text_input'
import { GhostButton } from '@src/presentation/components/ghost.button'
import { BuildModal } from '../components/build_modal'
import { findCharacter } from '@src/core/utils/finder'

const CharacterSelect = ({
  onClick,
  isSelected,
  codeName,
}: {
  onClick: () => void
  isSelected: boolean
  codeName: string
}) => {
  return (
    <div
      className={classNames(
        'w-12 h-12 rounded-full cursor-pointer bg-primary duration-200 relative shrink-0',
        isSelected ? 'ring-4 ring-primary-lighter' : 'hover:ring-2 ring-primary-light'
      )}
      onClick={onClick}
    >
      <img
        src={codeName ? `https://enka.network/ui/UI_AvatarIcon_Side_${codeName}.png` : ''}
        className="absolute scale-150 bottom-3"
      />
    </div>
  )
}

const SaveBuildModal = observer(({ index }: { index: number }) => {
  const [name, setName] = useState('')

  const { modalStore, teamStore, buildStore } = useStore()

  const onSaveBuild = useCallback(() => {
    const id = crypto.randomUUID()
    const character = teamStore.characters[index]

    if (name) {
      const pass = buildStore.saveBuild({
        id,
        name,
        cId: character?.cId,
        isDefault: false,
        ...character?.equipments,
      })
      if (pass) {
        buildStore.setDefault(id)
        modalStore.closeModal()
      }
    }
  }, [index, name])

  return (
    <div className="px-5 py-3 space-y-3 text-white rounded-lg bg-primary-dark">
      <div className="space-y-1">
        <p className="font-semibold">
          Build Name<span className="text-genshin-pyro">*</span>
        </p>
        <TextInput onChange={setName} value={name} />
      </div>
      <div className="flex justify-end gap-2">
        <GhostButton title="Cancel" onClick={() => modalStore.closeModal()} />
        <PrimaryButton title="Confirm" onClick={onSaveBuild} />
      </div>
    </div>
  )
})

export const TeamSetup = observer(() => {
  const [selected, setSelected] = useState(0)

  const { teamStore, modalStore } = useStore()

  const onOpenSaveModal = useCallback(() => {
    modalStore.openModal(<SaveBuildModal index={selected} />)
  }, [selected])

  const onOpenBuildModal = useCallback(() => {
    modalStore.openModal(<BuildModal index={selected} />)
  }, [selected])

  return (
    <div className="flex justify-center w-5/6 gap-5 p-5 overflow-y-auto">
      <div className="w-1/3">
        <div className="flex justify-center w-full gap-4 pt-1 pb-3">
          {_.map(teamStore?.characters, (item, index) => {
            const data = findCharacter(item.cId)

            return (
              <CharacterSelect
                key={`char_select_${index}`}
                onClick={() => setSelected(index)}
                isSelected={index === selected}
                codeName={data?.codeName}
              />
            )
          })}
        </div>
        <CharacterBlock index={selected} />
        <div className="flex gap-x-2">
          <PrimaryButton title="Equip Build" onClick={onOpenBuildModal} />
          <PrimaryButton title="Save Build" onClick={onOpenSaveModal} />
          <PrimaryButton title="Unequip All" onClick={() => teamStore.unequipAll(selected)} />
        </div>
        <div className="h-5" />
        <StatBlock index={selected} />
      </div>
      <div className="w-1/5 space-y-5">
        <WeaponBlock index={selected} {...teamStore.characters[selected]?.equipments?.weapon} />
        <ArtifactBlock index={selected} piece={5} aId={teamStore.characters[selected]?.equipments?.artifacts?.[4]} />
      </div>
      <div className="w-1/5 space-y-5">
        <ArtifactBlock index={selected} piece={4} aId={teamStore.characters[selected]?.equipments?.artifacts?.[3]} />
        <ArtifactBlock index={selected} piece={1} aId={teamStore.characters[selected]?.equipments?.artifacts?.[0]} />
      </div>
      <div className="w-1/5 space-y-5">
        <ArtifactBlock index={selected} piece={2} aId={teamStore.characters[selected]?.equipments?.artifacts?.[1]} />
        <ArtifactBlock index={selected} piece={3} aId={teamStore.characters[selected]?.equipments?.artifacts?.[2]} />
      </div>
    </div>
  )
})
