"use client";

import React, { useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Header from "@/app/_components/Header";
import { useAppDispatch, useAppSelector } from "../redux";
import { setIsDarkMode } from "@/state";
import { useTranslation } from "react-i18next";
import { useUpdateUserMutation, useChangePasswordMutation } from "@/state/api";
import toast from "react-hot-toast";

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    "data" in error
  );
}

const Settings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const account = useAppSelector((state) => state.auth.account);

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const isLoading = isUpdatingUser || isChangingPassword;

  const handleSaveChanges = async () => {
    try {
      // Change password
      if (currentPassword || newPassword || confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          toast.error(t("Settings.passwordMismatch"));
          return;
        }
        if (!currentPassword) {
          toast.error(t("Settings.currentPasswordRequired"));
          return;
        }
        await changePassword({ currentPassword, newPassword }).unwrap();
        toast.success(t("Settings.passwordChangeSuccess"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const apiError = error.data as { message: string };
        toast.error(apiError.message || t("Settings.updateError"));
      } else {
        toast.error(t("Settings.updateError"));
      }
    }
  };

  const handleLanguageChange = (language: string) => {
    const languageCode = language === "english" ? "en" : "es";
    i18n.changeLanguage(languageCode);
  };

  const handleThemeChange = (isDark: boolean) => {
    dispatch(setIsDarkMode(isDark));
  };

  return (
    <div className="w-full">
      <Header name={t("Settings.title")} />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile and Password Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t("Settings.profile")}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Settings.name")}
              </label>
              <input
                type="text"
                value={account?.name || ""}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Settings.email")}
              </label>
              <input
                type="email"
                value={account?.email || ""}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-white">
              {t("Settings.password")}
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Settings.currentPassword")}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Settings.newPassword")}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Settings.confirmNewPassword")}
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? t("Settings.saving") : t("Settings.save")}
            </button>
          </div>
        </div>

        {/* Appearance Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t("Settings.appearance")}
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="darkModeToggle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("Settings.darkMode")}
              </label>
              <label className="inline-flex relative items-center cursor-pointer mt-2">
                <input
                  type="checkbox"
                  id="darkModeToggle"
                  className="sr-only peer"
                  checked={isDarkMode}
                  onChange={(e) => handleThemeChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Language Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t("Settings.language")}
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="languageSelect"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("Settings.language")}
              </label>
              <select
                id="languageSelect"
                value={i18n.language === "en" ? "english" : "spanish"}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              >
                <option value="english">{t("Settings.english")}</option>
                <option value="spanish">{t("Settings.spanish")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
