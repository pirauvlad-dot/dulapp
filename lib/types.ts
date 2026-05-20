export interface User {
  id: string
  username: string
  shopName?: string
  avatar: string
  bannerImage?: string
  location: string
  rating: number
  reviewCount: number
  itemsSold: number
  memberSince: string
  bio?: string
  followers: number
  following: number
  isVerified: boolean
  plan: 'free' | 'starter' | 'pro' | 'unlimited'
  activeListingsCount: number
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: Category
  subcategory?: string
  size?: string
  brand?: string
  condition: Condition
  color?: string
  seller: User
  createdAt: string
  views: number
  favorites: number
  isFavorited?: boolean
  location: string
  isBoosted?: boolean
}

export interface Review {
  id: string
  reviewer: User
  rating: number
  comment: string
  createdAt: string
  listingTitle?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isRead: boolean
  listingId?: string
  offerAmount?: number
  messageType: 'text' | 'offer'
}

export interface Conversation {
  id: string
  participants: User[]
  listing?: Listing
  lastMessage: Message
  unreadCount: number
}

export interface Offer {
  id: string
  buyerId: string
  sellerId: string
  listingId: string
  amount: number
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
}

export type Category =
  | 'femei'
  | 'barbati'
  | 'copii'
  | 'incaltaminte'
  | 'accesorii'
  | 'casa-decor'
  | 'colectionabile'
  | 'altele'

export type Condition =
  | 'nou_cu_eticheta'
  | 'nou_fara_eticheta'
  | 'foarte_buna'
  | 'buna'
  | 'acceptabila'

export type Plan = 'free' | 'starter' | 'pro' | 'unlimited'

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 3,
  starter: 20,
  pro: 100,
  unlimited: Infinity,
}

export const PLAN_PRICES: Record<Plan, number> = {
  free: 0,
  starter: 40,
  pro: 100,
  unlimited: 200,
}

export const PLAN_LABELS: Record<Plan, string> = {
  free: 'Gratuit',
  starter: 'Starter',
  pro: 'Pro',
  unlimited: 'Unlimited',
}

export const CONDITION_LABELS: Record<Condition, string> = {
  nou_cu_eticheta: 'Nou cu etichetă',
  nou_fara_eticheta: 'Nou fără etichetă',
  foarte_buna: 'Foarte bună',
  buna: 'Bună',
  acceptabila: 'Acceptabilă',
}

export const CONDITION_LABELS_RU: Record<Condition, string> = {
  nou_cu_eticheta: 'Новый с этикеткой',
  nou_fara_eticheta: 'Новый без этикетки',
  foarte_buna: 'Очень хорошее',
  buna: 'Хорошее',
  acceptabila: 'Приемлемое',
}

export const CATEGORY_LABELS: Record<Category, string> = {
  femei: 'Femei',
  barbati: 'Bărbați',
  copii: 'Copii',
  incaltaminte: 'Încălțăminte',
  accesorii: 'Accesorii & Bijuterii',
  'casa-decor': 'Casă & Decor',
  colectionabile: 'Colecționabile',
  altele: 'Altele',
}

export const CATEGORY_LABELS_RU: Record<Category, string> = {
  femei: 'Женщинам',
  barbati: 'Мужчинам',
  copii: 'Детям',
  incaltaminte: 'Обувь',
  accesorii: 'Аксессуары',
  'casa-decor': 'Дом & Декор',
  colectionabile: 'Коллекционное',
  altele: 'Другое',
}

export const CATEGORY_ICONS: Record<Category, string> = {
  femei: '👗',
  barbati: '👕',
  copii: '🧒',
  incaltaminte: '👟',
  accesorii: '👜',
  'casa-decor': '🏠',
  colectionabile: '🎵',
  altele: '✨',
}

export const SIZES = {
  haine: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  incaltaminte: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  copii: ['0-3l', '3-6l', '6-12l', '12-18l', '18-24l', '2-3a', '3-4a', '4-5a', '5-6a', '6-7a', '7-8a'],
}

export const COLORS = [
  'Negru', 'Alb', 'Gri', 'Navy', 'Albastru', 'Roșu', 'Roz', 'Mov',
  'Verde', 'Galben', 'Portocaliu', 'Maro', 'Bej', 'Crem', 'Multicolor',
]

export const BRANDS = [
  'Zara', 'H&M', 'Nike', 'Adidas', 'Mango', 'Uniqlo', 'Levi\'s',
  'Ralph Lauren', 'Tommy Hilfiger', 'Calvin Klein', 'Reserved',
  'Pull & Bear', 'Bershka', 'Massimo Dutti', 'COS', 'Stradivarius',
]

export const MOLDOVA_CITIES = [
  'Chișinău', 'Bălți', 'Cahul', 'Ungheni', 'Soroca', 'Orhei',
  'Dubăsari', 'Comrat', 'Edineț', 'Căușeni', 'Strășeni', 'Hîncești',
  'Alte localități',
]
