import { z } from "zod";

const signOutSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("University card is required"),
  password: z.string().min(8),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(2).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.coerce.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(1000),
  coverUrl: z.string().nonempty(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color code"),
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
});
export { signOutSchema, signInSchema, bookSchema };
