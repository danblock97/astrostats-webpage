import React from "react";
import Navbar from "../components/Navbar";
import Commands from "../components/Commands";

export default function CommandsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar />
      <div className="container mt-24 mx-auto py-4 px-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Command Center</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover all the powerful features and commands AstroStats has to offer for your Discord server
          </p>
          <div className="mt-6 w-24 h-1 bg-purple-500 mx-auto"></div>
        </div>
        <Commands />
      </div>
    </main>
  );
}
