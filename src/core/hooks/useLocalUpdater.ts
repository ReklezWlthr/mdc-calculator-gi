import { useStore } from '@src/data/providers/app_store_provider'
import { useEffect, useState } from 'react'

export const useLocalUpdater = (game: string) => {
  const { teamStore, artifactStore, buildStore, charStore } = useStore()
  const [data, setData] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  const key = `${game}_local_storage`

  const updateData = (data) => {
    const json = JSON.parse(data)
    teamStore.hydrateCharacters(json.team)
    artifactStore.hydrateArtifacts(json.artifacts)
    buildStore.hydrateBuilds(json.builds)
    charStore.hydrateCharacters(json.characters)
    setData(data)
  }

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(
        key,
        JSON.stringify({
          team: teamStore.characters,
          artifacts: artifactStore.artifacts,
          builds: buildStore.builds,
          characters: charStore.characters
        })
      )
    }
  }, [...teamStore.characters, artifactStore.artifacts, buildStore.builds])

  useEffect(() => {
    const data = localStorage.getItem(key)

    if (data) {
      updateData(data)
    }

    setHydrated(true)
  }, [])

  return { data, updateData }
}
