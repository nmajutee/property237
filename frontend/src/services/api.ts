/**
 * API Service for Property237
 * Connects frontend to Django backend with authentication and credit management
 */

// Dynamic API URL getter - evaluates at runtime, not build time
// This ensures the correct URL is used in production vs development
const getApiBaseUrl = (): string => {
  // Priority 1: Environment variable (if set)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Priority 2: Check if we're in browser and not localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Production deployment (Vercel or custom domain)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '/api'; // Use relative path - proxied by vercel.json
    }
  }

  // Priority 3: Development fallback
  return 'http://localhost:8000/api';
};

// Export for debugging/testing purposes
export { getApiBaseUrl };

// Token storage keys
const ACCESS_TOKEN_KEY = 'property237_access_token';
const REFRESH_TOKEN_KEY = 'property237_refresh_token';
const USER_KEY = 'property237_user';

/**
 * Token Management
 */
export const tokenService = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

/**
 * HTTP Client with auto token refresh
 */
class APIClient {
  private isRefreshing = false;
  private failedQueue: any[] = [];

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Get API base URL dynamically at runtime
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    // Debug logging
    console.log('[API Debug] Base URL:', baseUrl);
    console.log('[API Debug] Full URL:', url);
    console.log('[API Debug] Endpoint:', endpoint);
    console.log('[API Debug] Window location:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');

    const accessToken = tokenService.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (accessToken && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/signup')) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      // Create abort controller for timeout (60 seconds for Render free tier wake-up)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle 401 Unauthorized - token expired
      if (response.status === 401 && accessToken) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.isRefreshing = false;
            this.processQueue(null, newToken);

            // Retry original request with new token
            headers['Authorization'] = `Bearer ${newToken}`;
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });
            return this.handleResponse<T>(retryResponse);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.processQueue(refreshError, null);
            tokenService.clearTokens();
            window.location.href = '/login';
            throw refreshError;
          }
        } else {
          // Wait for token refresh
          return new Promise<T>((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then((token) => {
            headers['Authorization'] = `Bearer ${token as string}`;
            return fetch(url, { ...options, headers }).then((res) => this.handleResponse<T>(res));
          });
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));

      // Create an axios-like error object with response property
      const error: any = new Error(errorData.message || `HTTP ${response.status}`);
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      };

      console.error('[API Error]', {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
        url: response.url,
      });

      throw error;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as any;
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    tokenService.setTokens(data.access, refreshToken);
    return data.access;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new APIClient();

/**
 * Authentication API
 */
export const authAPI = {
  signup: (data: {
    full_name: string;
    username: string;
    email: string;
    phone_number: string;
    password: string;
    password_confirm: string;
    user_type: 'tenant' | 'agent';
    terms_accepted: boolean;
  }) => apiClient.post('/auth/signup/', data),

  login: (data: { identifier: string; password: string; remember_me?: boolean }) =>
    apiClient.post<{
      success: boolean;
      message: string;
      user: any;
      tokens: { access: string; refresh: string };
    }>('/auth/login/', data).then((response) => {
      if (response.success && response.tokens) {
        tokenService.setTokens(response.tokens.access, response.tokens.refresh);
        tokenService.setUser(response.user);
      }
      return response;
    }),

  logout: () => {
    const refreshToken = tokenService.getRefreshToken();
    tokenService.clearTokens();
    if (refreshToken) {
      return apiClient.post('/auth/logout/', { refresh_token: refreshToken });
    }
    return Promise.resolve();
  },

  requestOTP: (data: {
    recipient: string;
    otp_type: 'phone' | 'email';
    purpose: 'signup' | 'login' | 'password_reset' | 'phone_change';
  }) => apiClient.post('/auth/otp/request/', data),

  verifyOTP: (data: { recipient: string; otp_code: string; purpose: string }) =>
    apiClient.post<{
      success: boolean;
      message: string;
      user?: any;
      tokens?: { access: string; refresh: string };
    }>('/auth/otp/verify/', data).then((response) => {
      if (response.success && response.tokens) {
        tokenService.setTokens(response.tokens.access, response.tokens.refresh);
        if (response.user) {
          tokenService.setUser(response.user);
        }
      }
      return response;
    }),

  requestPasswordReset: (data: { identifier: string }) =>
    apiClient.post('/auth/password/reset/request/', data),

  confirmPasswordReset: (data: {
    token: string;
    new_password: string;
    new_password_confirm: string;
  }) => apiClient.post('/auth/password/reset/confirm/', data),

  getProfile: () => apiClient.get('/auth/profile/'),

  updateProfile: (data: any) => apiClient.patch('/auth/profile/update/', data),
};

/**
 * Credits API
 */
export const creditsAPI = {
  getBalance: () =>
    apiClient.get<{
      balance: string;
      total_purchased: string;
      total_spent: string;
      total_earned: string;
      user_email: string;
      user_type: string;
      has_low_balance: boolean;
    }>('/credits/balance/'),

  getStatistics: () =>
    apiClient.get<{
      balance: number;
      total_purchased: number;
      total_spent: number;
      total_earned: number;
      purchase_count: number;
      usage_count: number;
      properties_viewed: number;
      last_purchase: string | null;
    }>('/credits/statistics/'),

  getPackages: () =>
    apiClient.get<
      Array<{
        id: string;
        name: string;
        credits: number;
        bonus_credits: number;
        total_credits: number;
        price: string;
        currency: string;
        price_per_credit: string;
        is_popular: boolean;
      }>
    >('/credits/packages/'),

  getPricing: () =>
    apiClient.get<
      Array<{
        action: string;
        action_display: string;
        credits_required: string;
        description: string;
        is_active: boolean;
      }>
    >('/credits/pricing/'),

  purchaseCredits: (data: {
    package_id: string;
    payment_method: 'momo' | 'orange_money' | 'card';
    phone_number?: string;
  }) =>
    apiClient.post<{
      success: boolean;
      message: string;
      transaction: any;
      balance: any;
    }>('/credits/purchase/', data),

  useCredits: (data: {
    action: 'view_property' | 'list_property' | 'featured_listing' | 'contact_reveal';
    reference_id: string;
  }) =>
    apiClient.post<{
      success: boolean;
      message: string;
      transaction: any;
      balance: any;
    }>('/credits/use/', data),

  checkPropertyAccess: (propertyId: number) =>
    apiClient.get<{
      has_access: boolean;
      reason: string;
      credits_required: number;
      current_balance: number;
    }>(`/credits/check-access/${propertyId}/`),

  getTransactions: (params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get(`/credits/transactions/${query ? `?${query}` : ''}`);
  },

  getPropertyViews: () => apiClient.get('/credits/property-views/'),

  initiateMomoPayment: (data: { package_id: string; phone_number: string }) =>
    apiClient.post<{
      success: boolean;
      message: string;
      payment_reference: string;
      amount: number;
      currency: string;
      package: any;
    }>('/credits/payment/momo/initiate/', data),

  verifyMomoPayment: (data: { payment_reference: string; package_id: string }) =>
    apiClient.post<{
      success: boolean;
      message: string;
      transaction: any;
      balance: any;
    }>('/credits/payment/momo/verify/', data),
};

/**
 * Export configured API client for custom requests
 */
export default apiClient;
