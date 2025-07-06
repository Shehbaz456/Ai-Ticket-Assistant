import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import analyzeTicket from "../../utils/ai-Agent.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 3 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      // fetch the ticket from the database
      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await Ticket.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found in the database");
        }
        return ticketObject;
      });

      // update ticket status to IN_PROGRESS
      await step.run("update-ticket-status", async () => {
        await Ticket.findByIdAndUpdate(ticket._id, { status: "TODO" });
      });

      // analyze the ticket using AI
      const aiResponse = await analyzeTicket(ticket);
      if (!aiResponse) {
        throw new NonRetriableError("Failed to analyze ticket");
      }

      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await Ticket.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
            aiResponse: aiResponse.response,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = await step.run("assign-moderators", async () => {
        const user = await User.findOne({
          role: "moderator",
          skills: {
            $elemMatch: { $regex: new RegExp(relatedskills.join("|"), "i") },
          },
        });
        if (!user) {
          user = await User.findOne({ role: "admin" });
        }
        await Ticket.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });

      await step.run("send-email-notification", async () => {
        // send notification to the user who created the ticket
        if (moderator) {
          const finalTicket = await Ticket.findById(ticket._id);
          await sendEmail(
            moderator.email,
            `New Ticket Assigned: ${finalTicket.title}`,
            `A new ticket has been assigned to you:\n\nTitle: ${
              finalTicket.title
            }\nDescription: ${finalTicket.description}\nPriority: ${
              finalTicket.priority
            }\nHelpful Notes: ${
              finalTicket.helpfulNotes
            }\nRelated Skills: ${finalTicket.relatedSkills.join(
              ", "
            )}\n\nPlease review and take action.`
          );
        }
      });
      return { success: true };
    } catch (error) {
      console.error("Error processing ticket creation:", error);
      return { success: false };
    }
  }
);
