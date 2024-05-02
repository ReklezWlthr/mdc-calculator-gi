export const findBaseLevel = (ascension: number) => {
  if (ascension < 1 || ascension > 6) return 0
  if (ascension === 1) return 20
  return (ascension + 2) * 10
}

export const findMaxLevel = (ascension: number) => {
  if (ascension < 0 || ascension > 6) return 0
  return findBaseLevel(ascension) + 10 + (ascension <= 1 ? 10 : 0)
}

export const isLevelInRange = (ascension: number, level: number) => {
  const low = findBaseLevel(ascension)
  const high = findMaxLevel(ascension)
  return level >= low && level <= high
}
