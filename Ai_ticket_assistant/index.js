import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { serve} from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

import connect_DB from "./db/index.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 8000;

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

// ingest middleware
app.use("/api/ingest", serve({
  client: inngest,
  functions: [onUserSignup, onTicketCreated],
}))

connect_DB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
});
