import { useLocalUpdater } from '@src/core/hooks/useLocalUpdater'
import { WuWaPage } from '@src/domain/wuwa/constant'
import { useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { observer } from 'mobx-react-lite'
import { TeamSetup } from './team_setup'

const InternalPage = ({ page }: { page: WuWaPage }) => {
  switch (page) {
    case WuWaPage.TEAM:
      return <TeamSetup />
    default:
      return
  }
}

export const WuWaHome = observer(() => {
  const [page, setPage] = useState<WuWaPage>(WuWaPage.TEAM)

  useLocalUpdater('wuwa')

  return (
    <div className="flex flex-shrink w-full h-full overflow-y-auto">
      <Sidebar onChange={setPage} currentPage={page} />
      <InternalPage page={page} />
    </div>
  )
})
