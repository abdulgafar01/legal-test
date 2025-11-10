import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(300, 'Subject is too long'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000, 'Message is too long'),
});

export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;
