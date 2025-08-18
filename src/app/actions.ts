'use server'

import { api } from '@/lib/api';
import { User, Pitch, Booking } from '@/lib/types';

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
    const response = await api.getTrialOverview();
    if (response.success) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch trial overview:', error);
    return [];
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