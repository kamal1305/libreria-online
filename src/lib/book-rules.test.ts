import { describe, expect, it } from "vitest";
import { availabilityLabel, canPublishBook } from "./book-rules";

const validBook = { title: "Libro demo", author: "Autora demo", price: 8, condition: "GOOD" as const, stock: 1, imageUrl: "https://example.com/book.jpg", imageAlt: "Portada ficticia" };

describe("book publication rules", () => {
  it("allows a complete book with stock and image", () => expect(canPublishBook(validBook)).toBe(true));
  it("rejects a book without stock", () => expect(canPublishBook({ ...validBook, stock: 0 })).toBe(false));
  it("rejects a book without image or justification", () => expect(canPublishBook({ ...validBook, imageUrl: "", imageAlt: "" })).toBe(false));
  it("rejects a non-positive price", () => expect(canPublishBook({ ...validBook, price: 0 })).toBe(false));
  it("labels availability from real stock", () => expect(availabilityLabel(0)).toBe("No disponible"));
});
