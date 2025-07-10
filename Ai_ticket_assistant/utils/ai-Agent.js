import { createAgent, gemini } from "@inngest/agent-kit";
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes technical support tickets. 
Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.
Respond ONLY with valid raw JSON. NO markdown, code fences, or formatting.`,
  });

  try {
    const response = await supportAgent.run(`
You are a ticket triage agent. Analyze the ticket and return strict JSON with:
{
  "summary": "...",
  "priority": "high" | "medium" | "low",
  "helpfulNotes": "...",
  "relatedSkills": ["...", "..."]
}

Ticket:
- Title: ${ticket.title}
- Description: ${ticket.description}
`);

console.log("🧠 Full Gemini Response:", response);

    const raw = response?.output?.[0]?.context || response?.output?.[0]?.content || "";

    // const raw = response?.output?.[0]?.context;
    // console.log("🧠 Raw AI Response:", raw);

    if (!raw) throw new Error("AI response is empty or undefined");

    // Remove markdown if it exists
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw.trim();

    const parsed = JSON.parse(jsonString);
    console.log("✅ Parsed AI Response:", parsed);

    return parsed;
  } catch (e) {
    console.error("❌ Failed to parse JSON from AI response:", e.message);
    return {
      summary: "No summary generated",
      priority: "medium",
      helpfulNotes: "AI parsing failed. Please review the ticket manually.",
      relatedSkills: [],
      response: "No response due to AI parsing failure", 
    };
  }
};

export default analyzeTicket;
