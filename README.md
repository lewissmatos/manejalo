# 💰 Manejalo!

**Manejalo** is a minimalist, privacy-focused web app that helps you track your personal budget, visualize your expenses, and stay on top of your financial goals — month after month.

---

## 🚀 Features

- 📅 **Create Monthly Budgets**: Define how much to spend on each category.
- 📊 **Visualize Your Spending**: Get clean, clear charts and summaries.
- 🧾 **Track Your History**: Access filtered expense records by month and category.
- 🚦 **Stay Within Limits**: Know instantly if you're overspending or on track.
- 🗂️ **Categorize Everything**: Custom categories for your financial life.
- ✨ **More Features Coming Soon**: Stay tuned for savings tracking, debt logs, and more.

---

## 🛠️ Tech Stack

| Area             | Stack/Library                                                              |
| ---------------- | -------------------------------------------------------------------------- |
| Web Framework    | [Next.js 15 (App Router)](https://nextjs.org)                              |
| UI Styling       | [TailwindCSS](https://tailwindcss.com/) + [HeroUI](https://www.heroui.com) |
| State Management | [Jotai](https://jotai.org/)                                                |
| Data & Backend   | [Supabase](https://supabase.com/) + [Prisma](https://prisma.io/)           |
| Auth             | Supabase Auth                                                              |
| Charts           | [ApexCharts](https://apexcharts.com/)                                      |
| Deployment       | [Vercel](https://vercel.com)                                               |

---

## 📦 Project Structure

```
/app
  ├── (auth)          # Auth routes & forms
  ├── dashboard       # Main app layout & budget views
  ├── server-actions  # Server actions for auth, budgets, etc
  └── components      # UI components
/lib
  ├── supabase        # Supabase client helpers
  ├── prisma          # Prisma client
  └── jotai           # Global atoms
```

---

## 🧪 Setup & Development

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/manejalo.git
cd manejalo

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL, etc.

# 4. Generate Prisma types (after db pull)
npx prisma generate

# 5. Run the dev server
pnpm dev
```

---

## 🔐 Auth & Middleware

- Auth handled via Supabase (email/password with email verification)
- Protected routes (e.g. `/dashboard/*`) use `middleware.ts` with cookie/session check
- Auth state is synced between server (via cookies) and client (Jotai + Supabase listener)

---

## 🗂️ Future Improvements

- 💸 Income and savings tracking
- 🤝 Debt & loans logging
- 📱 Mobile-first polish
- 🔔 Notifications & reminders
- 🔄 Import/export transactions

---

## 🧑‍💻 Author

**Lewis Matos**  
[LinkedIn](https://linkedin.com/in/lewissmatos) | [GitHub](https://github.com/lewissmatos)

---

## 📄 License

MIT License
