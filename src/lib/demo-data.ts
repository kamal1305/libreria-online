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

export const demoBooks: PublicBook[] = [
  {
    id: "demo-book-1",
    slug: "la-luz-de-las-horas",
    title: "La luz de las horas",
    author: "Clara Valdes",
    price: 8.5,
    condition: "VERY_GOOD",
    imageUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Libro+demo+01",
    imageAlt: "Portada ficticia de La luz de las horas",
    category: "Narrativa",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: null,
  },
  {
    id: "demo-book-2",
    slug: "atlas-de-las-pequenas-cosas",
    title: "Atlas de las pequenas cosas",
    author: "Mateo Rios",
    price: 6.25,
    condition: "GOOD",
    imageUrl: "https://placehold.co/600x900/d8e2dc/22302b?text=Libro+demo+02",
    imageAlt: "Portada ficticia de Atlas de las pequenas cosas",
    category: "Narrativa",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: null,
  },
  {
    id: "catalog-1",
    slug: "el-laberinto-de-los-espiritus",
    title: "El laberinto de los espíritus",
    author: "Carlos Ruiz Zafón",
    price: 12.5,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474291880i/31846985.jpg",
    imageAlt: "Portada de El laberinto de los espíritus, de Carlos Ruiz Zafón",
    category: "Novela Histórica",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8408163387",
  },
  {
    id: "catalog-2",
    slug: "cuentos-de-la-alhambra",
    title: "Cuentos de la Alhambra",
    author: "Washington Irving",
    price: 9.9,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388190018i/15729112.jpg",
    imageAlt: "Portada de Cuentos de la Alhambra, de Washington Irving",
    category: "Novela Histórica",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8498404889",
  },
  {
    id: "catalog-3",
    slug: "el-principito",
    title: "El principito",
    author: "Antoine de Saint-Exupéry",
    price: 8.5,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg",
    imageAlt: "Portada de El principito, de Antoine de Saint-Exupéry",
    category: "Infantil",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8498381498",
  },
  {
    id: "catalog-4",
    slug: "donde-viven-los-monstruos",
    title: "Donde viven los monstruos",
    author: "Maurice Sendak",
    price: 11.0,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388434560i/19543.jpg",
    imageAlt: "Portada de Donde viven los monstruos, de Maurice Sendak",
    category: "Infantil",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8488342418",
  },
  {
    id: "catalog-5",
    slug: "cien-anos-de-soledad",
    title: "Cien años de soledad",
    author: "Gabriel García Márquez",
    price: 13.95,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg",
    imageAlt: "Portada de Cien años de soledad, de Gabriel García Márquez",
    category: "Joyas Literarias",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8497592204",
  },
  {
    id: "catalog-6",
    slug: "ficciones",
    title: "Ficciones",
    author: "Jorge Luis Borges",
    price: 10.5,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327940176i/426504.jpg",
    imageAlt: "Portada de Ficciones, de Jorge Luis Borges",
    category: "Joyas Literarias",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8499890957",
  },
  {
    id: "catalog-7",
    slug: "romancero-gitano",
    title: "Romancero Gitano",
    author: "Federico García Lorca",
    price: 7.95,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388279883i/1054236.jpg",
    imageAlt: "Portada de Romancero Gitano, de Federico García Lorca",
    category: "Poesía",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8437601140",
  },
  {
    id: "catalog-8",
    slug: "el-profeta",
    title: "El profeta",
    author: "Gibrán Jalil Gibrán",
    price: 8.0,
    condition: "LIKE_NEW",
    imageUrl:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388185509i/2547.jpg",
    imageAlt: "Portada de El profeta, de Gibrán Jalil Gibrán",
    category: "Pensamiento",
    stock: 1,
    status: "PUBLISHED",
    amazonAffiliateUrl: "https://www.amazon.es/dp/8441400266",
  },
  ...catalogBooks.map<PublicBook>((b, i) => ({
    // catalog-1..8 ya los ocupan los ejemplares de la fase anterior: desplazamos.
    id: `catalog-${i + 9}`,
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
  })),
];

export const demoReviews: PublicReview[] = [
  {
    id: "demo-review-1",
    slug: "la-luz-de-las-horas-resena",
    title: "La luz de las horas",
    author: "Clara Valdes",
    synopsis:
      "Una novela ficticia sobre memoria, tiempo y los lugares que elegimos conservar.",
    content:
      "Esta reseña de demostración explora cómo una historia puede volver a nosotros con cada lectura. La voz narrativa encuentra belleza en lo cotidiano y deja espacio para que cada persona lectora complete el viaje.",
    rating: 4,
    coverUrl: "https://placehold.co/600x900/e7dfcf/22302b?text=Resena+demo",
    coverAlt: "Portada ficticia de La luz de las horas",
    amazonAffiliateUrl: "https://www.amazon.es/",
    instagramUrl:
      "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date("2026-08-23T00:00:00.000Z"),
    status: "PUBLISHED",
    book: demoBooks[0],
  },
];
