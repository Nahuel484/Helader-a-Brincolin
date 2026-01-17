import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      heladoId: z.string().regex(/^[0-9a-fA-F]{24}$/), // ✅ Cambiado a heladoId
      cantidad: z.number().int().positive(),
    })
  ),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
