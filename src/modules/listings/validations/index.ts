import { z } from 'zod'

export const listingSchema = z.object({
  title: z.string().min(5).max(150).transform(v => v.trim()),
  description: z.string().max(5000).optional().transform(v => v?.trim() || undefined),
  price: z.number().positive(),
  price_old: z.number().positive().optional(),
  currency: z.enum(['ALL', 'EUR']),
  listing_type: z.enum(['sale', 'rent']),
  property_type: z.enum(['apartment', 'house', 'land', 'commercial', 'office', 'garage', 'storage', 'other']),
  condition: z.enum(['new_build', 'good', 'needs_repair', 'needs_renovation', 'under_construction']).optional(),
  wall_type: z.enum(['brick', 'concrete', 'panel', 'wood', 'other']).optional(),
  heating: z.enum(['electric', 'wood', 'central', 'gas', 'none']).optional(),
  rooms: z.number().int().min(0).max(50).optional(),
  bedrooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().int().min(0).max(20).optional(),
  toilets: z.number().int().min(0).max(20).optional(),
  area_gross: z.number().positive().max(100000).optional(),
  area_net: z.number().positive().max(100000).optional(),
  floor: z.number().int().min(-5).max(200).optional(),
  total_floors: z.number().int().min(1).max(200).optional(),
  year_built: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),
  location_id: z.number().int().positive().optional(),
  address: z.string().max(300).optional().transform(v => v?.trim() || undefined),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
})

export type ListingInput = z.infer<typeof listingSchema>
