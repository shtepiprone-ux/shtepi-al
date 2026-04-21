import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types/database'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) {
        setUser(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(data)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          setUser(null)
          return
        }

        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUser(data)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}