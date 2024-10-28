"use client";

import { useState } from "react";
import axios from "axios";

const SendEmailButton: React.FC = () => {
  const [status, setStatus] = useState<string>("");

  const handleSendEmails = async () => {
    setStatus("Sending emails...");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/email/send-email`,
        {}, // Send any data if needed
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setStatus("Emails sent successfully!");
      } else {
        setStatus(`Failed to send emails: ${response.data.error}`);
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
