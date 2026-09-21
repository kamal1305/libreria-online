import { catalogBooks } from "@/lib/catalog";

export type PublicBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string;
  stock: number;
  status: string;
  amazonAffiliateUrl: string | null;
};

export type PublicReview = {
  id: string;
  slug: string;
  title: string;
  author: string;
  synopsis: string;
  content: string;
  rating: number;
  coverUrl: string | null;
  coverAlt: string | null;
  amazonAffiliateUrl: string | null;
  instagramUrl: string | null;
  publishedAt: Date | null;
  status: string;
  book?: PublicBook | null;
};

export const demoBooks: PublicBook[] = catalogBooks.map((b, idx) => ({
  id: `book-${idx + 1}`,
  slug: b.slug,
  title: b.title,
  author: b.author,
  price: b.price,
  condition: "LIKE_NEW",
  imageUrl: b.imageUrl,
  imageAlt: b.imageAlt,
  category: b.genre,
  stock: 1,
  status: "PUBLISHED",
  amazonAffiliateUrl: b.amazonUrl,
}));

export const demoReviews: PublicReview[] = [
  {
    id: "review-1",
    slug: "el-retiro",
    title: "El retiro",
    author: "Mark Edwards",
    synopsis: "Un thriller psicológico absorbente que no te deja soltar el libro.",
    content: "Una historia que atrapa desde el primer capítulo con una ambientación inquietante y giros que no ves venir.",
    rating: 5,
    coverUrl: "/covers/el-retiro.svg",
    coverAlt: "Portada de El retiro",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-2",
    slug: "alas-de-sangre-empireo-1",
    title: "Alas de sangre",
    author: "Rebecca Yarros",
    synopsis: "El fenómeno literario de fantasía que ha conquistado a lectores de todo el mundo.",
    content: "Dragones, intriga, romance y acción sin pausa. Una edición imprescindible para devorar página a página.",
    rating: 5,
    coverUrl: "/covers/alas-de-sangre-empireo-1.jpg",
    coverAlt: "Portada de Alas de sangre",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-3",
    slug: "bienvenidos-a-la-libreria-hyunam-dong",
    title: "Bienvenidos a la librería Hyunam-dong",
    author: "Hwang Bo-reum",
    synopsis: "Un homenaje cálido a los libros, el café y los nuevos comienzos.",
    content: "Una novela reconfortante, tierna y llena de paz. Perfecta para amantes de las librerías con alma.",
    rating: 5,
    coverUrl: "/covers/bienvenidos-a-la-libreria-hyunam-dong.jpg",
    coverAlt: "Portada de Bienvenidos a la librería Hyunam-dong",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
];
