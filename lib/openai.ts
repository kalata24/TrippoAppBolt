import { supabase } from './supabase';

export async function generateTripPlan(
  destination: string,
  stayingPeriod: number,
  foods: string[],
  personalities: string[],
  name: string,
  age: number,
  currentLocation: string,
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User not authenticated');
    }

    const apiUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-trip`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination,
        stayingPeriod,
        foods,
        personalities,
        name,
        age,
        currentLocation,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate trip');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating trip:', error);
    throw error;
  }
}
