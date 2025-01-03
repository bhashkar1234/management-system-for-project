import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isAuthenticated, isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const onLogout = () => {
    if (localStorage.getItem('adminToken') !== null) {
      localStorage.removeItem('adminToken');
    }
    navigate('/');
  };

  const landingLinks = [
    { to: '/admin/login', label: 'Admin Login' },
    { to: '/user/login', label: 'User Login' },
  ];

  const userLinks = [
    { to: '/log-communication', label: 'Log Communication' },
    { to: '/notifications', label: 'Notifications' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const adminLinks = [
    { to: '/companies', label: 'Manage Companies' },
    { to: '/communication-methods', label: 'Communication Methods' },
    ...userLinks,
  ];

  const isLoginPage = location.pathname.includes('/login');
  const isHomePage = location.pathname === '/';
  const links = isHomePage
    ? landingLinks
    : isLoginPage
    ? []
    : isAdmin
    ? adminLinks
    : userLinks;

  return (
    <nav className="bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <ul className="flex justify-center sm:justify-start space-x-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-white font-medium transition-colors duration-300 ${
                    isActive
                      ? 'bg-indigo-700 px-4 py-2 rounded-full shadow-md'
                      : 'hover:bg-indigo-600/80 px-4 py-2 rounded-full'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button
                onClick={onLogout}
                className="text-white font-medium bg-red-600 px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition-colors duration-300"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
