import { z } from "zod";

export const bookConditionSchema = z.enum(["LIKE_NEW", "VERY_GOOD", "GOOD", "ACCEPTABLE", "DEFECTIVE"]);
export const bookInputSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  price: z.number().positive(),
  condition: bookConditionSchema,
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imageAlt: z.string().trim().optional(),
  defects: z.string().trim().optional(),
});
export type BookInput = z.infer<typeof bookInputSchema>;
export function canPublishBook(book: BookInput): boolean {
  const parsed = bookInputSchema.safeParse(book);
  if (!parsed.success || parsed.data.stock < 1) return false;
  return Boolean(parsed.data.imageUrl || parsed.data.imageAlt);
}
export function availabilityLabel(stock: number): string { return stock > 0 ? "Disponible" : "No disponible"; }
