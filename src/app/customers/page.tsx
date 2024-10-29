"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";
import { Customer } from "../types";

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers`)
      .then((response) => {
        console.log(response.data); // Check
        setCustomers(response.data);
      });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Customer List</h1>
        <Link
          href="/customers/new"
          className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Create New Customer
        </Link>
        {customers.length === 0 ? (
          <p className="text-gray-600">No customers found.</p>
        ) : (
          <ul className="bg-white shadow-md rounded-lg">
            {customers.map((customer) => (
              <li
                key={customer.id}
                className="border-b last:border-b-0 hover:bg-gray-100 transition duration-200"
              >
                <Link
                  href={`/customers/${customer.id}`}
                  className="flex justify-between items-center py-4 px-6 text-gray-700"
                >
                  <span>
                    <strong>{customer.name}</strong>, {customer.email},{" "}
                    {customer.phone}
                  </span>
                  <span className="text-gray-500">
                    Last Visit: {customer.latestVisitDate}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
