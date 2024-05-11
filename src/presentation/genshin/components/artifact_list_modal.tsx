import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { ArtifactBlock } from './artifact_block'
import classNames from 'classnames'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { useMemo } from 'react'

export const ArtifactListModal = observer(({ index, type }: { index: number; type: number }) => {
  const { params, setParams } = useParams({
    type,
    set: null,
  })

  const { artifactStore, modalStore, teamStore } = useStore()

  const filteredArtifacts = useMemo(() => {
    if (!params.set && params.type === 0) return artifactStore.artifacts
    let result = artifactStore.artifacts
    if (params.set) result = _.filter(result, (artifact) => artifact.setId === params.set)
    if (params.type) result = _.filter(result, (artifact) => params.type === artifact.type)
    return result
  }, [params.set, params.type])

  return (
    <div className="w-[65vw] p-4 text-white rounded-xl bg-primary-darker space-y-2">
      <p className="text-lg font-bold">Choose an artifact</p>
      <div className="grid w-full grid-cols-4 gap-4">
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
