// Role-based access control

export type UserRole = 'admin' | 'manager' | 'publisher' | 'advertiser' | 'viewer'

export interface UserPermissions {
  canViewBuyers: boolean
  canViewPublishers: boolean
  canViewPricing: boolean
  canViewFullOfferDetails: boolean
  canEditOffers: boolean
  canDeleteOffers: boolean
  canExportData: boolean
  canViewFinancials: boolean
}

export function getPermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'admin':
      return {
        canViewBuyers: true,
        canViewPublishers: true,
        canViewPricing: true,
        canViewFullOfferDetails: true,
        canEditOffers: true,
        canDeleteOffers: true,
        canExportData: true,
        canViewFinancials: true,
      }
    
    case 'manager':
      return {
        canViewBuyers: true,
        canViewPublishers: true,
        canViewPricing: true,
        canViewFullOfferDetails: true,
        canEditOffers: true,
        canDeleteOffers: false,
        canExportData: true,
        canViewFinancials: true,
      }
    
    case 'publisher':
      return {
        canViewBuyers: false, // 🔒 HIDDEN FROM PUBLISHERS
        canViewPublishers: false,
        canViewPricing: true, // Only their payout, not buyer pricing
        canViewFullOfferDetails: false,
        canEditOffers: false,
        canDeleteOffers: false,
        canExportData: false,
        canViewFinancials: false,
      }
    
    case 'advertiser':
      return {
        canViewBuyers: false, // 🔒 HIDDEN FROM ADVERTISERS
        canViewPublishers: false,
        canViewPricing: true, // Only their pricing
        canViewFullOfferDetails: false,
        canEditOffers: false,
        canDeleteOffers: false,
        canExportData: false,
        canViewFinancials: false,
      }
    
    case 'viewer':
      return {
        canViewBuyers: false,
        canViewPublishers: false,
        canViewPricing: false,
        canViewFullOfferDetails: false,
        canEditOffers: false,
        canDeleteOffers: false,
        canExportData: false,
        canViewFinancials: false,
      }
  }
}

// For development - will be replaced with actual auth
export const CURRENT_USER_ROLE: UserRole = 'admin' // Change this for testing

export function canViewField(role: UserRole, fieldName: string): boolean {
  const permissions = getPermissions(role)
  
  // Buyer information - ONLY admins and managers
  if (['buyer', 'buyer_id', 'buyer_name', 'buyer_email'].includes(fieldName)) {
    return permissions.canViewBuyers
  }
  
  // Publisher information - ONLY admins and managers
  if (['publisher', 'publisher_id', 'publisher_name'].includes(fieldName)) {
    return permissions.canViewPublishers
  }
  
  // Advertiser pricing - HIDDEN from publishers
  if (['advertiser_price_min', 'advertiser_price_max'].includes(fieldName)) {
    return permissions.canViewFinancials
  }
  
  // Publisher payout - HIDDEN from advertisers
  if (['publisher_payout_min', 'publisher_payout_max'].includes(fieldName)) {
    return role !== 'advertiser'
  }
  
  // Profit margins - ONLY admins and managers
  if (['profit', 'margin'].includes(fieldName)) {
    return permissions.canViewFinancials
  }
  
  return true // All other fields visible
}

export function filterOfferForRole(offer: any, role: UserRole) {
  const permissions = getPermissions(role)
  const filtered = { ...offer }
  
  // Remove buyer information for non-privileged users
  if (!permissions.canViewBuyers) {
    delete filtered.buyer
    delete filtered.buyer_id
    filtered.buyer_name = '[Private]'
  }
  
  // Remove publisher information for non-privileged users
  if (!permissions.canViewPublishers) {
    delete filtered.publisher
    delete filtered.publisher_id
    filtered.publisher_name = '[Private]'
  }
  
  // Remove advertiser pricing for publishers
  if (role === 'publisher') {
    delete filtered.advertiser_price_min
    delete filtered.advertiser_price_max
    filtered.advertiser_price_info = '[Hidden]'
  }
  
  // Remove publisher payout for advertisers
  if (role === 'advertiser') {
    delete filtered.publisher_payout_min
    delete filtered.publisher_payout_max
    filtered.publisher_payout_info = '[Hidden]'
  }
  
  // Remove financial details for non-admins
  if (!permissions.canViewFinancials) {
    delete filtered.profit
    delete filtered.margin
    delete filtered.notes // May contain sensitive info
  }
  
  return filtered
}
