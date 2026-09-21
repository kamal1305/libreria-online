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
    slug: "alas-de-sangre-empireo-1",
    title: "Alas de sangre",
    author: "Rebecca Yarros",
    synopsis: "Fantasía & Romance · #1 Más leída",
    content: "¡Me obsesionó por completo! Hacía tiempo que una fantasía no me enganchaba tanto. Tensión, dragones y romance enemies-to-lovers que quema las páginas. De esas historias que te dejan con resaca literaria durante semanas.",
    rating: 5,
    coverUrl: "/covers/alas-de-sangre-empireo-1.svg",
    coverAlt: "Portada de Alas de sangre",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-2",
    slug: "el-ultimo-juego",
    title: "El último juego",
    author: "J. D. Barker",
    synopsis: "Thriller psicológico · Giros brutales",
    content: "De esos thrillers que te vuelan la cabeza. Un juego psicológico macabro transmitido en directo donde nada es lo que parece. Cada capítulo te deja sin respiración y el final te desencaja la mandíbula. ¡Imposible parar de leer!",
    rating: 5,
    coverUrl: "/covers/el-ultimo-juego.svg",
    coverAlt: "Portada de El último juego",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-3",
    slug: "el-verano-en-que-mi-madre-tuvo-los-ojos-verdes",
    title: "El verano en que mi madre tuvo los ojos verdes",
    author: "Tatiana Țîbuleac",
    synopsis: "Narrativa conmovedora · Pura emoción",
    content: "Una de las lecturas más profundas, dolorosas y hermosas que he tenido entre manos. Una prosa poética cruda que te eriza la piel. Habla del perdón, del rencor y de la fragilidad humana como pocas veces he leído.",
    rating: 5,
    coverUrl: "/covers/el-verano-en-que-mi-madre-tuvo-los-ojos-verdes.svg",
    coverAlt: "Portada de El verano en que mi madre...",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-4",
    slug: "mis-dias-en-la-libreria-morisaki",
    title: "Mis días en la librería Morisaki",
    author: "Satoshi Yagisawa",
    synopsis: "Ficción cozy · Refugio entre libros",
    content: "Un bálsamo para el corazón. Una librería de lance en el barrio tokiota de Jinbōchō, café caliente y el refugio que todos necesitamos alguna vez. Te hace desear pasar las tardes perdiéndote entre estanterías de libros con historia.",
    rating: 5,
    coverUrl: "/covers/mis-dias-en-la-libreria-morisaki.svg",
    coverAlt: "Portada de Mis días en la librería Morisaki",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-5",
    slug: "el-retiro",
    title: "El retiro",
    author: "Mark Edwards",
    synopsis: "Suspense rural · Clima absorbente",
    content: "Un refugio para escritores en mitad de un bosque apartado, desapariciones misteriosas y un suspense que se va cerrando poco a poco. Me atrapó tanto que lo devoré en un solo fin de semana de manta y lluvia.",
    rating: 5,
    coverUrl: "/covers/el-retiro.svg",
    coverAlt: "Portada de El retiro",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
  {
    id: "review-6",
    slug: "cumbres-borrascosas",
    title: "Cumbres borrascosas",
    author: "Emily Brontë",
    synopsis: "Clásico gótico · Romance tormentoso",
    content: "Una fuerza de la naturaleza convertida en novela. Pasión indomable, venganza, niebla y la atmósfera salvaje de los páramos ingleses. Es una de las joyas de mi estantería y una relectura obligatoria cada otoño.",
    rating: 5,
    coverUrl: "/covers/cumbres-borrascosas.svg",
    coverAlt: "Portada de Cumbres borrascosas",
    amazonAffiliateUrl: null,
    instagramUrl: "https://www.instagram.com/escondida_en_un_libro_?igsi=MWpoanFsZjh0MWRzYg==",
    publishedAt: new Date(),
    status: "PUBLISHED",
  },
];
