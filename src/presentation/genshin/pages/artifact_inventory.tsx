import { useCallback, useMemo } from 'react'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { ArtifactBlock } from '../components/artifact_block'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { SelectTextInput } from '@src/presentation/components/inputs/select_text_input'
import { ArtifactModal } from '../components/artifact_modal'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { ArtifactSets } from '@src/data/db/genshin/artifacts'

export const ArtifactInventory = observer(() => {
  const { params, setParams } = useParams({
    types: [],
    set: null,
  })

  const { artifactStore, modalStore } = useStore()

  const TypeButton = ({ icon, buttonType }: { icon: string; buttonType: number }) => {
    const checked = _.includes(params.types, buttonType)

    return (
      <div
        className={classNames('w-10 h-10 p-2 duration-200 rounded-full cursor-pointer hover:bg-primary-lighter', {
          'bg-primary-lighter': _.includes(params.types, buttonType),
        })}
        onClick={() =>
          setParams({ types: checked ? _.without(params.types, buttonType) : [...params.types, buttonType] })
        }
      >
        <img src={icon} />
      </div>
    )
  }

  const filteredArtifacts = useMemo(() => {
    if (!params.set && params.types.length === 0) return artifactStore.artifacts
    let result = artifactStore.artifacts
    if (params.set) result = _.filter(result, (artifact) => artifact.setId === params.set)
    if (params.types.length) result = _.filter(result, (artifact) => _.includes(params.types, artifact.type))
    return result
  }, [params.set, params.types])

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<ArtifactModal type={4} />)
  }, [modalStore])

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 overflow-y-scroll">
      <div className="flex items-center justify-between w-full">
        <p className="text-2xl font-bold text-white w-fit">Artifact Inventory</p>
        <div className="flex gap-5">
          <div className="flex justify-center gap-2">
            <TypeButton icon="/icons/flower_of_life.png" buttonType={4} />
            <TypeButton icon="/icons/plume_of_death.png" buttonType={2} />
            <TypeButton icon="/icons/sands_of_eon.png" buttonType={5} />
            <TypeButton icon="/icons/goblet_of_eonothem.png" buttonType={1} />
            <TypeButton icon="/icons/circlet_of_logos.png" buttonType={3} />
          </div>
          <SelectTextInput
            value={params.set}
            options={_.map(ArtifactSets, (artifact) => ({
              name: artifact.name,
              value: artifact.id.toString(),
              img: `https://enka.network/ui/${artifact.icon}_4.png`,
            }))}
            placeholder="Artifact Set"
            onChange={(value) => setParams({ set: value?.value })}
            style="w-[300px]"
          />
          <PrimaryButton title="Add New Artifact" onClick={onOpenModal} />
        </div>
      </div>
      <div className="grid w-full grid-cols-5 gap-4">
        {_.map(filteredArtifacts, (artifact) => (
          <ArtifactBlock key={artifact.id} piece={artifact?.type} aId={artifact?.id} showWearer />
        ))}
      </div>
    </div>
  )
})
