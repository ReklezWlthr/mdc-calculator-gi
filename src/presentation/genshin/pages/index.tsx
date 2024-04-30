import { useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { TeamSetup } from './team_setup'
import { GenshinPage } from '@src/domain/genshin'

const InternalPage = ({ page }: { page: GenshinPage }) => {
  switch (page) {
    case GenshinPage.TEAM:
      return <TeamSetup />
    default:
      return
  }
}

export const GenshinHome = () => {
  const [page, setPage] = useState<GenshinPage>(GenshinPage.TEAM)

  return (
    <div className="flex w-full h-[calc(100vh-68px)]">
      <Sidebar onChange={setPage} />
      <InternalPage page={page} />
    </div>
  )
}
