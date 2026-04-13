import { useQuery } from '@tanstack/vue-query'
import type {
  DefaultError,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/vue-query'

export function useSsrQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
) {
  const query = useQuery({
    ...options,
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
