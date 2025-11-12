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
  const prompt = `Create a detailed ${stayingPeriod}-day trip itinerary for ${name}, age ${age}, visiting ${destination}.

Personality: ${personalities.join(', ')}
Favorite foods: ${foods.join(', ')}

CRITICAL REQUIREMENTS:
1. Create activities ONLY for ${destination}. All ${stayingPeriod} days should be spent exploring ${destination}.
2. Use REAL, SPECIFIC places that exist in ${destination} - include actual names of:
   - Tourist attractions (museums, landmarks, monuments)
   - Restaurants and cafes (match the food preferences: ${foods.join(', ')})
   - Neighborhoods and districts to explore
   - Specific streets, squares, and areas
3. Match activities to personality traits: ${personalities.join(', ')}
   - If "Adventurer": Include outdoor activities, hiking, unique experiences
   - If "Foodie": Include famous restaurants, food markets, local cuisine spots
   - If "Art Lover": Include museums, galleries, street art areas
   - If "Photographer": Include scenic viewpoints, photo spots
   - If "Concert Lover": Include music venues, concert halls
   - If "Sports Fan": Include stadiums, sports bars, local team experiences
   - If "Local Culture": Include traditional markets, cultural centers, local neighborhoods
4. For restaurants, match the food types selected:
   - Use real restaurant names that serve that cuisine type in ${destination}
   - Example: If "Pizza" selected and destination is London, include "Franco Manca" or "Pizza Pilgrims"
5. Format activities like: "Visit [Specific Place Name] - [brief description] - [duration in minutes]"
6. Make durations realistic (7-12 hours per day)
7. Calculate realistic walking distances and steps

Example format for activities:
- "Buckingham Palace (Changing of the Guard) - 60 minutes"
- "Lunch at The Red Lion (Traditional Pub Fare) - 75 minutes"
- "London Eye observation wheel ride - 60 minutes"
- "Dinner at Burger and Lobster (Burger and Lobster) - 90 minutes"

Provide a JSON response with this structure:
{
  "days": [
    {
      "day": 1,
      "title": "Arrival & [Area Name]",
      "activities": ["Specific activity with real place name - duration", "Another activity - duration"],
      "duration": "9h 15m",
      "distance": "4.1 km",
      "steps": "6,000 steps"
    }
  ],
  "topAttractions": [
    {"name": "Real attraction name in ${destination}", "day": "Day 1"}
  ],
  "personalizedMessage": "A personal message for ${name} about their trip to ${destination}"
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
