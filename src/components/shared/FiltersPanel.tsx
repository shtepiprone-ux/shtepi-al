'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CONDITIONS, HEATING_TYPES, WALL_TYPES, ROOMS_OPTIONS } from '@/modules/listings/constants'

export interface FilterValues {
  price_min?: number
  price_max?: number
  area_min?: number
  area_max?: number
  rooms?: number
  bedrooms?: number
  condition?: string
  heating?: string
  wall_type?: string
  year_built_min?: number
  year_built_max?: number
}

interface FiltersPanelProps {
  open: boolean
  onClose: () => void
  values: FilterValues
  onChange: (values: FilterValues) => void
  onApply: () => void
}

function ToggleGroup({
  options,
  value,
  onChange,
  getLabel,
}: {
  options: readonly { value: string; labelKey: string }[]
  value?: string
  onChange: (v: string | undefined) => void
  getLabel: (key: string) => string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? undefined : opt.value)}
          className={cn(
            'px-3 py-1.5 text-xs rounded-lg border transition-colors min-h-[36px]',
            value === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:bg-muted'
          )}
        >
          {getLabel(opt.labelKey)}
        </button>
      ))}
    </div>
  )
}

function NumberToggleGroup({
  options,
  value,
  onChange,
  suffix,
}: {
  options: readonly number[]
  value?: number
  onChange: (v: number | undefined) => void
  suffix?: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(value === opt ? undefined : opt)}
          className={cn(
            'px-3 py-1.5 text-xs rounded-lg border transition-colors min-w-[44px] min-h-[36px]',
            value === opt
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:bg-muted'
          )}
        >
          {opt}{suffix}
        </button>
      ))}
    </div>
  )
}

export function FiltersPanel({ open, onClose, values, onChange, onApply }: FiltersPanelProps) {
  const t = useTranslations('common')
  const tl = useTranslations('listing')
  const [local, setLocal] = useState<FilterValues>(values)

  useEffect(() => { setLocal(values) }, [values])

  function update(patch: Partial<FilterValues>) {
    setLocal(prev => ({ ...prev, ...patch }))
  }

  function handleApply() {
    onChange(local)
    onApply()
    onClose()
  }

  function handleReset() {
    const empty: FilterValues = {}
    setLocal(empty)
    onChange(empty)
  }

  const activeCount = Object.values(local).filter(v => v !== undefined && v !== '').length

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background shadow-xl flex flex-col transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('advanced_filters')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="font-semibold text-base">{t('advanced_filters')}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            aria-label={t('close_filters')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Price range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('price_range')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t('min')}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={local.price_min ?? ''}
                  onChange={e => update({ price_min: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t('max')}</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={local.price_max ?? ''}
                  onChange={e => update({ price_max: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Area range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('area_range')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t('min')}</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={local.area_min ?? ''}
                  onChange={e => update({ area_min: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t('max')}</Label>
                <Input
                  type="number"
                  placeholder="∞"
                  value={local.area_max ?? ''}
                  onChange={e => update({ area_max: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{tl('rooms')}</Label>
            <NumberToggleGroup
              options={ROOMS_OPTIONS}
              value={local.rooms}
              onChange={v => update({ rooms: v })}
              suffix="+"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{tl('bedrooms')}</Label>
            <NumberToggleGroup
              options={ROOMS_OPTIONS}
              value={local.bedrooms}
              onChange={v => update({ bedrooms: v })}
              suffix="+"
            />
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('condition')}</Label>
            <ToggleGroup
              options={CONDITIONS}
              value={local.condition}
              onChange={v => update({ condition: v })}
              getLabel={k => tl(k as any)}
            />
          </div>

          {/* Heating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('heating')}</Label>
            <ToggleGroup
              options={HEATING_TYPES}
              value={local.heating}
              onChange={v => update({ heating: v })}
              getLabel={k => tl(k as any)}
            />
          </div>

          {/* Wall type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('wall_type')}</Label>
            <ToggleGroup
              options={WALL_TYPES}
              value={local.wall_type}
              onChange={v => update({ wall_type: v })}
              getLabel={k => tl(k as any)}
            />
          </div>

          {/* Year built */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('year_built_range')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t('min')}</Label>
                <Input
                  type="number"
                  placeholder="1990"
                  value={local.year_built_min ?? ''}
                  onChange={e => update({ year_built_min: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t('max')}</Label>
                <Input
                  type="number"
                  placeholder={String(new Date().getFullYear())}
                  value={local.year_built_max ?? ''}
                  onChange={e => update({ year_built_max: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 flex gap-3 shrink-0">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            {t('reset_filters')}
          </Button>
          <Button className="flex-1 relative" onClick={handleApply}>
            {t('apply_filters')}
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
