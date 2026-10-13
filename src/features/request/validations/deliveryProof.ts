import { z } from "zod";

export const addDeliveryProofSchema = z.object({
  itemPhotoUrls: z.array(z.string().url()).min(1),
  note: z.string().max(500).optional(),
});

