import React from 'react';

const TermsOfService = () => {
    return (
        <div className="p-6 rounded-lg shadow-lg max-w-3xl mx-auto my-10">
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="mb-2">
                Welcome to our Discord bot. By using our bot, you agree to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this bot.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Usage of the Bot</h2>
            <p className="mb-2">
                Our bot can be added to servers and allows users to track their player stats for different commands as well as access a daily horoscope. None of the data is ever stored.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Prohibited Actions</h2>
            <p className="mb-2">
                Users are prohibited from using the bot for any illegal or unauthorized purpose. You must not, in the use of the bot, violate any laws in your jurisdiction.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Changes to the Terms</h2>
            <p className="mb-2">
                We reserve the right to modify these terms at any time. You should check this page regularly. Your continued use of the bot after any changes constitutes your acceptance of the new terms.
            </p>
            <h2 className="text-2xl font-semibold mt-4 mb-2">Contact Us</h2>
            <p>
                If you have any questions about these Terms, please contact us.
            </p>
        </div>
    );
};

export default TermsOfService;
