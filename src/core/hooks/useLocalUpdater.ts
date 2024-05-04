import { useStore } from '@src/data/providers/app_store_provider'
import { useEffect, useState } from 'react'

export const useLocalUpdater = (game: string) => {
  const { teamStore, artifactStore } = useStore()
  const [hydrated, setHydrated] = useState(false)

  const teamKey = `${game}_local_char`
  const aInventoryKey = `${game}_artifact_inventory`

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(teamKey, JSON.stringify(teamStore.characters))
      localStorage.setItem(aInventoryKey, JSON.stringify(artifactStore.artifacts))
    }
  }, [...teamStore.characters])

  useEffect(() => {
    const characters = localStorage.getItem(teamKey)
    const artifacts = localStorage.getItem(aInventoryKey)

    if (characters) teamStore.hydrateCharacters(JSON.parse(characters))
    if (artifacts) artifactStore.hydrateArtifacts(JSON.parse(artifacts))
    
    setHydrated(true)
  }, [])

  return !hydrated
}
