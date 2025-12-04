"use client";
import React from "react";
import Header from "@/app/_components/Header";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import SettingsForm from "@/app/users/components/SettingsForm";

const UserSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  console.log("i18n object in Settings page:", i18n);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="w-full">
      <Header name={t("Settings.title")} />
      <div className="mt-5 p-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {t("Settings.accountDetails")}
        </h2>
        <SettingsForm />
      </div>

      <div className="mt-5 p-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {t("Settings.preferences")}
        </h2>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Settings.darkMode")}
          </span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 transition peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("Settings.language")}
          </span>
          <select
            className="block w-1/3 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={i18n.language}
            onChange={handleLanguageChange}
          >
            <option value="en">{t("Settings.english")}</option>
            <option value="es">{t("Settings.spanish")}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
