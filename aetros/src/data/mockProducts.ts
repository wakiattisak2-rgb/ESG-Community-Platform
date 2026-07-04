import type { MarketplaceProduct } from '@/types'

export const mockProducts: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    nameKey: 'products.ecoPioneer.name',
    descriptionKey: 'products.ecoPioneer.description',
    cost: 50,
    category: 'badge',
    icon: '🏅',
  },
  {
    id: 'prod-2',
    nameKey: 'products.treeCertificate.name',
    descriptionKey: 'products.treeCertificate.description',
    cost: 100,
    category: 'certificate',
    icon: '🌳',
  },
  {
    id: 'prod-3',
    nameKey: 'products.solarDiscount.name',
    descriptionKey: 'products.solarDiscount.description',
    cost: 200,
    category: 'discount',
    icon: '☀️',
  },
  {
    id: 'prod-4',
    nameKey: 'products.galaxyBadge.name',
    descriptionKey: 'products.galaxyBadge.description',
    cost: 500,
    category: 'badge',
    icon: '🌌',
  },
  {
    id: 'prod-5',
    nameKey: 'products.evCharger.name',
    descriptionKey: 'products.evCharger.description',
    cost: 350,
    category: 'discount',
    icon: '⚡',
  },
  {
    id: 'prod-6',
    nameKey: 'products.oceanGuardian.name',
    descriptionKey: 'products.oceanGuardian.description',
    cost: 150,
    category: 'certificate',
    icon: '🌊',
  },
]
