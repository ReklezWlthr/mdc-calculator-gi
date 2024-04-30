import { useState } from 'react'
import { CharacterBlock } from '../components/character_block'
import _ from 'lodash'

const CharacterSelect = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full rounded-lg cursor-pointer bg-primary-dark" onClick={onClick}>
      1
    </div>
  )
}

export const TeamSetup = () => {
  const [selected, setSelected] = useState(0)
  const [team, setTeam] = useState(Array(4))

  return (
    <div className="flex w-5/6 gap-5 p-5 overflow-y-scroll">
      <div className="w-1/4">
        <p className="flex justify-center font-semibold text-white">Team Members</p>
        <div className="flex w-full gap-2 pt-1 pb-3">
          {_.map(team, (item, index) => (
            <CharacterSelect onClick={() => setSelected(index)} />
          ))}
        </div>
        <CharacterBlock name={""} />
      </div>
    </div>
  )
}
