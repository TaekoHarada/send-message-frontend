"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Customer } from "../../types"; // Importing the Customer interface
import Layout from "../../components/Layout";

export default function CustomerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null); // Added state for id

  // Unwrap params using React.use()
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params; // Unwrap the params
      setId(resolvedParams.id); // Set the id
    };

    getParams();
  }, [params]);

  // Handle fetching customer details or initializing for new customer
  useEffect(() => {
    if (!id) return; // Exit if id is not available

    if (id === "new") {
      setCustomer({
        id: "",
        name: "",
        email: "",
        phone: "",
        latestVisitDate: "",
      });
      setIsEditing(false);
      setLoading(false); // No need to show loading for new customer
      return;
    }

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get<Customer>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${id}`
        );
        console.log("get customer response", response.data); // Check
        setCustomer(response.data);
        setIsEditing(true); // Set to true only after fetching data
      } catch (error) {
        console.error("Error fetching customer:", error);
        setError("Failed to fetch customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customer) {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${id}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers`;
    const method = isEditing ? "PUT" : "POST";

    try {
      console.log("customer", customer);
      await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data: customer,
      });
      router.push("/customers");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/${id}`
      );
      router.push("/customers");
    } catch (error) {
      console.error("Error deleting customer:", error);
      setError("Failed to delete customer.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading customer details...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {isEditing ? "Edit Customer" : "Create New Customer"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={customer?.name || ""}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={customer?.email || ""}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone:
            </label>
            <input
              type="tel"
              name="phone"
              value={customer?.phone || ""}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Latest Visit Date:
            </label>
            <input
              type="date"
              name="latestVisitDate"
              value={customer?.latestVisitDate || ""}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            {isEditing ? "Update Customer" : "Create Customer"}
          </button>
        </form>
        {isEditing && (
          <button
            onClick={handleDelete}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
          >
            Delete Customer
          </button>
        )}
      </div>
    </Layout>
  );
}
