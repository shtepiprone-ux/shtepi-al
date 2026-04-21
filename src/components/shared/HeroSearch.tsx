'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLocations } from '@/modules/locations/hooks/useLocations'
import { FiltersPanel, type FilterValues } from '@/components/shared/FiltersPanel'
import { PROPERTY_TYPES } from '@/modules/listings/constants'
import type { ListingType } from '@/types/database'

export function HeroSearch() {
  const t = useTranslations('common')
  const tl = useTranslations('listing')
  const th = useTranslations('home')
  const locale = useLocale()
  const router = useRouter()

  const { locations, loading: locationsLoading } = useLocations()

  const [listingType, setListingType] = useState<ListingType>('sale')
  const [propertyType, setPropertyType] = useState<string>('')
  const [locationId, setLocationId] = useState<string>('')
  const [locationSearch, setLocationSearch] = useState<string>('')
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})

  const filteredLocations = useMemo(() => {
    if (!locationSearch) return locations.slice(0, 20)
    const q = locationSearch.toLowerCase()
    return locations.filter(l => l.name_al.toLowerCase().includes(q)).slice(0, 20)
  }, [locations, locationSearch])

  const selectedLocation = locations.find(l => String(l.id) === locationId)

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length

  function handleSearch() {
    const params = new URLSearchParams()
    params.set('type', listingType)
    if (propertyType) params.set('property_type', propertyType)
    if (locationId) params.set('location_id', locationId)
    if (filters.price_min) params.set('price_min', String(filters.price_min))
    if (filters.price_max) params.set('price_max', String(filters.price_max))
    if (filters.area_min) params.set('area_min', String(filters.area_min))
    if (filters.area_max) params.set('area_max', String(filters.area_max))
    if (filters.rooms) params.set('rooms', String(filters.rooms))
    if (filters.condition) params.set('condition', filters.condition)
    if (filters.heating) params.set('heating', filters.heating)
    window.location.href = `/${locale}/listings?${params.toString()}`
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        {/* Listing type tabs */}
        <div className="flex mb-0">
          {(['sale', 'rent'] as ListingType[]).map(type => (
            <button
              key={type}
              onClick={() => setListingType(type)}
              className={cn(
                'px-6 py-2.5 text-sm font-medium rounded-t-xl transition-colors border border-b-0',
                listingType === type
                  ? 'bg-background text-foreground border-border'
                  : 'bg-primary-foreground/15 text-primary-foreground/80 hover:text-primary-foreground border-transparent hover:bg-primary-foreground/25'
              )}
            >
              {tl(type)}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="bg-background rounded-b-2xl rounded-tr-2xl border shadow-xl p-3">
          <div className="flex flex-col sm:flex-row gap-2">

            {/* Property type selector */}
            <div className="relative sm:w-48 shrink-0">
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className="w-full h-11 pl-3 pr-8 text-sm text-foreground bg-muted border-0 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={t('all_types')}
              >
                <option value="">{t('all_types')}</option>
                {PROPERTY_TYPES.map(pt => (
                  <option key={pt.value} value={pt.value}>
                    {tl(pt.labelKey as any)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Location combobox */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <input
                type="text"
                value={selectedLocation ? selectedLocation.name_al : locationSearch}
                onChange={e => {
                  setLocationSearch(e.target.value)
                  setLocationId('')
                  setLocationDropdownOpen(true)
                }}
                onFocus={() => setLocationDropdownOpen(true)}
                onBlur={() => setTimeout(() => setLocationDropdownOpen(false), 150)}
                onKeyDown={handleKeyDown}
                placeholder={th('hero_placeholder_location')}
                className="w-full h-11 pl-9 pr-3 text-sm text-foreground bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                aria-label={t('all_locations')}
                aria-autocomplete="list"
                aria-expanded={locationDropdownOpen}
              />
              {locationDropdownOpen && filteredLocations.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-popover border rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted text-muted-foreground"
                    onMouseDown={() => { setLocationId(''); setLocationSearch(''); setLocationDropdownOpen(false) }}
                  >
                    {t('all_locations')}
                  </button>
                  {filteredLocations.map(loc => (
                    <button
                      key={loc.id}
                      type="button"
                      className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center justify-between"
                      onMouseDown={() => {
                        setLocationId(String(loc.id))
                        setLocationSearch(loc.name_al)
                        setLocationDropdownOpen(false)
                      }}
                    >
                      <span>{loc.name_al}</span>
                      <span className="text-xs text-muted-foreground capitalize">{loc.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 shrink-0">
              {/* Advanced filters */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className={cn(
                  'relative h-11 px-3 rounded-lg border text-sm flex items-center gap-2 transition-colors',
                  activeFiltersCount > 0
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                )}
                data-track="filter_apply"
                aria-label={t('advanced_filters')}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{t('advanced_filters')}</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Search button */}
              <Button
                onClick={handleSearch}
                className="h-11 px-6 gap-2 font-semibold"
                data-track="search"
              >
                <Search className="h-4 w-4" />
                <span>{t('search')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        values={filters}
        onChange={setFilters}
        onApply={handleSearch}
      />
    </>
  )
}
