
import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/_components/Header";

type CustomerFormData = {
  name: string;
  email: string;
};

type CreateCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CustomerFormData) => void;
};

import { useTranslation } from "react-i18next";

const CreateCustomerModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateCustomerModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name={t("CreateCustomerModal.title")} />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* CUSTOMER NAME */}
          <label htmlFor="customerName" className={labelCssStyles}>
            {t("CreateCustomerModal.customerName")}
          </label>
          <input
            type="text"
            name="name"
            placeholder={t("CreateCustomerModal.namePlaceholder")}
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* EMAIL */}
          <label htmlFor="customerEmail" className={labelCssStyles}>
            {t("CreateCustomerModal.email")}
          </label>
          <input
            type="email"
            name="email"
            placeholder={t("CreateCustomerModal.emailPlaceholder")}
            onChange={handleChange}
            value={formData.email}
            className={inputCssStyles}
            required
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            {t("CreateCustomerModal.create")}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            {t("CreateCustomerModal.cancel")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerModal;
