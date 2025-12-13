"use client";

import Sidebar from "@/app/components/Sidebar";
import OrderTable from "@/app/components/OrderTable";
import useOrders from "@/store/useOrders";
import useOrdersHook from "@/hooks/useOrders";

export default function ProfilePageContent() {
  const { orders } = useOrders();
  const {
    pagination,
    orderTab,
    setOrderTab,
    handleDeleteOrder,
    handleSquareOff,
    handleUpdateNotes,
    handlePageChange,
    handleUpdateTrade,
  } = useOrdersHook();

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-8xl mx-auto">
            <OrderTable
              orders={orders}
              pagination={pagination}
              orderTab={orderTab}
              onSquareOff={handleSquareOff}
              onDeleteOrder={handleDeleteOrder}
              onUpdateTrade={handleUpdateTrade}
              onUpdateNotes={handleUpdateNotes}
              onPageChange={handlePageChange}
              onOrderTabChange={setOrderTab}
            />
          </div>
        </main>
      </div>
    </>
  );
}
