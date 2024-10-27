"use client";

import { useState } from "react";

const SendEmailButton: React.FC = () => {
  const [status, setStatus] = useState<string>("");

  const handleSendEmails = async () => {
    setStatus("Sending emails...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatus("Emails sent successfully!");
      } else {
        setStatus(`Failed to send emails: ${data.error}`);
      }
    } catch (error) {
      setStatus("Error sending emails.");
    }
  };

  return (
    <div>
      <button
        onClick={handleSendEmails}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Send Email to Customers
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendEmailButton;
