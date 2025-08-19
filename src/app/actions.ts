'use server'

import { api } from '@/lib/api';
import { User, Pitch, Booking } from '@/lib/types';

// Mock API_URL and getAuthToken for demonstration purposes.
// In a real application, these would be imported or defined appropriately.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const getAuthToken = () => {
  // Replace with actual token retrieval logic (e.g., from cookies, session)
  return 'mock-auth-token';
};


// Helper functions to construct API endpoints and headers
const API_BASE_URL = API_URL; // Assuming API_URL is the base for all endpoints

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
});


export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.getAdminUsers();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export async function getPitches(): Promise<Pitch[]> {
  try {
    const response = await api.getPitches();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch pitches:', error);
    return [];
  }
}

export async function getPitchesByOwner(ownerId: string): Promise<Pitch[]> {
  try {
    const response = await api.getOwnerPitches();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch owner pitches:', error);
    return [];
  }
}

export async function getBookingsByOwner(ownerId: string): Promise<Booking[]> {
  try {
    const response = await api.getOwnerBookings();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch owner bookings:', error);
    return [];
  }
}

export async function getBookingsByUser(userId: string): Promise<Booking[]> {
  try {
    const response = await api.getBookings();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    return [];
  }
}

export async function getUserProfile(): Promise<User | null> {
  try {
    const response = await api.getUserProfile();
    if (response.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

export async function getAdminStats() {
  try {
    const response = await api.getAdminStats();
    if (response.success) {
      return response.data;
    }
    return {
      totalUsers: 0,
      totalPitches: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalOwners: 0,
      ownersOnTrial: 0,
      ownersWithPitches: 0
    };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return {
      totalUsers: 0,
      totalPitches: 0,
      totalBookings: 0,
      totalRevenue: 0,
      totalOwners: 0,
      ownersOnTrial: 0,
      ownersWithPitches: 0
    };
  }
}

export async function getTrialOverview() {
  try {
    const response = await fetch(`${API_URL}/admin/trial-overview`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trial overview');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching trial overview:', error);
    throw error;
  }
}

// User Management Functions
export async function addUser(userData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to add user');
    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function getUserByReferralCode(code: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/referral/${code}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user by referral code');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user by referral code:', error);
    return null;
  }
}

// Pitch Management Functions
export async function getPitchById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/pitches/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch pitch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching pitch by ID:', error);
    return null;
  }
}

export async function getOwnerPitches(ownerId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/pitches/owner/${ownerId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch owner pitches');
    return await response.json();
  } catch (error) {
    console.error('Error fetching owner pitches:', error);
    return [];
  }
}

// Booking Management Functions
export async function addBooking(bookingData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) throw new Error('Failed to add booking');
    return await response.json();
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
}

export async function getBookingsByPitch(pitchId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/pitch/${pitchId}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings by pitch:', error);
    return [];
  }
}

export async function getReceiptBookingById(bookingId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/receipt`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch receipt');
    return await response.json();
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return null;
  }
}

export async function updateUserBookingCount(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/booking-count`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to update booking count');
    return await response.json();
  } catch (error) {
    console.error('Error updating booking count:', error);
    throw error;
  }
}

// Payout Functions
export async function getPayoutsByOwner(ownerName: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/payouts/owner/${encodeURIComponent(ownerName)}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch payouts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching payouts by owner:', error);
    return [];
  }
}

export async function getOwnerWithdrawals(ownerName?: string) {
  try {
    const endpoint = ownerName 
      ? `${API_BASE_URL}/withdrawals/owner/${encodeURIComponent(ownerName)}`
      : `${API_BASE_URL}/admin/withdrawals`;
    
    const response = await fetch(endpoint, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch withdrawals');
    return await response.json();
  } catch (error) {
    console.error('Error fetching owner withdrawals:', error);
    return [];
  }
}

export async function addOwnerWithdrawal(withdrawalData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/withdrawals/owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(withdrawalData)
    });
    if (!response.ok) throw new Error('Failed to add withdrawal');
    return await response.json();
  } catch (error) {
    console.error('Error adding withdrawal:', error);
    throw error;
  }
}

// Referral Functions
export async function addReferral(referralData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(referralData)
    });
    if (!response.ok) throw new Error('Failed to add referral');
    return await response.json();
  } catch (error) {
    console.error('Error adding referral:', error);
    throw error;
  }
}

export async function generateReferralCode() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/generate-referral-code`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to generate referral code');
    return await response.json();
  } catch (error) {
    console.error('Error generating referral code:', error);
    throw error;
  }
}

// Update Pitch Function
export async function updatePitch(pitchId: string, pitchData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(pitchData)
    });
    if (!response.ok) throw new Error('Failed to update pitch');
    return await response.json();
  } catch (error) {
    console.error('Error updating pitch:', error);
    throw error;
  }
}

// Additional function implementations
export async function updateUserProfile(profileData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function updateUserPassword(passwordData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(passwordData)
    });
    if (!response.ok) throw new Error('Failed to update password');
    return await response.json();
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export async function updateUserPin(pinData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/pin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(pinData)
    });
    if (!response.ok) throw new Error('Failed to update pin');
    return await response.json();
  } catch (error) {
    console.error('Error updating pin:', error);
    throw error;
  }
}

export async function addPitch(pitchData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/pitches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(pitchData)
    });
    if (!response.ok) throw new Error('Failed to add pitch');
    return await response.json();
  } catch (error) {
    console.error('Error adding pitch:', error);
    throw error;
  }
}

export async function getBookings() {
  try {
    const response = await api.getBookings();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

export async function addAdminWithdrawal(withdrawalData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/withdrawals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(withdrawalData)
    });
    if (!response.ok) throw new Error('Failed to add admin withdrawal');
    return await response.json();
  } catch (error) {
    console.error('Error adding admin withdrawal:', error);
    throw error;
  }
}

export async function getAdminWithdrawals() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/withdrawals`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch admin withdrawals');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin withdrawals:', error);
    return [];
  }
}

export async function getPayouts() {
  try {
    const response = await fetch(`${API_BASE_URL}/payouts`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch payouts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return [];
  }
}

export async function deletePitch(pitchId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/pitches/${pitchId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete pitch');
    return await response.json();
  } catch (error) {
    console.error('Error deleting pitch:', error);
    throw error;
  }
}

export async function initializePayment(paymentData: any) {
  try {
    const response = await api.initializePayment(paymentData);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error);
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
}

export async function verifyPayment(txRef: string) {
  try {
    const response = await api.verifyPayment(txRef);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error);
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}


