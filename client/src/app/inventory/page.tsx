"use client";

import { useGetProductsQuery } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import Header from "@/app/_components/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatCurrency } from "@/lib/currency";

import { useTranslation } from "react-i18next";

const Inventory = () => {
  const { t } = useTranslation();
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const columns: GridColDef[] = [
    { field: "productId", headerName: t("Inventory.id"), width: 90 },
    { field: "name", headerName: t("Inventory.productName"), width: 200 },
    {
      field: "price",
      headerName: t("Inventory.price"),
      width: 110,
      type: "number",
      valueGetter: (value, row) => formatCurrency(row.price),
    },
    {
      field: "rating",
      headerName: t("Inventory.rating"),
      width: 110,
      type: "number",
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
    },
    {
      field: "stockQuantity",
      headerName: t("Inventory.stockQuantity"),
      width: 150,
      type: "number",
    },
  ];

  if (isLoading) {
    return <div className="py-4">{t("Inventory.loading")}</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        {t("Inventory.error")}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name={t("Inventory.title")} />
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
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
    </div>
  );
};

export default Inventory;