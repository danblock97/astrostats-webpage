import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="p-6 rounded-lg shadow-lg max-w-3xl mx-auto my-10">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="mb-2">
                Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect while operating our bot.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Information Collection and Use</h2>
            <p className="mb-2">
                Our bot does not collect or store any personal data from its users. All data used by the bot is temporary and only used for the duration of the command's execution.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Third-Party Services</h2>
            <p className="mb-2">
                Our bot does not share any data with third-party services. We do not collect or store any user data, so there is nothing to share or distribute.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Changes to the Privacy Policy</h2>
            <p className="mb-2">
                We may update our Privacy Policy from time to time. We encourage users to frequently check this page for any changes. Your continued use of the bot after any changes constitutes your acceptance of the new Privacy Policy.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
