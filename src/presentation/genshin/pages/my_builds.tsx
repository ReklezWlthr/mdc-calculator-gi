import _ from 'lodash'
import { observer } from 'mobx-react-lite'
import { useStore } from '@src/data/providers/app_store_provider'
import { useParams } from '@src/core/hooks/useParams'
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
      <div className="flex flex-col w-1/3 gap-2">
        {_.map(buildStore.builds, (build) => (
          <BuildBlock key={build.id} build={build} />
        ))}
      </div>
    </div>
  )
})
