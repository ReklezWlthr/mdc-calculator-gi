import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { BuildBlock } from '../components/build_block'
import { WeaponBlock } from '../components/weapon_block'
import { useMemo, useState } from 'react'
import { ArtifactBlock } from '../components/artifact_block'

export const MyBuilds = observer(() => {
  const { artifactStore, modalStore, buildStore } = useStore()
  const { params, setParams } = useParams({
    types: [],
    set: null,
  })

  const [selected, setSelected] = useState('')
  const selectedBuild = useMemo(() => _.find(buildStore.builds, ['id', selected]), [selected])

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 max-w-[1240px] mx-auto">
      <div className="flex w-full h-full gap-x-5">
        <div className="flex flex-col w-1/3 h-full gap-2 overflow-y-auto rounded-lg shrink-0 hideScrollbar">
          {_.map(buildStore.builds, (build) => (
            <BuildBlock key={build.id} build={build} onClick={() => setSelected(build.id)} />
          ))}
        </div>
        {selected ? (
          <>
            <div className="w-1/5 space-y-5">
              <WeaponBlock {...selectedBuild?.weapon} />
              <ArtifactBlock piece={5} aId={selectedBuild?.artifacts?.[4]} canEdit={false} />
            </div>
            <div className="w-1/5 space-y-5">
              <ArtifactBlock piece={4} aId={selectedBuild?.artifacts?.[3]} canEdit={false} />
              <ArtifactBlock piece={1} aId={selectedBuild?.artifacts?.[0]} canEdit={false} />
            </div>
            <div className="w-1/5 space-y-5">
              <ArtifactBlock piece={2} aId={selectedBuild?.artifacts?.[1]} canEdit={false} />
              <ArtifactBlock piece={3} aId={selectedBuild?.artifacts?.[2]} canEdit={false} />
            </div>
          </>
        ) : (
          <div className="w-full h-[620px] rounded-lg bg-primary-darker flex items-center justify-center text-gray text-2xl font-bold">
            Selected a Build to Preview
          </div>
        )}
      </div>
    </div>
  )
})
