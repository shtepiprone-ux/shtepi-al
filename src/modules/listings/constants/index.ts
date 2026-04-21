export const PROPERTY_TYPES = [
  { value: 'apartment', labelKey: 'property_type_apartment' },
  { value: 'house', labelKey: 'property_type_house' },
  { value: 'land', labelKey: 'property_type_land' },
  { value: 'commercial', labelKey: 'property_type_commercial' },
  { value: 'office', labelKey: 'property_type_office' },
  { value: 'garage', labelKey: 'property_type_garage' },
  { value: 'storage', labelKey: 'property_type_storage' },
  { value: 'other', labelKey: 'property_type_other' },
] as const

export const CONDITIONS = [
  { value: 'new_build', labelKey: 'condition_new_build' },
  { value: 'good', labelKey: 'condition_good' },
  { value: 'needs_repair', labelKey: 'condition_needs_repair' },
  { value: 'needs_renovation', labelKey: 'condition_needs_renovation' },
  { value: 'under_construction', labelKey: 'condition_under_construction' },
] as const

export const HEATING_TYPES = [
  { value: 'electric', labelKey: 'heating_electric' },
  { value: 'gas', labelKey: 'heating_gas' },
  { value: 'central', labelKey: 'heating_central' },
  { value: 'wood', labelKey: 'heating_wood' },
  { value: 'none', labelKey: 'heating_none' },
] as const

export const WALL_TYPES = [
  { value: 'brick', labelKey: 'wall_brick' },
  { value: 'concrete', labelKey: 'wall_concrete' },
  { value: 'panel', labelKey: 'wall_panel' },
  { value: 'wood', labelKey: 'wall_wood' },
  { value: 'other', labelKey: 'wall_other' },
] as const

export const ROOMS_OPTIONS = [1, 2, 3, 4, 5] as const

export const LISTINGS_PER_PAGE = 20
