import { useStore } from '@src/data/providers/app_store_provider'
import { useEffect, useState } from 'react'

export const useLocalUpdater = (game: string) => {
  const { teamStore } = useStore()
  const [hydrated, setHydrated] = useState(false)

  const key = `${game}_local_char`

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(key, JSON.stringify(teamStore.characters))
    }
  }, [...teamStore.characters])

  useEffect(() => {
    const localData = localStorage.getItem(key)
    if (localData) teamStore.hydrateCharacters(JSON.parse(localData))
    setHydrated(true)
  }, [])

  return !hydrated
}
