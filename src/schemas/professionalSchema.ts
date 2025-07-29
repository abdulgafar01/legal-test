import { z } from "zod";


export const ProfessionalSchema = z.object({
  // Basic Info
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(70, { message: "First name must be at most 70 characters long" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(70, { message: "Last name must be at most 70 characters long" }),

  middleName: z
    .string()
    .optional(),

    dateOfBirth: z
          .string()
          .regex(
            /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-(19|20)\d{2}$/,
            {
              message: "Date must be in MM-DD-YYYY format",
            }
          )
          .refine((val) => {
            const [month, day, year] = val.split("-").map(Number)
            const date = new Date(year, month - 1, day)
            return (
              date.getFullYear() === year &&
              date.getMonth() === month - 1 &&
              date.getDate() === day
            )
          }, {
            message: "Invalid date (e.g., 02-30-2000 doesn't exist)",
          }),

  // phoneNumber: z
  //   .string()
  //   .min(10, { message: "Phone number must be at least 10 digits" })
  //   .nonempty({ message: "Phone number is required" }),

  // Education & Licence
  qualification: z.string().min(2, { message: "Qualification must be at least 2 characters long" }),

  typeOfLicense: z.string(),

  // Certification
  typeOfCertification: z.string(),

  // Incorporation Info
  dateOfIncorporation: z.date(),

  country: z.string().min(2, { message: "Country must be at least 2 characters long" }) ,



  // File Uploads
  proofOfLicence: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Upload a valid proof of licence file",
    }),

  proofOfCertification: z
    .any()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Upload a valid proof of certification file",
    }),
});

export type ProfessionalType = z.infer<typeof ProfessionalSchema>;
