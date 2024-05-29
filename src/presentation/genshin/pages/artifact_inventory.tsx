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
import { MainStatOptions, Stats, SubStatOptions } from '@src/domain/genshin/constant'
import { TagSelectInput } from '@src/presentation/components/inputs/tag_select_input'
import { isSubsetOf } from '@src/core/utils/finder'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const ArtifactInventory = observer(() => {
  const { params, setParams } = useParams({
    types: [],
    set: null,
    main: [],
    subs: [],
  })

  const { artifactStore, modalStore } = useStore()

  const TypeButton = ({ field, icon, value }: { field: string; icon: string; value: string | number }) => {
    const checked = _.includes(params[field], value)

    return (
      <div
        className={classNames('w-10 h-10 p-2 duration-200 rounded-full cursor-pointer hover:bg-primary-light', {
          'bg-primary-light': _.includes(params[field], value),
        })}
        onClick={() => setParams({ [field]: checked ? _.without(params[field], value) : [...params[field], value] })}
      >
        <img src={icon} />
      </div>
    )
  }

  const filteredArtifacts = useMemo(() => {
    let result = artifactStore.artifacts
    if (params.set) result = _.filter(result, (artifact) => artifact.setId === params.set)
    if (params.types.length) result = _.filter(result, (artifact) => _.includes(params.types, artifact.type))
    if (params.main.length) result = _.filter(result, (artifact) => _.includes(params.main, artifact.main))
    if (params.subs.length)
      result = _.filter(result, (artifact) => isSubsetOf(params.subs, _.map(artifact.subList, 'stat')))
    return result
  }, [params.set, params.types, params.subs, params.main, artifactStore.artifacts])

  const onOpenModal = useCallback(() => {
    modalStore.openModal(<ArtifactModal type={4} />)
  }, [modalStore])

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 overflow-y-auto">
      <div className="flex items-center justify-between w-full">
        <p className="text-2xl font-bold text-white w-fit">Artifact Inventory</p>
        <PrimaryButton title="Add New Artifact" onClick={onOpenModal} />
      </div>
      <div className="w-full space-y-1">
        <div className="flex items-center w-full gap-3">
          <div className="flex justify-center gap-2">
            <TypeButton field="types" icon={`${publicRuntimeConfig.BASE_PATH}/icons/flower_of_life.png`} value={4} />
            <TypeButton field="types" icon={`${publicRuntimeConfig.BASE_PATH}/icons/plume_of_death.png`} value={2} />
            <TypeButton field="types" icon={`${publicRuntimeConfig.BASE_PATH}/icons/sands_of_eon.png`} value={5} />
            <TypeButton
              field="types"
              icon={`${publicRuntimeConfig.BASE_PATH}/icons/goblet_of_eonothem.png`}
              value={1}
            />
            <TypeButton field="types" icon={`${publicRuntimeConfig.BASE_PATH}/icons/circlet_of_logos.png`} value={3} />
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
          <TagSelectInput
            values={params.main}
            options={_.map(MainStatOptions, (item) => ({ ...item, img: publicRuntimeConfig.BASE_PATH + item.img }))}
            onChange={(main) => setParams({ main })}
            placeholder="Main Stat"
            renderAsText
            style="w-[300px]"
          />
          <TagSelectInput
            values={params.subs}
            options={_.map(SubStatOptions, (item) => ({ ...item, img: publicRuntimeConfig.BASE_PATH + item.img }))}
            onChange={(subs) => setParams({ subs })}
            placeholder="Sub Stats"
            renderAsText
            maxSelection={4}
            style="w-[300px]"
          />
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
