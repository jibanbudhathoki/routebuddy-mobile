import { z } from "zod";

import { TRIP_STATUSES } from "../types/trip";

export const updateTripStatusSchema = z.object({
  status: z.enum(TRIP_STATUSES),
});
