import { useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { TeamSetup } from './team_setup'
import { GenshinPage } from '@src/domain/genshin/constant'
import { useLocalUpdater } from '@src/core/hooks/useLocalUpdater'
import { observer } from 'mobx-react-lite'
import { ArtifactInventory } from './artifact_inventory'

const InternalPage = ({ page }: { page: GenshinPage }) => {
  switch (page) {
    case GenshinPage.TEAM:
      return <TeamSetup />
    case GenshinPage.INVENTORY:
      return <ArtifactInventory />
    default:
      return
  }
}

export const GenshinHome = observer(() => {
  const [page, setPage] = useState<GenshinPage>(GenshinPage.TEAM)

  useLocalUpdater('genshin')

  return (
    <div className="flex w-full h-[calc(100vh-68px)]">
      <Sidebar onChange={setPage} currentPage={page} />
      <InternalPage page={page} />
    </div>
  )
})
