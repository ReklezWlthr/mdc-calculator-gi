import { GenshinPage } from '@src/domain/genshin'

const Pill = ({ name, onClick }: { name: string; onClick: () => void }) => {
  return (
    <div
      className="px-4 py-3 text-sm font-semibold text-white duration-200 rounded-lg cursor-pointer hover:bg-primary-dark"
      onClick={onClick}
    >
      {name}
    </div>
  )
}

export const Sidebar = ({ onChange }: { onChange: (page: GenshinPage) => void }) => {
  return (
    <div className="w-1/6 p-2 bg-primary-darker">
      <p className='p-3 font-bold text-white'>Menu</p>
      <Pill name="Team Setup" onClick={() => onChange(GenshinPage.TEAM)} />
      <Pill name="Damage Calculator" onClick={() => onChange(GenshinPage.DMG)} />
      <Pill name="ER Requirement" onClick={() => onChange(GenshinPage.ER)} />
      <Pill name="Import" onClick={() => onChange(GenshinPage.IMPORT)} />
    </div>
  )
}
