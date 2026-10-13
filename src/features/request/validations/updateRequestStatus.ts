import { z } from "zod";

export const updateRequestStatusSchema = z.object({
  status: z.enum(["shopping", "delivering", "delivered"]),
});
