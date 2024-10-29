"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { MailTemplate } from "../../types";
import Layout from "../../components/Layout";

interface PageProps {
  params: { id: string };
}

export default function MailTemplateDetail({ params }: PageProps) {
  const router = useRouter();
  const [mailTemplate, setMailTemplate] = useState<MailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
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
      setMailTemplate({ id: "", title: "", message: "" });
      setIsEditing(false);
      setLoading(false); // No need to show loading for new customer
      return;
    }

    const fetchMailDetails = async () => {
      try {
        const response = await axios.get<MailTemplate>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails/${id}`
        );
        console.log("get mail response", response.data); // Check
        setMailTemplate(response.data);
        setIsEditing(true); // Set to true only after fetching data
      } catch (error) {
        console.error("Error fetching mail:", error);
        setError("Failed to fetch mail details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMailDetails();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMailTemplate((prevTemplate) =>
      prevTemplate ? { ...prevTemplate, [e.target.name]: e.target.value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailTemplate) return;

    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails/${id}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails`;
    const method = isEditing ? "PUT" : "POST";

    try {
      await axios({
        method,
        url,
        headers: { "Content-Type": "application/json" },
        data: mailTemplate,
      });
      router.push("/emails");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit form.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading mail template details...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          {isEditing ? "Edit Mail Template" : "Create New Mail Template"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={mailTemplate?.title || ""}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={mailTemplate?.message || ""}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            {isEditing ? "Update Mail Template" : "Create Mail Template"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
