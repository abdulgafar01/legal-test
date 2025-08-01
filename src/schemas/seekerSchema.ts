import { z } from "zod"

export const seekerSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),


    phone_number: z
    .string()
    .min(1, "phone number is required"),

    country: z
        .string()
        .min(1, "Country is required"),

   state: z
    .string()
    .min(1, "state is required"),
    
    city: z
        .string()
        .min(1, "city is required"),


  date_of_birth: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/,
      "Date must be in MM-DD-YYYY format"
    ),
})

export type seekerSchemaType = z.infer<typeof seekerSchema>
