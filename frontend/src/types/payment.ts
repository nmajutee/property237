export type TransactionType =
  | 'rent_payment'
  | 'deposit_payment'
  | 'commission'
  | 'maintenance'
  | 'ad_payment'
  | 'subscription'
  | 'refund'
  | 'penalty'
  | 'bonus'

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'

export type GatewayType = 'mtn_momo' | 'orange_money' | 'flutterwave'

export interface PaymentMethod {
  id: string | number
  name: string
  code: string
  gateway_type: GatewayType
  description: string
  is_online: boolean
  is_active: boolean
  processing_fee_percentage: number
  fixed_fee: number
  min_amount: number
  max_amount: number
  icon?: string
  color: string
}

export interface Transaction {
  id: string | number
  transaction_id: string
  user: string | number
  transaction_type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  processing_fee: number
  platform_fee: number
  total_amount: number
  payment_method: string | number
  gateway_transaction_id?: string
  description: string
  created_at: string
  updated_at: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
  exchange_rate: number
  is_base_currency: boolean
  is_active: boolean
}
