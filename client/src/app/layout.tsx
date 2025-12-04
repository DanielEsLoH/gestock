"use client";
import type { Metadata } from "next";
import { metadata } from "./metadata";
import "./globals.css";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";

import DashboardWrapper from "./dashboardWrapper";
import { Toaster } from "react-hot-toast";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <I18nextProvider i18n={i18n}>
          <DashboardWrapper>
            <Toaster key="toaster" />
            {children}
          </DashboardWrapper>
        </I18nextProvider>
      </body>
    </html>
  );
}
