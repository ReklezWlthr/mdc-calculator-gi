export const getAccountData = async (uid: string) => {
  const response = await fetch(`https://enka.network/api/uid/${uid}`, {
    method: 'GET',
    headers: { 'content-type': 'application/json;charset=UTF-8', 'User-Agent': 'Cinnamon-HYV-Calc' },
  })

  if (!response.ok) {
    console.error(response)
    throw new Error('Error Fetching UID')
  }

  return (await response.json()) as Record<string, any>
}
