import { z } from "zod";

const assignedRequestSchema = z
  .object({
    uid: z.string().min(1),
    neededBy: z.string(),
    latestDeliveryBy: z.string(),
    status: z.string().min(1),
    totalCost: z.union([z.string(), z.number()]).nullable().optional(),
    deliveryCity: z.string().optional(),
    origin: z.string().optional(),
    destination: z.string().optional(),
    stores: z.array(z.string()).optional(),
    requester: z
      .object({
        name: z.string().optional(),
        fName: z.string().optional(),
        photoUrl: z.string().nullable().optional(),
      })
      .optional(),
    driver: z
      .object({
        name: z.string().optional(),
        fName: z.string().optional(),
        photoUrl: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  })
  .transform((request) => {
    const deliveryCity = request.deliveryCity ?? request.destination ?? "";
    return {
      uid: request.uid,
      neededBy: request.neededBy,
      latestDeliveryBy: request.latestDeliveryBy,
      status: request.status,
      totalCost:
        request.totalCost == null ? null : String(request.totalCost),
      deliveryCity,
      origin: request.origin ?? deliveryCity,
      destination: request.destination ?? deliveryCity,
      stores: request.stores ?? [],
      requester: {
        name:
          request.requester?.name ??
          request.requester?.fName ??
          "Requester",
        photoUrl: request.requester?.photoUrl ?? null,
      },
      driver: request.driver
        ? {
            name: request.driver.name ?? request.driver.fName ?? "Driver",
            photoUrl: request.driver.photoUrl ?? null,
          }
        : null,
    };
  });

export const listMyAssignedRequestsResponseSchema = z
  .object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: z.array(assignedRequestSchema),
    total: z.number().int().nonnegative().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
    meta: z
      .object({
        total: z.number().int().nonnegative().optional(),
        page: z.number().int().positive().optional(),
        limit: z.number().int().positive().optional(),
      })
      .optional(),
  })
  .transform((response) => ({
    success: response.success ?? true,
    message: response.message ?? "Assigned requests retrieved successfully.",
    data: response.data,
    total: response.total ?? response.meta?.total ?? response.data.length,
    page: response.page ?? response.meta?.page ?? 1,
    limit:
      response.limit ??
      response.meta?.limit ??
      Math.max(response.data.length, 1),
  }));
