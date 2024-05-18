import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { ArtifactBlock } from './artifact_block'
import classNames from 'classnames'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { useMemo } from 'react'
import { SelectTextInput } from '@src/presentation/components/inputs/select_text_input'
import { TagSelectInput } from '@src/presentation/components/inputs/tag_select_input'
import { ArtifactSets } from '@src/data/db/genshin/artifacts'
import { MainStatOptions, SubStatOptions } from '@src/domain/genshin/constant'
import { isSubsetOf } from '@src/core/utils/finder'

export const ArtifactListModal = observer(({ index, type }: { index: number; type: number }) => {
  const { params, setParams } = useParams({
    main: [],
    subs: [],
    set: null,
    type,
  })

  const { artifactStore, modalStore, teamStore } = useStore()

  const filteredArtifacts = useMemo(() => {
    let result = _.filter(artifactStore.artifacts, (artifact) => params.type === artifact.type)
    if (params.set) result = _.filter(result, (artifact) => artifact.setId === params.set)
    if (params.main.length) result = _.filter(result, (artifact) => _.includes(params.main, artifact.main))
    if (params.subs.length)
      result = _.filter(result, (artifact) => isSubsetOf(params.subs, _.map(artifact.subList, 'stat')))
    return result
  }, [params.set, params.subs, params.main])

  return (
    <div className="w-[65vw] p-4 text-white rounded-xl bg-primary-darker space-y-4">
      <div className="flex items-center justify-between w-full">
        <p className="text-lg font-bold">Choose an artifact</p>
        <div className="flex items-center gap-3">
          <SelectTextInput
            value={params.set}
            options={_.map(ArtifactSets, (artifact) => ({
              name: artifact.name,
              value: artifact.id.toString(),
              img: `https://enka.network/ui/${artifact.icon}_4.png`,
            }))}
            placeholder="Artifact Set"
            onChange={(value) => setParams({ set: value?.value })}
            style="w-[220px]"
          />
          <TagSelectInput
            values={params.main}
            options={MainStatOptions}
            onChange={(main) => setParams({ main })}
            placeholder="Main Stat"
            renderAsText
            style="w-[220px]"
          />
          <TagSelectInput
            values={params.subs}
            options={SubStatOptions}
            onChange={(subs) => setParams({ subs })}
            placeholder="Sub Stats"
            renderAsText
            maxSelection={4}
            style="w-[220px]"
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto hideScrollbar rounded-lg">
        {_.map(filteredArtifacts, (artifact) => (
          <div
            key={artifact.id}
            className="hover:scale-[97%] duration-200 cursor-pointer"
            onClick={() => {
              _.forEach(teamStore?.characters, (char, i) => {
                if (i !== index && _.includes(char.equipments?.artifacts, artifact.id))
                  teamStore.setArtifact(i, type, null)
              })
              teamStore.setArtifact(index, type, artifact.id)
              modalStore.closeModal()
            }}
          >
            <ArtifactBlock piece={artifact?.type} aId={artifact?.id} showWearer canEdit={false} />
          </div>
        ))}
      </div>
    </div>
  )
})
