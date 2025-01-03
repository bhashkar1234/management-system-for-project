import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from "axios";
import imag from "../assests/background.jpeg";
const LandingPage = ({setIsAdmin, setIsAuthenticated}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token on initial load
    const token = localStorage.getItem("adminToken");
    // console.log("hiiiiiii")
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAdmin(true); // Assuming the token indicates an admin user
      console.log("Admin user detected",token);
    }else{
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  const userLogin = () => {
    setIsAdmin(false);
    setIsAuthenticated(true);
    navigate('/userpage');
  }

  return (
    <div 
      className=" bg min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${imag})` }}

    >
      {/* <Navbar /> */}
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Communication Management</h1>
          <div className="space-y-4">
            <button
              onClick={() =>{
              
                navigate('/admin/login')}}
              className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              Admin Login
            </button>
            <button
              // onClick={() => {
              //   if(localStorage.getItem('adminToken') !== null){
              //     localStorage.removeItem('adminToken');
              //     setIsAdmin(false);
              //   }
              //   navigate('/userpage');}}
              onClick={userLogin}
              className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700"
            >
              User Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
