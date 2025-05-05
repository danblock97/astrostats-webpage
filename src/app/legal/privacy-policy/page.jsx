import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold text-white pt-4">Introduction</h2>
        <p>
          Welcome to AstroStats. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Discord bot ("Bot").
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">Information We Collect</h2>
        <p>
          To provide the core functionality of the Bot, we collect and store the following information:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>Server ID: The unique identifier of the Discord server where the Bot is added.</li>
          <li>Server Name: The name of the Discord server.</li>
          <li>User ID: The unique identifier of a Discord user interacting with the Bot (e.g., when requesting stats).</li>
          <li>User Name: The Discord username associated with the User ID.</li>
        </ul>
        <p>
          This information is necessary for the Bot to respond to commands within specific servers and associate game statistics or horoscope requests with the correct user.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">How We Use Your Information</h2>
        <p>
          The collected information is used solely for the purpose of operating the Bot, including:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>Identifying servers for configuration or specific features.</li>
          <li>Associating user requests with their Discord account for personalized responses (e.g., fetching specific game stats).</li>
          <li>Troubleshooting and improving the Bot's performance and features.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">Data Storage and Security</h2>
        <p>
          We store the collected data securely and take reasonable measures to protect it from unauthorized access or disclosure.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">Information Not Collected</h2>
        <p>
          We do not collect any other personal information, such as email addresses, real names (unless it's part of the Discord username), physical addresses, payment information, or any data from your Discord messages that are not direct commands to the Bot.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">Data Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your collected information to outside parties.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our support Discord server.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
