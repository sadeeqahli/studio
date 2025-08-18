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
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function getUserByReferralCode(code: string) {
  try {
    const response = await fetch(`${API_URL}/users/referral/${code}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user by referral code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user by referral code:', error);
    throw error;
  }
}

// Pitch Management Functions
export async function getPitchById(id: string) {
  try {
    const response = await fetch(`${API_URL}/pitches/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pitch');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pitch:', error);
    throw error;
  }
}

export async function getOwnerPitches(ownerId: string) {
  try {
    const response = await fetch(`${API_URL}/pitches/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch owner pitches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching owner pitches:', error);
    throw error;
  }
}

// Booking Management Functions
export async function addBooking(bookingData: any) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getBookingsByPitch(pitchId: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/pitch/${pitchId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch pitch bookings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pitch bookings:', error);
    throw error;
  }
}

export async function getReceiptBookingById(id: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/receipt/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch booking receipt');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching booking receipt:', error);
    throw error;
  }
}

export async function updateUserBookingCount(userId: string) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/booking-count`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update booking count');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating booking count:', error);
    throw error;
  }
}

// Payout Functions
export async function getPayoutsByOwner(ownerId: string) {
  try {
    const response = await fetch(`${API_URL}/payouts/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payouts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payouts:', error);
    throw error;
  }
}

export async function getOwnerWithdrawals(ownerId: string) {
  try {
    const response = await fetch(`${API_URL}/withdrawals/owner/${ownerId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch withdrawals');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    throw error;
  }
}

export async function addOwnerWithdrawal(withdrawalData: any) {
  try {
    const response = await fetch(`${API_URL}/withdrawals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(withdrawalData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create withdrawal');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    throw error;
  }
}

// Referral Functions
export async function addReferral(referralData: any) {
  try {
    const response = await fetch(`${API_URL}/referrals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(referralData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create referral');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating referral:', error);
    throw error;
  }
}

export async function generateReferralCode() {
  try {
    const response = await fetch(`${API_URL}/referrals/generate-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate referral code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating referral code:', error);
    throw error;
  }
}

export async function createPitch(pitchData: {
  name: string;
  location: string;
  price: number;
  imageUrl?: string;
  imageHint?: string;
}) {
  try {
    const response = await api.createPitch(pitchData);
    return response;
  } catch (error) {
    console.error('Failed to create pitch:', error);
    return { success: false, error: 'Failed to create pitch' };
  }
}

export async function updatePitch(pitchId: string, pitchData: any) {
  try {
    const response = await api.updatePitch(pitchId, pitchData);
    return response;
  } catch (error) {
    console.error('Failed to update pitch:', error);
    return { success: false, error: 'Failed to update pitch' };
  }
}

export async function deletePitch(pitchId: string) {
  try {
    const response = await api.deletePitch(pitchId);
    return response;
  } catch (error) {
    console.error('Failed to delete pitch:', error);
    return { success: false, error: 'Failed to delete pitch' };
  }
}

export async function initializePayment(paymentData: any) {
  try {
    const response = await api.initializePayment(paymentData);
    return response;
  } catch (error) {
    console.error('Failed to initialize payment:', error);
    return { success: false, error: 'Failed to initialize payment' };
  }
}

export async function verifyPayment(txRef: string) {
  try {
    const response = await api.verifyPayment(txRef);
    return response;
  } catch (error) {
    console.error('Failed to verify payment:', error);
    return { success: false, error: 'Failed to verify payment' };
  }
}