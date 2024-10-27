// pages/send-email.tsx
import { useState } from "react";

const SendEmail: React.FC = () => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSendEmail = async (): Promise<void> => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "recipient@example.com",
          subject: "Test Email",
          text: "Hello, this is a test email!",
        }),
      });

      if (!response.ok) {
        throw new Error("Email could not be sent.");
      }

      setEmailSent(true);
    } catch (error: any) {
      // Specify the error type as 'any'
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Send Email</h1>
      <button onClick={handleSendEmail}>Send Email</button>
      {emailSent && <p>Email sent successfully!</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default SendEmail;
