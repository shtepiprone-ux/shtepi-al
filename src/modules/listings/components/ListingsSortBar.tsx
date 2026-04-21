'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  total: number
  page: number
  perPage: number
  view: 'grid' | 'list'
  onViewChange: (v: 'grid' | 'list') => void
  onFiltersOpen: () => void
  activeFiltersCount: number
}

const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'sort_newest' },
  { value: 'price_asc', labelKey: 'sort_price_asc' },
  { value: 'price_desc', labelKey: 'sort_price_desc' },
  { value: 'area_desc', labelKey: 'sort_area_desc' },
] as const

export function ListingsSortBar({ total, page, perPage, view, onViewChange, onFiltersOpen, activeFiltersCount }: Props) {
  const t = useTranslations('listing')
  const tc = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get('sort') ?? 'newest'
  const from = Math.min((page - 1) * perPage + 1, total)
  const to = Math.min(page * perPage, total)

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b">
      {/* Left: count + range */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
        <span className="font-semibold text-sm text-foreground">
          {total === 1 ? t('found_results_one') : t('found_results', { count: total })}
        </span>
        {total > 0 && (
          <span className="text-xs text-muted-foreground hidden sm:block">
            · {t('showing_results', { from, to, total })}
          </span>
        )}
      </div>

      {/* Right: filters btn (mobile) + sort + view toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile filters button */}
        <button
          onClick={onFiltersOpen}
          className="lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-xl border border-border text-sm font-medium hover:border-primary/50 transition-colors relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:block">{t('filters_title')}</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort select */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="h-9 rounded-xl border border-input bg-background px-2 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          aria-label={t('sort_by')}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
          ))}
        </select>

        {/* Grid / List toggle */}
        <div className="hidden sm:flex items-center border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={cn(
              'h-9 w-9 flex items-center justify-center transition-colors',
              view === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
            aria-label={t('view_grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              'h-9 w-9 flex items-center justify-center transition-colors',
              view === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
            aria-label={t('view_list')}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
