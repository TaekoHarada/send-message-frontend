"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";
import { MailTemplate } from "../types";

export default function MailTemplateList() {
  const [mailTemplates, setMailTemplates] = useState<MailTemplate[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails`)
      .then((response) => {
        setMailTemplates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mail templates:", error);
      });
  }, []);

  const handleSendMail = async (templateId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/emails/send-mail`,
        {
          templateId,
        }
      );
      alert("Mail sent successfully!");
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send mail.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Mail Templates List</h1>
        <Link
          href="/emails/new"
          className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Create New Mail Template
        </Link>
        {mailTemplates.length === 0 ? (
          <p className="text-gray-600">No mail templates found.</p>
        ) : (
          <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
            {mailTemplates.map((template) => (
              <li
                key={template.id}
                className="flex justify-between items-center py-4 px-6 hover:bg-gray-100 transition duration-200"
              >
                <Link
                  href={`/emails/${template.id}`}
                  className="text-gray-800 font-medium"
                >
                  <span className="px-5">{template.title}</span>
                  <span className="text-gray-500 truncate">
                    {template.message.slice(0, 50)}...
                  </span>
                </Link>
                <button
                  onClick={() => handleSendMail(template.id)}
                  className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                  Send Mail
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
