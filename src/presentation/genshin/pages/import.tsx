import { PrimaryButton } from '@src/presentation/components/primary.button'
import { observer } from 'mobx-react-lite'

export const ImportExport = observer(({ data }: { data }) => {
  const saveFile = async (blob: Blob, suggestedName: string) => {
    const blobURL = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobURL
    a.download = suggestedName
    a.style.display = 'none'
    document.body.append(a)
    a.click()
    // Revoke the blob URL and remove the element.
    setTimeout(() => {
      URL.revokeObjectURL(blobURL)
      a.remove()
    }, 1000)
  }

  return (
    <div>
      <div>Import</div>
      <input
        type="file"
        multiple={false}
        onChange={(event) => {
          const file = event.target.files[0]
          const reader = new FileReader()
          reader.addEventListener('load', (event) => {
            localStorage.setItem(`genshin_local_stage`, event.target.result.toString())
          })
          reader.readAsText(file)
        }}
      />
      <div>Export</div>
      <PrimaryButton
        title="Export"
        onClick={() => {
          const blob = new Blob([data], { type: 'text/json;charset=utf-8' })
          saveFile(blob, 'export.json')
        }}
      />
    </div>
  )
})
