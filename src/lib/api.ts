
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        return response.json();
    }

    // Auth endpoints
    async login(credentials: { email: string; password: string; role: string }) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(credentials)
        });
        return this.handleResponse(response);
    }

    async signup(userData: any) {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return this.handleResponse(response);
    }

    // User endpoints
    async getProfile() {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    async updateProfile(userData: any) {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return this.handleResponse(response);
    }

    // Pitch endpoints
    async getPitches() {
        const response = await fetch(`${API_BASE_URL}/pitches`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    async getPitchById(id: string) {
        const response = await fetch(`${API_BASE_URL}/pitches/${id}`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    async createPitch(pitchData: any) {
        const response = await fetch(`${API_BASE_URL}/pitches`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(pitchData)
        });
        return this.handleResponse(response);
    }

    // Booking endpoints
    async getBookings() {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    async createBooking(bookingData: any) {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(bookingData)
        });
        return this.handleResponse(response);
    }

    async getBookingById(id: string) {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Payment endpoints
    async initializePayment(paymentData: any) {
        const response = await fetch(`${API_BASE_URL}/payments/initialize`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(paymentData)
        });
        return this.handleResponse(response);
    }

    async verifyPayment(txRef: string) {
        const response = await fetch(`${API_BASE_URL}/payments/verify/${txRef}`, {
            method: 'POST',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Reward endpoints
    async getRewards() {
        const response = await fetch(`${API_BASE_URL}/rewards`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    async useRewards(amount: number, bookingId: string) {
        const response = await fetch(`${API_BASE_URL}/rewards/use`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ amount, bookingId })
        });
        return this.handleResponse(response);
    }
}

export const apiService = new ApiService();

// Helper functions for token management
export const setAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch {
        return false;
    }
};
