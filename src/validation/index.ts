// src/validation/schema.ts
import { z } from "zod";

export const formSchema = z.object({
  mainCategory: z.number().min(1, "Please select a main category"),
  subcategory: z.number().min(1, "Please select a subcategory"),
  properties: z.record(
    z.string(),
    z.object({
      selectedOption: z.string().min(1, "Please select an option"),
      customValue: z.string().optional(),
    })
  ),
});

export type FormData = z.infer<typeof formSchema>;
