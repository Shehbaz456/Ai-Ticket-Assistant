import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup"},
  { event: "user/signup" },
  
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      console.log(`event data: ${JSON.stringify(event.data)}`);
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User no longer exists in our database");
        }
        return userObject;
      });

      await step.run("send-welcome-email", async()=>{
        const subject = `Welcome to Ticketing System – Let's Get Started!`;
        const message = `Hi ${user.email},

Thank you for signing up for the Ticketing System.

We're excited to have you onboard! Our platform is here to help you manage and resolve technical support tickets efficiently. If you ever need help, we're just a click away.

Happy building!

– The Ticketing System Team
`;
        const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to the Ticketing System 🎉</h2>
      <p>Hi <strong>${user.email}</strong>,</p>
      <p>Thank you for signing up. We're thrilled to have you on board!</p>
      <p>With our system, you'll be able to manage and triage technical support tickets more efficiently.</p>
      <p>If you have any questions or need help getting started, feel free to reach out to our support team anytime.</p>
      <br />
      <p style="color: #777;">– The Ticketing System Team</p>
    </div>
  `;
        await sendEmail(user.email,subject,message,html)
      })
      
      
      return {success:true}

    } catch (error) {
      console.error("Error running step", error.message);
      return { success: false };
    }
  }
);
