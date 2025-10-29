"use client";

import { useState } from "react";
import { useGetCustomersQuery, useCreateCustomerMutation } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import Header from "@/app/_components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CreateCustomerModal from "./components/CreateCustomerModal";

import { useTranslation } from "react-i18next";

const Customers = () => {
  const { t } = useTranslation();
  const { data: customers, isError, isLoading } = useGetCustomersQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "customerId", headerName: t("Customers.id"), width: 90 },
    { field: "name", headerName: t("Customers.name"), width: 200 },
    { field: "email", headerName: t("Customers.email"), width: 200 },
  ];

  const handleCreateCustomer = async (formData: { name: string; email: string }) => {
    try {
      await createCustomer(formData).unwrap();
    } catch (error) {
      console.error("Failed to create customer:", error);
    }
  };

  if (isLoading) {
    return <div className="py-4">{t("Customers.loading")}</div>;
  }

  if (isError || !customers) {
    return (
      <div className="text-center text-red-500 py-4">{t("Customers.error")}</div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <Header name={t("Customers.title")} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("Customers.addCustomer")}
        </button>
      </div>
      <DataGrid
        rows={customers}
        columns={columns}
        getRowId={(row) => row.customerId}
        checkboxSelection
        className="mt-5"
        sx={{
          backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          border: isDarkMode ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
          borderRadius: "0.5rem",
          boxShadow: isDarkMode ? "0 1px 3px 0 rgb(0 0 0 / 0.3)" : "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          "& .MuiDataGrid-container--top [role=row]": {
            backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)",
            color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(17, 24, 39)",
          },
          "& .MuiDataGrid-cell": {
            color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)",
            borderBottom: isDarkMode ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)",
            color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(17, 24, 39)",
            borderBottom: isDarkMode ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(17, 24, 39)",
            fontWeight: "600",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)",
            color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(17, 24, 39)",
            borderTop: isDarkMode ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
          },
          "& .MuiCheckbox-root": {
            color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
          },
          "& .MuiDataGrid-main": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          },
          "& .MuiDataGrid-virtualScrollerRenderZone": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          },
          "& .MuiDataGrid-row": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
            "&:hover": {
              backgroundColor: `${isDarkMode ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)"} !important`,
            },
          },
          "& .MuiDataGrid-overlayWrapper": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          },
          "& .MuiDataGrid-filler": {
            backgroundColor: `${isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)"} !important`,
          },
          "& .MuiDataGrid-scrollbar": {
            backgroundColor: isDarkMode ? "rgb(17, 24, 39)" : "rgb(255, 255, 255)",
          },
          "& .MuiTablePagination-root": {
            color: isDarkMode ? "rgb(229, 231, 235)" : "rgb(55, 65, 81)",
          },
          "& .MuiIconButton-root": {
            color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
          },
        }}
      />
      <CreateCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCustomer}
      />
    </div>
  );
};

export default Customers;
