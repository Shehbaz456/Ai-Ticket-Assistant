import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import User from "../../models/user.js";
import { sendEmail } from "../../utils/mailer.js";


export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup",retries:2 },
  { event: "user/signup" },

  async ({ event, step }) => {
    try {
      const { email } = event.data;
      console.log(`email onsignup ${email}`);
      console.log(`evenr data onsignup  ${event.data}`);
      
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User no longer exists in our database");
        }
        return userObject;
      });

      await step.run("send-welcome-email", async()=>{
        const subject = `welcome to the app`;
        const message = `Hi, 
        \n\n
        Thanks for signin up. we're glad to have you onboard!
        `;
        await sendEmail(user.email,subject,message)
      })
      console.log(user.email,subject,message);
      
      return {success:true}

    } catch (error) {
      console.error("Error running step", error.message);
      return { success: false };
    }
  }
);
