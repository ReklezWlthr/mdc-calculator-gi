import { useCallback, useMemo, useState } from 'react'
import { CharacterBlock } from '../components/character_block'
import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { StatBlock } from '../components/stat_block'
import { WeaponBlock } from '../components/weapon_block'
import { ArtifactBlock } from '../components/artifact_block'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
import { SelectTextInput } from '@src/presentation/components/inputs/select_text_input'
import { ArtifactSets } from '@src/domain/genshin/artifact'
import { ArtifactModal } from '../components/artifact_modal'
import { PrimaryButton } from '@src/presentation/components/primary.button'
import { BuildBlock } from '../components/build_block'

export const MyBuilds = observer(() => {
  const { params, setParams } = useParams({
    types: [],
    set: null,
  })

  const { artifactStore, modalStore, buildStore } = useStore()

  return (
    <div className="flex flex-col items-center w-full gap-5 p-5 overflow-y-scroll">
      <div className="flex items-center justify-between w-full">
        <p className="text-2xl font-bold text-white w-fit">My Builds</p>
      </div>
      <div className='flex flex-col w-1/3 gap-2'>
        {_.map(buildStore.builds, (build) => (
          <BuildBlock key={build.id} build={build} />
        ))}
      </div>
      
    </div>
  )
})
