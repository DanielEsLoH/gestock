"use client";

import { useState } from "react";
import { useGetPurchasesQuery, useCreatePurchaseMutation, type NewPurchase } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/_components/Header";
import CreatePurchaseModal from "./components/CreatePurchaseModal";
import { formatCurrency } from "@/lib/currency";

const Purchases = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: purchases, isLoading, isError } = useGetPurchasesQuery();
  const [createPurchase] = useCreatePurchaseMutation();

  const handleCreatePurchase = async (purchaseData: NewPurchase) => {
    await createPurchase(purchaseData);
  };

  const columns: GridColDef[] = [
    { field: "purchaseId", headerName: "Purchase ID", width: 120 },
    {
      field: "product",
      headerName: "Product",
      width: 200,
      valueGetter: (value, row) => row.product?.name || "N/A",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      type: "number",
    },
    {
      field: "unitCost",
      headerName: "Unit Cost",
      width: 130,
      type: "number",
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      width: 150,
      type: "number",
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: "timestamp",
      headerName: "Date",
      width: 200,
      valueFormatter: (value) => {
        if (!value) return "";
        return new Date(value).toLocaleString();
      },
    },
  ];

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch purchases
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header name="Purchases" />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => setIsModalOpen(true)}
        >
          Record New Purchase
        </button>
      </div>

      <DataGrid
        rows={purchases || []}
        columns={columns}
        getRowId={(row) => row.purchaseId}
        loading={isLoading}
        checkboxSelection
        className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 !text-gray-700 dark:!text-gray-200"
        sx={{
          "& .MuiDataGrid-root": {
            backgroundColor: "var(--background-color)",
          },
          "& .MuiDataGrid-main": {
            backgroundColor: "var(--background-color)",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "var(--background-color)",
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            backgroundColor: "var(--background-color) !important",
          },
          "& .MuiDataGrid-virtualScrollerRenderZone": {
            backgroundColor: "var(--background-color) !important",
          },
          "& .MuiDataGrid-row": {
            backgroundColor: "var(--background-color) !important",
          },
          "& .MuiDataGrid-filler": {
            backgroundColor: "var(--background-color) !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "var(--text-color) !important",
            fontWeight: "bold !important",
          },
          "& .MuiDataGrid-cell": {
            color: "var(--text-color) !important",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "var(--hover-color) !important",
          },
          "& .MuiCheckbox-root": {
            color: "var(--text-color) !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "var(--header-background) !important",
          },
          "--background-color": "rgb(255, 255, 255)",
          ".dark &": {
            "--background-color": "rgb(31, 41, 55)",
            "--text-color": "rgb(229, 231, 235)",
            "--hover-color": "rgb(55, 65, 81)",
            "--header-background": "rgb(17, 24, 39)",
          },
          ".light &": {
            "--background-color": "rgb(255, 255, 255)",
            "--text-color": "rgb(55, 65, 81)",
            "--hover-color": "rgb(243, 244, 246)",
            "--header-background": "rgb(249, 250, 251)",
          },
        }}
      />

      <CreatePurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreatePurchase}
      />
    </div>
  );
};

export default Purchases;
