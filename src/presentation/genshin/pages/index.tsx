import { useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { TeamSetup } from './team_setup'
import { GenshinPage } from '@src/domain/genshin/constant'
import { useLocalUpdater } from '@src/core/hooks/useLocalUpdater'
import { observer } from 'mobx-react-lite'
import { ArtifactInventory } from './artifact_inventory'
import { MyBuilds } from './my_builds'
import { ImportExport } from './import'

const InternalPage = ({ page }: { page: GenshinPage }) => {
  const data = useLocalUpdater('genshin')

  switch (page) {
    case GenshinPage.TEAM:
      return <TeamSetup />
    case GenshinPage.INVENTORY:
      return <ArtifactInventory />
    case GenshinPage.MY_CHAR:
      return <MyBuilds />
    case GenshinPage.IMPORT:
      return <ImportExport data={data} />
    default:
      return
  }
}

export const GenshinHome = observer(() => {
  const [page, setPage] = useState<GenshinPage>(GenshinPage.TEAM)

  return (
    <div className="flex w-full h-[calc(100vh-68px)]">
      <Sidebar onChange={setPage} currentPage={page} />
      <InternalPage page={page} />
    </div>
  )
})
