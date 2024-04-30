interface CharacterModalProps {
  onChange: () => void
}

export const CharacterModal = ({ onChange }: CharacterModalProps) => {
  return (
    <div className="p-4 text-white rounded-xl bg-primary-dark">
      <p>Select a Character</p>
      <div className="flex"></div>
    </div>
  )
}
