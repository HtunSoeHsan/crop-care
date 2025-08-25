import React from 'react';

export default function AdminHomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Welcome to the admin panel. Use the sidebar to manage resources, healthy foods, and users.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">📚</span>
          <h2 className="font-semibold text-xl mb-1">Resources</h2>
          <p className="text-gray-500 text-center">Add, edit, or remove educational resources for users.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">🥗</span>
          <h2 className="font-semibold text-xl mb-1">Healthy Foods</h2>
          <p className="text-gray-500 text-center">Manage healthy food information and recommendations.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">🤖</span>
          <h2 className="font-semibold text-xl mb-1">AI Training</h2>
          <p className="text-gray-500 text-center">Train and manage AI models for plant disease detection.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">👤</span>
          <h2 className="font-semibold text-xl mb-1">Users</h2>
          <p className="text-gray-500 text-center">View and manage user accounts and permissions.</p>
        </div>
      </div>
    </div>
  );
}
