const OPENAI_API_KEY = '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';

export async function generateTripPlan(
  destination: string,
  stayingPeriod: number,
  foods: string[],
  personalities: string[],
  name: string,
  age: number,
  currentLocation: string,
) {
  const prompt = `Create a detailed ${stayingPeriod}-day trip itinerary for ${name}, age ${age}, traveling from ${currentLocation} to ${destination}.

Personality: ${personalities.join(', ')}
Favorite foods: ${foods.join(', ')}

Provide a JSON response with this structure:
{
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": ["activity 1", "activity 2", "activity 3"],
      "duration": "11h 0m",
      "distance": "5 km",
      "steps": "7,000 steps"
    }
  ],
  "topAttractions": [
    {"name": "Attraction name", "day": "Day 1"}
  ],
  "personalizedMessage": "A personal message for ${name}"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate trip');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating trip:', error);
    throw error;
  }
}
