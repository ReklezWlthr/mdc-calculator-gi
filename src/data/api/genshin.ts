import { UseQueryOptions } from '@tanstack/react-query'
import { QueryKeyT, useFetch } from './common/react_query'

export const useGetGenshinData = (uid: string, options?: UseQueryOptions<any, Error, any, QueryKeyT>) => {
  return useFetch<any>(`http://localhost:3333/api/getGIUser`, { uid }, { staleTime: 60 * 1000, ...options })
}
