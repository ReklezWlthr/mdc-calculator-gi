import { ArtifactSets } from '@src/domain/genshin/artifact'
import { SelectInput } from '@src/presentation/components/inputs/select_input'
import _ from 'lodash'

export const ArtifactModal = () => {
  return (
    <div className="w-[500px] p-4 space-y-3 font-semibold text-white rounded-xl bg-primary-dark">
      <SelectInput
        options={_.map(ArtifactSets, (artifact) => ({
          name: artifact.name,
          value: artifact.id.toString(),
          img: `https://enka.network/ui/${artifact.icon}_4.png`,
        }))}
        onChange={() => null}
        placeholder='Artifact Set'
      />
    </div>
  )
}
