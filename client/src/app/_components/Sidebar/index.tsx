"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4 "
        } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "text-white bg-blue-200" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span
          className={`font-medium text-gray-700 ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarLinks = [
    { href: "/dashboard", icon: Layout, label: t("Sidebar.dashboard") },
    { href: "/inventory", icon: Archive, label: t("Sidebar.inventory") },
    { href: "/products", icon: Clipboard, label: t("Sidebar.products") },
    { href: "/sales", icon: ShoppingCart, label: t("Sidebar.sales") },
    { href: "/purchases", icon: Package, label: t("Sidebar.purchases") },
    { href: "/customers", icon: User, label: t("Sidebar.customers") },
    { href: "/settings", icon: SlidersHorizontal, label: t("Sidebar.settings") },
    { href: "/expenses", icon: CircleDollarSign, label: t("Sidebar.expenses") },
  ];

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };
  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;
  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div>Logo</div>
        <h1
          className={`font-extrabold text-2xl ${
            isSidebarCollapsed ? "hidden" : "block"
          }`}
        >
          GESTOCK
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
      {/* LINKS */}
      <div className="flex-grow mt-8">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isCollapsed={isSidebarCollapsed}
          />
        ))}
      </div>
      {/* FOOTER */}
      <div className={`mb-10 ${isSidebarCollapsed ? "hidden" : "block"}`}>
        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} GeStock
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
