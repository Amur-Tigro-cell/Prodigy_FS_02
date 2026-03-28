import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Employee Management System</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Login As
            </h2>
            
            <div className="space-y-4">
              <Link to="/login/employee">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 transform hover:scale-105">
                  <Users className="w-6 h-6" />
                  <span className="text-lg">Employee</span>
                </button>
              </Link>
              
              <Link to="/login/admin">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 transform hover:scale-105">
                  <Shield className="w-6 h-6" />
                  <span className="text-lg">Admin</span>
                </button>
              </Link>
            </div>

            <div className="mt-8 text-center text-gray-600">
              <p className="text-sm">
                Select your role to continue to the login page
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2024 Employee Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
