
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'Player' | 'Owner' | 'Admin';
  referralCode?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  async register(data: RegisterData): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Auth endpoints
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
    role: string;
  }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async ownerSignup(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.request('/auth/signup/owner', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Pitch endpoints
  async getPitches() {
    return this.request('/pitches');
  }

  async getOwnerPitches() {
    return this.request('/pitches/owner');
  }

  async createPitch(pitchData: any) {
    return this.request('/pitches', {
      method: 'POST',
      body: JSON.stringify(pitchData),
    });
  }

  async updatePitch(pitchId: string, pitchData: any) {
    return this.request(`/pitches/${pitchId}`, {
      method: 'PUT',
      body: JSON.stringify(pitchData),
    });
  }

  async deletePitch(pitchId: string) {
    return this.request(`/pitches/${pitchId}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getBookings() {
    return this.request('/bookings');
  }

  async getOwnerBookings() {
    return this.request('/bookings/owner');
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Payment endpoints
  async initializePayment(paymentData: any) {
    return this.request('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async verifyPayment(txRef: string) {
    return this.request(`/payments/verify/${txRef}`, {
      method: 'POST',
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminPitches() {
    return this.request('/admin/pitches');
  }

  async getTrialOverview() {
    return this.request('/admin/trial-overview');
  }

  async togglePitchStatus(pitchId: string) {
    return this.request(`/admin/pitches/${pitchId}/toggle-status`, {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
