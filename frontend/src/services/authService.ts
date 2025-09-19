/**
 * Authentication service for Property237
 * Handles user registration, login, and authentication state
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface RegisterData {
  email: string
  first_name: string
  last_name: string
  user_type: 'tenant' | 'agent'
  phone_number: string
  password: string
  password_confirm: string
  terms_accepted: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  user_type: string
  phone_number: string
  is_verified: boolean
  profile_picture_url?: string
}

export interface AuthResponse {
  user: User
  token: string
  message: string
}

class AuthService {
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle validation errors
      if (response.status === 400 && data) {
        const errorMessages: string[] = []

        // Extract validation errors
        for (const [field, errors] of Object.entries(data)) {
          if (Array.isArray(errors)) {
            errorMessages.push(...errors)
          } else if (typeof errors === 'string') {
            errorMessages.push(errors)
          }
        }

        throw new Error(errorMessages.join('. ') || 'Validation failed')
      }

      throw new Error(data.message || data.error || 'Request failed')
    }

    return data
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    this.setToken(response.token)
    return response
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/users/login/', {
      method: 'POST',
      body: JSON.stringify({
        username: data.email,  // Backend expects username or email
        password: data.password
      })
    })

    this.setToken(response.token)
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/api/users/logout/', {
        method: 'POST'
      })
    } catch (error) {
      // Ignore errors on logout
      console.warn('Logout request failed:', error)
    }

    this.clearToken()
  }

  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('Not authenticated')
    }

    return this.makeRequest('/api/users/profile/')
  }

  private setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  private clearToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  getToken(): string | null {
    return this.token
  }
}

export const authService = new AuthService()