This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
Store Builder for WhatsApp Ordering
Overview

Store Builder for WhatsApp Ordering is a lightweight platform that enables small businesses to create and manage their own online store without coding, allowing customers to browse products and place structured orders directly via WhatsApp.

The system provides a simple storefront experience for customers and an admin API layer for managing products, categories, promotions, Deliveries, and orders.

It is designed especially for:

home-based businesses
sweet shops and bakeries
restaurants with limited menus
Instagram / WhatsApp sellers
local retailers without full e-commerce infrastructure
Vision

The long-term goal is to evolve this project into a self-service store builder platform where users can:

create their own store
manage products through an admin interface
configure delivery and promotions
customize branding
publish instantly
receive structured WhatsApp orders automatically

All without writing code.

Current MVP Features

Customer storefront:

browse categories
open product details
select product options
add notes to items
manage cart
apply promo codes
choose delivery or pickup
send order via WhatsApp

Admin APIs:

manage categories
manage products
manage promotions
manage order status

Backend architecture:

file-based storage (DB-ready design)
modular storage adapters
promo engine
pricing engine
delivery logic
admin PIN protection
Architecture (Current)
Next.js App Router
│
├── Storefront (Customer UI)
├── Admin APIs
│   ├── Products API
│   ├── Categories API
│   ├── Promos API
│   └── Orders API
│
├── Storage Layer
│   ├── file adapter (active)
│   └── db adapter (planned)
│
└── WhatsApp checkout generator
Roadmap

Planned next improvements:

store settings API
delivery areas management
admin dashboard UI
authentication layer
database adapter
multi-store capability
optional payment integration
Odoo back-office integration
Target Users

This platform is designed for small businesses that:

sell through WhatsApp today
need a simple ordering website
don’t want complex e-commerce systems
want fast deployment without developers
Project Status

Active development — MVP backend and admin APIs implemented.
