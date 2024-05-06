import { PrimaryButton } from '@src/presentation/components/primary.button'
import { observer } from 'mobx-react-lite'

export const ImportExport = observer(({ data, updateData }: { data; updateData: (data) => void }) => {
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
    <div className="flex w-full gap-5 p-5 overflow-y-scroll text-white">
      <div className="w-1/5 space-y-2">
        <div className="font-bold">Import</div>
        <PrimaryButton
          title="Import"
          onClick={() => {
            document.getElementById('importer').click()
          }}
        />
        <input
          id="importer"
          className="hidden"
          type="file"
          multiple={false}
          onChange={(event) => {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', (event) => {
              localStorage.setItem(`genshin_local_storage`, event.target.result.toString())
              updateData(event.target.result)
            })
            reader.readAsText(file)
          }}
        />
      </div>
      <div className="w-1/5 space-y-2">
        <div className="font-bold">Export</div>
        <PrimaryButton
          title="Export"
          onClick={() => {
            const blob = new Blob([data], { type: 'text/json;charset=utf-8' })
            saveFile(blob, 'export.json')
          }}
        />
      </div>
    </div>
  )
})
