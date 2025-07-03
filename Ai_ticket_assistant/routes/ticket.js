import express from "express";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.use(isAuthenticated);

router.get("/", getTickets);
router.get("/:id", getTicket);
router.post("/", createTicket);


export default router;
