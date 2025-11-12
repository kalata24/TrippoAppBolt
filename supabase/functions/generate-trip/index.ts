import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = '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';

interface TripRequest {
  destination: string;
  stayingPeriod: number;
  startDate: string;
  endDate: string;
  foods: string[];
  personalities: string[];
  name: string;
  age: number;
  currentLocation: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { destination, stayingPeriod, startDate, endDate, foods, personalities, name, age, currentLocation }: TripRequest = await req.json();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const travelMonth = start.toLocaleDateString('en-US', { month: 'long' });
    const travelYear = start.getFullYear();

    const prompt = `Create a detailed ${stayingPeriod}-day trip itinerary for ${name}, age ${age}, visiting ${destination}.

Travel Dates: ${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} to ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Travel Period: ${travelMonth} ${travelYear}
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
   - If "Concert Lover": Check for concerts, music festivals, live performances happening during ${travelMonth} ${travelYear} in ${destination}
   - If "Sports Fan": Check for sports events, matches, tournaments happening during ${travelMonth} ${travelYear} in ${destination}
   - If "Local Culture": Include traditional markets, cultural centers, local neighborhoods, and check for local festivals, events during ${travelMonth} ${travelYear}
4. IMPORTANT EVENT MATCHING:
   - Based on the travel period (${travelMonth} ${travelYear}), include ANY major events happening in ${destination}:
     * Music concerts and festivals
     * Sports events (football, basketball, tennis tournaments, Olympics, etc.)
     * Cultural festivals and celebrations
     * Winter markets (if traveling November-January)
     * Food festivals
     * Art exhibitions and gallery openings
     * Holiday celebrations and parades
   - If such events exist during the travel period, incorporate them into the itinerary
   - Mention specific event names if known (e.g., "Oktoberfest", "Champions League Match", "Christmas Market at Marienplatz")
5. For restaurants, match the food types selected:
   - Use real restaurant names that serve that cuisine type in ${destination}
   - Example: If "Pizza" selected and destination is London, include "Franco Manca" or "Pizza Pilgrims"
6. Format activities like: "Visit [Specific Place Name] - [brief description] - [duration in minutes]"
7. Make durations realistic (7-12 hours per day)
8. Calculate realistic walking distances and steps

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
    {"name": "Real attraction name in ${destination}", "day": "Day 1"},
    {"name": "Real attraction name in ${destination}", "day": "Day 2"},
    {"name": "Real attraction name in ${destination}", "day": "Day 3"}
  ],
  "personalizedMessage": "A short 2-sentence personal message for ${name} about their trip to ${destination}. Keep it warm, exciting, and concise."
}

CRITICAL REQUIREMENTS FOR TOP ATTRACTIONS:
- The 3 attractions listed in "topAttractions" MUST be major, iconic attractions in ${destination}
- Each attraction MUST actually appear in the activities list of the day specified
- The attraction name in "topAttractions" MUST match exactly (or be a clear substring of) an activity in that day's activities array
- Example: If topAttractions includes {"name": "Eiffel Tower", "day": "Day 1"}, then Day 1's activities must include something like "Visit Eiffel Tower - 90 minutes"
- DO NOT list an attraction in topAttractions unless it's genuinely included in the itinerary for that day

IMPORTANT:
- Always include EXACTLY 3 attractions in topAttractions array
- Keep personalizedMessage to EXACTLY 2 sentences maximum
- Make the message enthusiastic but brief`;

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

    const tripPlan = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(tripPlan),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error generating trip:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate trip' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});