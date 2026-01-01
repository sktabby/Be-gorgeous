💍 BeGorgeous — Premium Anti-Tarnish Jewellery Boutique

BeGorgeous is a modern, minimal, and elegant jewellery boutique website built to showcase and sell anti-tarnish jewellery.
The platform focuses on visual aesthetics, smooth browsing, and instant WhatsApp ordering, paired with a single admin panel for easy product and category management.

This project is designed for small boutique businesses that want an online presence without complex checkout systems, keeping things simple, fast, and personal.

🌟 Project Highlights

✨ Premium & elegant UI inspired by luxury jewellery brands
📱 Fully responsive (mobile-first & desktop friendly)
🛍️ Category-based product browsing
📸 High-quality image handling via Cloudinary
🧾 WhatsApp-based ordering (no payment gateway required)
🧑‍💼 Secure admin panel for managing products & categories
🔥 Firebase-powered backend (fast, scalable, serverless)

🧠 Project Vision

The goal of BeGorgeous is to:

Offer a beautiful catalogue experience

Avoid heavy e-commerce complexity

Enable direct buyer–seller communication

Allow non-technical admins to manage products easily

Maintain premium branding & performance

🧩 Core Features
🏠 Public Website

Elegant home page with hero banner

Jewellery categories (Rings, Earrings, Bracelets, Necklaces, Combos)

Featured products section

Product detail pages with:

Images

Price

Size

Description

Care instructions

Cart system (local storage based)

One-click WhatsApp order redirection

🛒 WhatsApp Order Flow

User adds products to cart

Clicks “Order on WhatsApp”

Automatically redirected to WhatsApp with:

Product names

Quantities

Prices

Total amount

Business owner receives structured order message

✔ No login required
✔ No payment gateway
✔ Very fast & personal ordering experience

🧑‍💼 Admin Panel

Secure admin authentication (Firebase)

Create, edit, delete categories

Upload products with:

Multiple images

Category mapping

Price, size & care details

Image uploads handled via Cloudinary

Instant updates reflected on public website

🧱 Tech Stack
Frontend

React (Vite)

JavaScript (ES6+)

CSS (custom premium theme)

Responsive layout (mobile & desktop)

Backend / Services

Firebase

Firestore (database)

Authentication

Cloudinary

Image storage & CDN

WhatsApp Click-to-Chat API

⚡ No traditional backend server required
⚡ Fully serverless architecture

🎨 UI & Design Philosophy

Warm antique-inspired color palette

Minimal layouts with generous spacing

Luxury typography & subtle shadows

No clutter, no over-animations

Jewellery is always the hero ✨

📁 Project Structure
Be-gorgeous/
│
├── src/
│   ├── assets/              # Images & static assets
│   ├── components/
│   │   ├── home/            # Home page sections
│   │   ├── products/        # Product cards & UI
│   ├── pages/
│   │   ├── public/          # Public pages
│   │   ├── admin/           # Admin dashboard
│   ├── services/            # Firebase & API services
│   ├── store/               # Cart logic (local storage)
│   ├── layouts/             # Page layouts
│   ├── index.css            # Global theme styles
│   └── main.jsx
│
├── .env
├── package.json
└── README.md

🔐 Authentication & Security

Firebase Authentication for admins

Admin routes protected

No user login required for customers

Cart stored locally (privacy-friendly)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/sktabby/Be-gorgeous.git
cd Be-gorgeous

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file:

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

4️⃣ Run the Project
npm run dev

☁️ Firebase Setup

Create a Firebase project

Enable:

Firestore Database

Authentication (Email/Password or Google)

Add web app credentials

Update Firebase config in:

src/app/firebase/

📸 Image Handling (Cloudinary)

Images uploaded from admin panel

Stored securely in Cloudinary

Fast global CDN delivery

Optimized loading & caching

🚀 Performance & Optimization

Lazy loading where applicable

Optimized images

Minimal dependencies

Vite for fast development & build

🧪 Current Limitations

No online payment gateway

No order history storage (WhatsApp-based)

Admin-only authentication

(These are intentional design choices for simplicity)

🔮 Future Enhancements

Order saving in Firestore

Payment gateway (Razorpay / Stripe)

Admin analytics dashboard

Customer wishlist

SEO improvements

Progressive Web App (PWA)

📜 License

This project is licensed for personal & educational use.
For commercial usage, please contact the author.
