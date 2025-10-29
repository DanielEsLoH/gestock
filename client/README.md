# Gestock Client Application

This is the frontend client application for Gestock, a stock management web application. It provides a user-friendly interface for managing products, customers, sales, purchases, and expenses.

## Main Technologies

*   **Framework:** [Next.js](https://nextjs.org/) (v15.5.2)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Material UI
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Data Fetching:** [Axios](https://axios-http.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **Internationalization:** [i18next](https://www.i18next.com/)

## Key Features & Improvements

*   **Multi-tenancy Support:** Data is now properly isolated between different user accounts, ensuring each user has their own distinct data (products, customers, sales, etc.).
*   **Internationalization (i18n):** The application is fully internationalized, allowing users to switch between English and Spanish from the settings page. All UI text is translated accordingly.
*   **Refactored Settings Page:** The user settings page (`/settings`) has been redesigned with a modern, card-based layout. It includes:
    *   Read-only display of user's name and email.
    *   Integrated password change functionality, requiring the current password for verification.
    *   Combined appearance (dark mode toggle) and language selection within the same page.
*   **Removed Redundant Pages:** The `/users` page has been removed, with its functionality consolidated into the refactored `/settings` page.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
