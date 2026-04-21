'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, Globe, ChevronDown, User, ListPlus, Heart, LogOut, LayoutList } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/modules/auth/hooks/useUser'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const LOCALES = [
  { code: 'sq', label: 'Shqip', flag: '🇦🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
]

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const { user, loading } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  function switchLocale(newLocale: string) {
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/(sq|en|uk|it)/, '') || '/'
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  const currentLocale = LOCALES.find(l => l.code === locale)
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const NavLinks = () => (
    <>
      <Link
        href={`/${locale}`}
        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setMobileOpen(false)}
      >
        {t('home')}
      </Link>
      <Link
        href={`/${locale}/listings`}
        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        onClick={() => setMobileOpen(false)}
      >
        {t('listings')}
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-1 font-bold text-xl">
          <span className="text-primary">Shtepi</span>
          <span className="text-foreground">.al</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1 px-2 hidden sm:flex')}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{currentLocale?.flag}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LOCALES.map(loc => (
                <DropdownMenuItem
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={locale === loc.code ? 'font-semibold' : ''}
                >
                  <span className="mr-2">{loc.flag}</span>
                  {loc.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth / user menu — desktop */}
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2 px-2 hidden md:flex')}
                  >
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar_url ?? undefined} />
                      <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>
                      <Link href={`/${locale}/profile`} className="flex items-center gap-2 w-full">
                        <User className="h-4 w-4" />
                        {t('profile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/${locale}/my-listings`} className="flex items-center gap-2 w-full">
                        <LayoutList className="h-4 w-4" />
                        {t('my_listings')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/${locale}/favorites`} className="flex items-center gap-2 w-full">
                        <Heart className="h-4 w-4" />
                        {t('favorites')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={`/${locale}/listings/create`} className="flex items-center gap-2 w-full">
                        <ListPlus className="h-4 w-4" />
                        {t('add_listing')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href={`/${locale}/auth/login`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                    {t('login')}
                  </Link>
                  <Link href={`/${locale}/auth/register`} className={cn(buttonVariants({ size: 'sm' }))}>
                    {t('register')}
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden')}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex flex-col gap-6 pt-6">
                {/* Mobile user info */}
                {user && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url ?? undefined} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                    </div>
                  </div>
                )}

                {/* Mobile nav links */}
                <nav className="flex flex-col gap-4">
                  <NavLinks />
                  {user && (
                    <>
                      <Link
                        href={`/${locale}/profile`}
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t('profile')}
                      </Link>
                      <Link
                        href={`/${locale}/my-listings`}
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t('my_listings')}
                      </Link>
                      <Link
                        href={`/${locale}/favorites`}
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t('favorites')}
                      </Link>
                      <Link
                        href={`/${locale}/listings/create`}
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t('add_listing')}
                      </Link>
                    </>
                  )}
                </nav>

                {/* Mobile locale switcher */}
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Language</p>
                  <div className="flex flex-wrap gap-2">
                    {LOCALES.map(loc => (
                      <button
                        key={loc.code}
                        onClick={() => { switchLocale(loc.code); setMobileOpen(false) }}
                        className={`text-sm px-3 py-1.5 rounded-md border transition-colors min-h-[44px] ${
                          locale === loc.code ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'
                        }`}
                      >
                        {loc.flag} {loc.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile auth buttons */}
                {!user && (
                  <div className="border-t pt-4 flex flex-col gap-2">
                    <Link
                      href={`/${locale}/auth/login`}
                      className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-center')}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href={`/${locale}/auth/register`}
                      className={cn(buttonVariants(), 'w-full justify-center')}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t('register')}
                    </Link>
                  </div>
                )}

                {/* Mobile logout */}
                {user && (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false) }}
                      className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors min-h-[44px]"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
