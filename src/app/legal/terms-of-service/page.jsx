import React from "react";

const TermsOfService = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4 text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold text-white pt-4">1. Acceptance of Terms</h2>
        <p>
          By adding or using the AstroStats Discord bot ("Bot"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Bot.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">2. Use of the Bot</h2>
        <p>
          The Bot is provided for entertainment and informational purposes related to horoscopes and game statistics. You agree to use the Bot in compliance with Discord's Terms of Service and Community Guidelines.
        </p>
        <p>
          You agree not to misuse the Bot, including but not limited to: spamming commands, attempting to exploit vulnerabilities, or using the Bot for any illegal or unauthorized purpose.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">3. Data Collection</h2>
        <p>
          Our data collection practices are outlined in our Privacy Policy. By using the Bot, you consent to the data practices described therein.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">4. Availability and Accuracy</h2>
        <p>
          While we strive to keep the Bot operational and the information provided (like game stats and horoscopes) accurate and up-to-date, we make no guarantees regarding its availability, reliability, or accuracy. Data from third-party APIs may be subject to delays or inaccuracies beyond our control. Horoscopes are provided for entertainment purposes only.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">5. Limitation of Liability</h2>
        <p>
          AstroStats and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Bot; (b) any conduct or content of any third party on the Bot; or (c) unauthorized access, use, or alteration of your transmissions or content.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of significant changes, often by updating the "Last updated" date. Your continued use of the Bot after such changes constitutes your acceptance of the new Terms.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">7. Termination</h2>
        <p>
          We may suspend or terminate your access to the Bot at any time, for any reason, including violation of these Terms or Discord's policies, without prior notice or liability.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us through our support Discord server.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
