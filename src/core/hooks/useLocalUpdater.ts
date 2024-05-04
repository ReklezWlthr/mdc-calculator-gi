import { useStore } from '@src/data/providers/app_store_provider'
import { useEffect, useState } from 'react'

export const useLocalUpdater = (game: string) => {
  const { teamStore } = useStore()
  const [hydrated, setHydrated] = useState(false)

  const teamKey = `${game}_local_char`
  const aInventoryKey = `${game}_artifact_inventory`

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(teamKey, JSON.stringify(teamStore.characters))
    }
  }, [...teamStore.characters])

  useEffect(() => {
    const localData = localStorage.getItem(teamKey)
    if (localData) teamStore.hydrateCharacters(JSON.parse(localData))
    setHydrated(true)
  }, [])

  return !hydrated
}
