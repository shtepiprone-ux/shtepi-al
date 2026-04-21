import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shtepi.al — Imobiliare në Shqipëri',
  description: 'Gjeni shtëpinë tuaj të ëndrrave në Shqipëri',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} className={geist.className}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}