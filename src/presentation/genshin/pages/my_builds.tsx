import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { BuildBlock } from '../components/build_block'
import { WeaponBlock } from '../components/weapon_block'
import { useMemo, useState } from 'react'
import { ArtifactBlock } from '../components/artifact_block'
import { findCharacter } from '@src/core/utils/finder'
import { TextInput } from '@src/presentation/components/inputs/text_input'

export const MyBuilds = observer(() => {
  const { artifactStore, modalStore, buildStore } = useStore()
  const { params, setParams } = useParams({
    searchWord: '',
  })

  const [selected, setSelected] = useState('')
  const selectedBuild = useMemo(() => _.find(buildStore.builds, ['id', selected]), [selected])

  const builds = params.searchWord
    ? _.filter(
        buildStore.builds,
        (item) =>
          _.includes(findCharacter(item.cId)?.name?.toLowerCase(), params.searchWord.toLowerCase()) ||
          _.includes(item.name.toLowerCase(), params.searchWord.toLowerCase())
      )
    : buildStore.builds
  const groupedBuild = _.groupBy(builds, 'cId')

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 max-w-[1200px] mx-auto">
      <div className="flex w-full h-full gap-x-5">
        <div className="flex flex-col w-1/3 h-full gap-2 shrink-0">
          <div className="flex items-center gap-6">
            <p className="text-2xl font-bold text-white shrink-0">My Builds</p>
            <TextInput
              value={params.searchWord}
              onChange={(v) => setParams({ searchWord: v })}
              placeholder={`Search for Build's Name or Owner`}
            />
          </div>
          <div className="flex flex-col w-full h-full gap-2 pr-1 overflow-y-auto rounded-lg customScrollbar">
            {_.size(buildStore.builds) ? (
              _.map(groupedBuild, (build, owner) => (
                <BuildBlock
                  key={_.join(_.map(build, 'id'), '_')}
                  owner={owner}
                  build={build}
                  onClick={setSelected}
                  selected={selected}
                />
              )).sort((a, b) => findCharacter(a.props.owner)?.name?.localeCompare(findCharacter(b.props.owner)?.name))
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-lg bg-primary-darker text-gray">
                No Saved Build
              </div>
            )}
          </div>
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
