export const categories = [
  {
    slug: "kunafa",
    title: "كنافة",
    description: "كنافة طازجة يوميًا.",
    image: "/images/knafeh.jpg", // ✅ صورة القسم
  },
  {
    slug: "baklava",
    title: "بقلاوة",
    description: "بقلاوة مشكلة ومميزة.",
    image: "/images/Bklava.jpg",
  },
  {
    slug: "jato",
    title: "جاتو",
    description: "جاتوه مشكله.",
    image: "/images/jato.jpg",
  },
];

export const products = [
  {
    id: "k1",
    slug: "kunafa-nabulsiya", // ✅ مهم لصفحة المنتج لاحقًا
    categorySlug: "kunafa",
    name: "كنافة نابلسية",
    description: "جبنة نابلسية أصلية.",
    images: ["/images/knafeh.jpg", "/images/knafeh.jpg", "/images/knafeh.jpg"],
    featured: true, // ✅
    options: [
      { label: "نصف كيلو", price: 2.75 },
      { label: "كيلو", price: 5.5 },
    ],
  },
  {
    id: "b1",
    slug: "baklava-mix",
    categorySlug: "baklava",
    name: "بقلاوة مشكلة",
    description: "مزيج فاخر من الأصناف.",
    images: ["/images/Bklava.jpg", "/images/Bklava.jpg", "/images/Bklava.jpg"],
    featured: true, // ✅
    options: [
      { label: "نصف كيلو", price: 8 },
      { label: "كيلو", price: 16 },
    ],
  },
  {
    id: "j1",
    slug: "jato-cake",
    categorySlug: "jato",
    name: "جاتو",
    description: "قوالب قاتو مشكله طازجة.",
    images: ["/images/jato.jpg", "/images/knafeh.jpg", "/images/jato.jpg"],
    featured: true, // ✅
    options: [
      { label: "قالب كبير", price: 9 },
      { label: "قالب وسط", price: 7 },
      { label: "قالب صغير", price: 5 },
    ],
  },
];
