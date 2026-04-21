## Visual Quality Standards (MANDATORY — every component must meet this bar)
- Aim for a polished, high-trust marketplace UI.
- Prefer spacing, hierarchy, and contrast over decorative styling.

**Spacing & Layout**
- Consistent spacing: use Tailwind spacing scale (`4, 8, 12, 16, 20, 24, 32, 48px`) and keep spacing choices consistent across similar components; prefer shadcn/ui default spacing inside base components unless a product-specific layout pattern requires adjustment.

**Typography**
- Headings: always `font-bold` or `font-semibold`, never plain weight for section titles.
- Body text hierarchy: primary text `text-foreground`, secondary `text-muted-foreground`, never just grey or dimmed text without contrast.
- Line heights: `leading-tight` for headlines, `leading-relaxed` for body paragraphs.
- Never let text touch container edges — always at least `px-4` padding.

**Colors & Surfaces**
- Use semantic tokens only.
- Do not hardcode brand or neutral colors in components.
- Hero/CTA gradients must use predefined semantic gradient tokens.

**Borders & Radius**
- Buttons and selects: keep shadcn/ui default radius and base shape unless a documented product-specific variant is required.
- Inputs: use shadcn/ui defaults as a baseline, but allow `h-11` and `rounded-xl` for marketplace consistency.
- Large cards, panels, modals, and media containers: use `rounded-2xl`.

**Shadows & Depth**
- Apply shadow intensity by component role and interaction state, not as a blanket rule for every component.
- Cards may use subtle resting shadows; overlays, dropdowns, and modals may use stronger predefined shadows when needed.

**Gradients & Visual Interest**
- Hero sections: use predefined semantic hero gradient tokens plus overlay if using a background image.
- CTA sections: use predefined semantic CTA gradient tokens or a semantic colored band.
- Premium badges: may use semantic gradient fills.
- Stats and key numbers: large bold text with semantic accent/supporting text.

**Buttons**
- Primary button: always has visible background color, minimum `px-6 py-2.5`, `font-semibold`, and must ensure at least a `44x44px` touch target on mobile.
- Ghost/outline buttons: have visible border on hover, never invisible.
- Icon buttons: minimum `h-10 w-10` on desktop, but ensure at least `44x44px` touch target on mobile.
- All buttons: `transition-colors duration-150` always.

**Forms & Inputs**
- Input fields: `h-11` minimum height, `rounded-xl`, subtle `bg-muted` or `bg-background border border-input`.
- Labels: always visible and positioned above inputs, `text-sm font-medium`.
- Focus states: always `focus-visible:ring-2 focus-visible:ring-ring`.
- Error states: use semantic error/destructive tokens for border, text, and helper message.
- Never use browser default styles for selects/checkboxes.

**Images & Media**
- All property images: `object-cover` with `aspect-[4/3]` or `aspect-[16/9]`, never distorted.
- Image containers: always `overflow-hidden rounded-2xl`.
- Placeholder when no image: gradient background with icon, never empty white box.
- Loading state: use `Skeleton` component with matching dimensions.

**Admin Panel specifics**
- Tables: alternating row backgrounds `bg-muted/30`, hover `bg-muted/60`, clear column headers.
- Sidebar: `w-64`, rich with icons + labels, active item highlighted with primary color left border.
- Status badges in tables: colored dots + text, not just plain text.
- Action buttons in rows: icon-only with tooltip on desktop, revealed on hover.

**Animations**
- No route/page transitions.
- Hover and micro-interactions: 150–200ms.
- Panels, sheets, dialogs: 200–300ms.

### Mobile Adaptation Rules
- Every component must work on screens from 320px width.
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`.
- Navigation on mobile: hamburger menu via shadcn Sheet component.
- Images must remain responsive across breakpoints, preserve aspect ratio, and never cause horizontal overflow.
- Touch targets: minimum 44x44px for all interactive elements.
- Test mentally for: phone (375px), tablet (768px), desktop (1280px).
- No horizontal scroll on any screen size.
- Modals and dialogs must be fullscreen on mobile.


## UI/UX Rules 2025–2026

### Reference & Inspiration
- Primary reference: https://dom.ria.com/ — study its listing cards, search filters, listing detail page, user cabinet, photo gallery.
- Follow modern real estate marketplace UX patterns.
- Albanian market context: users expect simple, fast, mobile-friendly experience.

### Design System
- Typography scale: use predefined text sizes (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl).
- Color system: use semantic tokens and CSS custom properties as the source of truth for brand and UI colors; Tailwind utilities must reference those tokens instead of hardcoded color values.
- Status and action colors must use semantic tokens (for example: `success`, `verified`, `whatsapp`) defined in the design system; never use raw Tailwind color utilities like `text-green-500` or `bg-green-600` in components.

### Modern UI Patterns (2025–2026)
- **Listing cards**: horizontal on mobile (image left, info right), vertical grid on desktop — like dom.ria.com.
- **Search bar**: prominent, full-width hero search on homepage with location + property type + listing type.
- **Filters**: collapsible sidebar on desktop, bottom sheet drawer on mobile.
- **Photo gallery**: fullscreen lightbox with swipe support on mobile, thumbnail strip on desktop.
- **Map view**: toggle between list and map view on listings page.
- **Sticky elements**: sticky header on scroll, sticky contact sidebar on listing detail page.
- **Micro-animations**: use subtle hover and feedback transitions that follow the global animation timing rules.
- **Loading patterns**: preserve layout shape during loading and avoid blank states for content-heavy UI.
- **Infinite scroll OR pagination**: use pagination for listings (better for SEO and sharing).
- **Breadcrumbs**: on every inner page for navigation context.
- **Price formatting**: always format with thousand separators (1,200,000 ALL or €12,000).
- **Badge system**: consistent badge design across all listing cards (New, Premium, Price reduced, Archived).
- **Verified agent badge**: use approved semantic success/verified tokens for icon, text, and background; never hardcode `green-*` utility classes.
- **WhatsApp button**: use approved semantic WhatsApp/action tokens for background, text, and hover states; keep it prominent and floating on mobile listing page.

### User Experience
- Every action must have visual feedback (loading states, success, error).
- Forms must show inline validation errors, not just on submit.
- Empty states: every list/grid must have a meaningful empty state with illustration and CTA.
- Use skeletons for content and layout placeholders; use spinners only for compact inline or action-level waiting states.
- Optimistic UI updates where possible (favorites, read status).
- Confirm dialogs for all destructive actions (delete listing, etc.).
- Toast notifications (Sonner) for all async actions (save, delete, send).
- **Back navigation**: always provide clear way back (breadcrumbs + browser back).
- **Search persistence**: filters must persist in URL params for sharing and browser back.
- **Recently viewed**: track and show recently viewed listings (localStorage).
- **Similar listings**: show related listings at bottom of listing detail page.
- **Print view**: listing detail page must be printable (CSS print styles).
- **Share functionality**: native Web Share API on mobile, copy link fallback on desktop.

### Homepage Features (dom.ria.com reference)
- Hero section with prominent search form (location, type, listing type, price range).
- Featured/Premium listings section.
- Latest listings grid.
- Popular locations with photo cards.
- Stats bar (total listings, cities, agents).
- How it works section (3 steps).
- CTA to register as agent.

### Listing Card (dom.ria.com reference)
- Cover photo (16:9 ratio) with photo count badge.
- "New" / "Premium" / "Price reduced" badges overlaid on photo.
- Favorite button (heart) on photo hover/tap.
- Title (truncated to 2 lines).
- Price (prominent, bold) + old price struck through if reduced.
- Price per m² (computed automatically).
- Key features row: rooms icon, area icon, floor.
- Location (city, district).
- Agent/user avatar + name.
- Published date (relative: "2 days ago").
- On hover (desktop): slight elevation + smooth transition.

### Listing Detail Page (dom.ria.com reference)
- Full-width photo gallery with lightbox.
- Sticky contact sidebar (desktop) / fixed bottom bar (mobile).
- Title, price, badges.
- Key features grid (rooms, bedrooms, bathrooms, area, floor, year).
- Full description.
- Amenities/features checklist grouped by category.
- Location map (Leaflet).
- Owner/agent contact card with WhatsApp + call buttons.
- Similar listings section.
- Share buttons (WhatsApp, Facebook, Telegram, copy link).
- Report listing button.
- View count display.
- Breadcrumbs: Home → Listings → City → Listing title.

### Accessibility
- All images must have descriptive alt text.
- All interactive elements must be keyboard navigable.
- Use semantic HTML: nav, main, article, section, header, footer.
- Color contrast must meet WCAG AA standard (4.5:1 for text).
- Form inputs must always have associated labels.
- Focus visible styles must never be removed.
- ARIA labels on icon-only buttons.
- Announce dynamic content changes with aria-live.

### Performance
- Use Next.js `<Image>` for content images with `width`, `height`, and `sizes` props to optimize loading and reduce layout shift.
- Lazy load images below the fold.
- Avoid layout shift (CLS) — always define image dimensions.
- Dynamic imports for heavy components (map, rich text editor, photo gallery).
- Keep bundle size in mind — avoid large libraries if smaller alternatives exist.
- Target: Lighthouse score 90+ on mobile.
- First Contentful Paint: under 2s.
- Use Next.js `loading.tsx` for route-level loading states.