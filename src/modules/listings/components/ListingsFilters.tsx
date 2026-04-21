'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PROPERTY_TYPES, CONDITIONS, HEATING_TYPES, ROOMS_OPTIONS } from '@/modules/listings/constants'

interface Location {
  id: number
  name_al: string
  type: string
}

interface Props {
  locations: Location[]
  className?: string
  onClose?: () => void
}

export function ListingsFilters({ locations, className, onClose }: Props) {
  const t = useTranslations('listing')
  const tc = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const get = (key: string) => searchParams.get(key) ?? ''

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '') params.delete(key)
      else params.set(key, val)
    })
    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, router, pathname])

  const reset = () => {
    router.push(pathname)
    onClose?.()
  }

  const activeCount = ['type', 'property_type', 'location_id', 'price_min', 'price_max',
    'area_min', 'area_max', 'rooms', 'bedrooms', 'condition', 'heating']
    .filter(k => searchParams.get(k)).length

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">{t('filters_title')}</span>
          {activeCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              {tc('reset_filters')}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Listing type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('listing_type')}
        </label>
        <div className="flex gap-2">
          {(['', 'sale', 'rent'] as const).map(type => (
            <button
              key={type}
              onClick={() => updateParams({ type: type || null })}
              className={cn(
                'flex-1 py-2 rounded-xl text-sm font-medium border transition-colors',
                get('type') === type || (!get('type') && type === '')
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/50'
              )}
            >
              {type === '' ? tc('any') : t(type as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('property_type')}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => updateParams({ property_type: null })}
            className={cn(
              'py-2 px-3 rounded-xl text-sm border transition-colors text-left',
              !get('property_type')
                ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                : 'bg-background border-border hover:border-primary/40'
            )}
          >
            {tc('all_types')}
          </button>
          {PROPERTY_TYPES.map(pt => (
            <button
              key={pt.value}
              onClick={() => updateParams({ property_type: pt.value })}
              className={cn(
                'py-2 px-3 rounded-xl text-sm border transition-colors text-left',
                get('property_type') === pt.value
                  ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                  : 'bg-background border-border hover:border-primary/40'
              )}
            >
              {t(pt.labelKey as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('location')}
        </label>
        <select
          value={get('location_id')}
          onChange={e => updateParams({ location_id: e.target.value || null })}
          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{tc('all_locations')}</option>
          {locations.filter(l => l.type === 'city' || l.type === 'region').map(l => (
            <option key={l.id} value={l.id}>{l.name_al}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('price_range')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={tc('min')}
            value={get('price_min')}
            onChange={e => updateParams({ price_min: e.target.value || null })}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            placeholder={tc('max')}
            value={get('price_max')}
            onChange={e => updateParams({ price_max: e.target.value || null })}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Area range */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('area_range')}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={tc('min')}
            value={get('area_min')}
            onChange={e => updateParams({ area_min: e.target.value || null })}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            placeholder={tc('max')}
            value={get('area_max')}
            onChange={e => updateParams({ area_max: e.target.value || null })}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('rooms_label')}
        </label>
        <div className="flex gap-1.5">
          <button
            onClick={() => updateParams({ rooms: null })}
            className={cn(
              'h-9 px-3 rounded-xl text-sm border transition-colors',
              !get('rooms') ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/40'
            )}
          >
            {tc('any')}
          </button>
          {ROOMS_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => updateParams({ rooms: get('rooms') === String(r) ? null : String(r) })}
              className={cn(
                'h-9 w-9 rounded-xl text-sm border transition-colors font-medium',
                get('rooms') === String(r)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/40'
              )}
            >
              {r === 5 ? '5+' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('condition')}
        </label>
        <select
          value={get('condition')}
          onChange={e => updateParams({ condition: e.target.value || null })}
          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{tc('any')}</option>
          {CONDITIONS.map(c => (
            <option key={c.value} value={c.value}>{t(c.labelKey as any)}</option>
          ))}
        </select>
      </div>

      {/* Heating */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {tc('heating')}
        </label>
        <select
          value={get('heating')}
          onChange={e => updateParams({ heating: e.target.value || null })}
          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{tc('any')}</option>
          {HEATING_TYPES.map(h => (
            <option key={h.value} value={h.value}>{t(h.labelKey as any)}</option>
          ))}
        </select>
      </div>

      {/* Apply on mobile */}
      {onClose && (
        <Button className="lg:hidden mt-2" onClick={onClose}>
          {tc('apply_filters')}
          {activeCount > 0 && ` (${activeCount})`}
        </Button>
      )}
    </div>
  )
}
