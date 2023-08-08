"use client";

import PaymentTable from "@/app/components/payment/PaymentTable";
import { useState } from "react";
import CreateDelivery from "@/app/components/delivery/CreateDelivery"

export default function Delivery({ params }: { params: { id: string } }) {
  const [toggleCreate, setToggleCreate] = useState(false);

  const buttonSelected = 'inline-flex items-center px-3 py-2 text-md font-normal text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700'
  const buttonUnselected = 'inline-flex items-center px-3 py-2 text-md font-normal text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:focus:ring-gray-700'

  return (
    <div className="mx-auto sm:px-6 lg:px-8">
      <p className="text-2xl font-bold text-gray-100 p-6 text-center">
        {toggleCreate
          ? "Crear un abono para la campaña: "
          : "Abonos para la campaña: "}
        {params.id}
      </p>
      <div className="mx-auto flex flex-row">
        <nav className="flex justify-between mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center mb-3 sm:mb-0">
            <li>
              <div className="flex items-center">
                <button
                  id="dropdownProject"
                  data-dropdown-toggle="dropdown-project"
                  className={toggleCreate ? buttonUnselected : buttonSelected}
                  onClick={() => {
                    setToggleCreate(false);
                  }}
                >
                  Listado de abonos
                </button>
              </div>
            </li>
            <span className="mx-2 text-gray-400">/</span>
            <li>
              <div className="flex items-center">
                <button
                  id="dropdownProject"
                  data-dropdown-toggle="dropdown-project"
                  className={toggleCreate ? buttonSelected : buttonUnselected}
                  onClick={() => {
                    setToggleCreate(true);
                  }}
                >
                  Crear abono
                </button>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      {toggleCreate ? (
        <CreateDelivery campaignId={params.id} setToggleCreate={setToggleCreate} />
      ) : (
        <PaymentTable campaignId={params.id} />
      )}
    </div>
  );
}
