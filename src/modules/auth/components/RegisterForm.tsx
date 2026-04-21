'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function RegisterForm() {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [userType, setUserType] = useState<'private' | 'agent'>('private')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          user_type: userType,
          company_name: userType === 'agent' ? companyName : null
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Shtepi.al</CardTitle>
          <CardDescription>{t('register')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>{t('register_as')}</Label>
              <RadioGroup
                value={userType}
                onValueChange={v => setUserType(v as 'private' | 'agent')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">{t('private')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agent" id="agent" />
                  <Label htmlFor="agent">{t('agent')}</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            {userType === 'agent' && (
              <div className="space-y-2">
                <Label htmlFor="company">{t('company')}</Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : t('register')}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t('have_account')}{' '}
            <Link href={`/${locale}/auth/login`} className="text-primary hover:underline font-medium">
              {t('login')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}