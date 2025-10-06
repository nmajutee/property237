/**
 * TypeScript interfaces for API responses
 */

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  user_type: 'tenant' | 'agent';
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_kyc_verified: boolean;
  profile_picture?: string;
  date_joined: string;
}

// Authentication
export interface SignupRequest {
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirm: string;
  user_type: 'tenant' | 'agent';
  terms_accepted: boolean;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: User;
  otp_sent: boolean;
  otp_message: string;
  next_step: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface OTPRequest {
  recipient: string;
  otp_type: 'phone' | 'email';
  purpose: 'signup' | 'login' | 'password_reset' | 'phone_change';
}

export interface OTPVerifyRequest {
  recipient: string;
  otp_code: string;
  purpose: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  verified_at?: string;
  user?: User;
  tokens?: {
    access: string;
    refresh: string;
  };
}

// Credits
export interface CreditBalance {
  balance: string;
  total_purchased: string;
  total_spent: string;
  total_earned: string;
  user_email: string;
  user_type: string;
  has_low_balance: boolean;
  last_purchase_at?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  bonus_credits: number;
  total_credits: number;
  price: string;
  currency: string;
  price_per_credit: string;
  is_popular: boolean;
}

export interface CreditTransaction {
  id: string;
  user_email: string;
  transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'referral' | 'admin_adjustment';
  amount: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  balance_before: string;
  balance_after: string;
  description: string;
  package_name?: string;
  payment_method?: string;
  created_at: string;
  completed_at?: string;
}

export interface CreditPricing {
  action: string;
  action_display: string;
  credits_required: string;
  description: string;
  is_active: boolean;
}

export interface CreditPurchaseRequest {
  package_id: string;
  payment_method: 'momo' | 'orange_money' | 'card';
  phone_number?: string;
}

export interface CreditPurchaseResponse {
  success: boolean;
  message: string;
  transaction: CreditTransaction;
  balance: CreditBalance;
}

export interface CreditUsageRequest {
  action: 'view_property' | 'list_property' | 'featured_listing' | 'contact_reveal';
  reference_id: string;
}

export interface CreditUsageResponse {
  success: boolean;
  message: string;
  transaction: CreditTransaction;
  balance: CreditBalance;
}

export interface PropertyAccessCheck {
  has_access: boolean;
  reason: string;
  credits_required: number;
  current_balance: number;
}

export interface CreditStatistics {
  balance: number;
  total_purchased: number;
  total_spent: number;
  total_earned: number;
  purchase_count: number;
  usage_count: number;
  properties_viewed: number;
  last_purchase: string | null;
}

export interface MomoPaymentInitiate {
  package_id: string;
  phone_number: string;
}

export interface MomoPaymentInitiateResponse {
  success: boolean;
  message: string;
  payment_reference: string;
  amount: number;
  currency: string;
  package: CreditPackage;
}

export interface MomoPaymentVerify {
  payment_reference: string;
  package_id: string;
}

export interface MomoPaymentVerifyResponse {
  success: boolean;
  message: string;
  transaction: CreditTransaction;
  balance: CreditBalance;
}

// API Error Response
export interface APIError {
  message: string;
  errors?: Record<string, string[]>;
  detail?: string;
}
