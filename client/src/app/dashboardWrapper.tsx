"use client";
import React, { useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/app/_components/Navbar";
import Sidebar from "@/app/_components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication
  useEffect(() => {
    const publicPaths = ["/login", "/register"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Show loading or nothing while checking auth
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  if (!isAuthenticated && !isPublicPath) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // For public paths (login/register), don't show sidebar/navbar
  if (isPublicPath) {
    return <div key="public-path-children">{children}</div>;
  }

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        <div key="dashboard-children">{children}</div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <I18nextProvider i18n={i18n}>
          <DashboardLayout>{children}</DashboardLayout>
        </I18nextProvider>
      </Suspense>
    </StoreProvider>
  );
};

export default DashboardWrapper;
