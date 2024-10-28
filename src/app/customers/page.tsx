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
      <h1>Customer List</h1>
      <Link href="/customers/new">Create New Customer</Link>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            <Link href={`/customers/${customer.id}`}>
              {customer.name}, {customer.email}, {customer.phone},
              {customer.latestVisitDate}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
