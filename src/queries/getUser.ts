import { queryOptions } from '@tanstack/react-query'
import { getSupabaseClient } from '@/utils/supabase'

export const getUser = queryOptions({
  queryKey: ['authUser'],
  queryFn: async () => {
    const { data } = await getSupabaseClient().auth.getUser()
    return data.user
  },
})
