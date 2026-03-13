import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  const alternates = Object.fromEntries(
    routing.locales.map((loc) => [loc, `/${loc}`])
  )

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: alternates,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: locale === 'de' ? 'Bewerber-Schmiede' : 'CVForge',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
