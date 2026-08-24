export type PublicBook = { id: string; slug: string; title: string; author: string; price: number; condition: string; imageUrl: string | null; imageAlt: string | null; category: string; stock: number; status: string };
export type PublicReview = { id: string; slug: string; title: string; author: string; synopsis: string; content: string; rating: number; coverUrl: string | null; coverAlt: string | null; amazonAffiliateUrl: string | null; instagramUrl: string | null; publishedAt: Date | null; status: string; book?: PublicBook | null };

export const demoBooks: PublicBook[] = [
  { id: "demo-book-1", slug: "la-luz-de-las-horas", title: "La luz de las horas", author: "Clara Valdes", price: 8.5, condition: "VERY_GOOD", imageUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Libro+demo+01", imageAlt: "Portada ficticia de La luz de las horas", category: "Narrativa", stock: 1, status: "PUBLISHED" },
  { id: "demo-book-2", slug: "atlas-de-las-pequenas-cosas", title: "Atlas de las pequenas cosas", author: "Mateo Rios", price: 6.25, condition: "GOOD", imageUrl: "https://placehold.co/600x900/d8e2dc/22302b?text=Libro+demo+02", imageAlt: "Portada ficticia de Atlas de las pequenas cosas", category: "Narrativa", stock: 1, status: "PUBLISHED" },
];

export const demoReviews: PublicReview[] = [
  { id: "demo-review-1", slug: "la-luz-de-las-horas-resena", title: "La luz de las horas", author: "Clara Valdes", synopsis: "Una novela ficticia sobre memoria, tiempo y los lugares que elegimos conservar.", content: "Esta reseña de demostración explora cómo una historia puede volver a nosotros con cada lectura. La voz narrativa encuentra belleza en lo cotidiano y deja espacio para que cada persona lectora complete el viaje.", rating: 4, coverUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Resena+demo", coverAlt: "Portada ficticia de La luz de las horas", amazonAffiliateUrl: "https://www.amazon.es/", instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==", publishedAt: new Date("2026-08-23T00:00:00.000Z"), status: "PUBLISHED", book: demoBooks[0] },
];
