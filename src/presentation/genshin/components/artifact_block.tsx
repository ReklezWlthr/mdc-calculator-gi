import { observer } from 'mobx-react-lite'

interface ArtifactBlockProps {
  index: number
  piece: number
}

export const ArtifactBlock = observer((props: ArtifactBlockProps) => {
  return <div className="w-full font-bold text-white rounded-lg bg-primary-dark h-1/2">
    Test
  </div>
})
