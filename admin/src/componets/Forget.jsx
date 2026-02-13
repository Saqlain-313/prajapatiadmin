import { useState } from 'react';

import { Mail, Lock, Menu, X, LogIn, UserPlus } from 'lucide-react';


const Forget = () => {
  const [currentPage, setCurrentPage] = useState('forgot-password');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const ForgotPasswordForm = () => (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="font-extrabold text-4xl text-gray-900 mb-2 tracking-tight">Forgot password?</h1>
        <p className="text-gray-500 text-lg">Enter your email below!</p>
      </div>

      <form role="form" className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
              placeholder="Enter your email address"
              aria-label="Email"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Email password reset link
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <a
          onClick={() => setCurrentPage('login')}
          href="#"
          className="text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          Go back to Sign In
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Header starts here */}
      <header className="bg-white fixed top-10 left-0 right-0 z-50 shadow-sm py-4 px-6 md:px-12 rounded mx-4 md:mx-12">
  <div className="container mx-auto flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center">
      <h2 className="text-xl font-bold text-gray-900">Corporate UI</h2>
    </div>

    {/* Centered Sign In/Up */}
    <div className="hidden md:flex items-center gap-6 font-semibold absolute left-1/2 transform -translate-x-1/2">
      <a
        href="#"
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <UserPlus size={18} /> Sign Up
      </a>
      <a
        onClick={() => setCurrentPage('login')}
        href="#"
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <LogIn size={18} /> Sign In
      </a>
    </div>

    {/* Right: Free download */}
    <div className="hidden md:block">
      <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
        Free download
      </button>
    </div>

    {/* Mobile menu button */}
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>

  {/* Mobile nav menu */}
  {isMenuOpen && (
    <div className="md:hidden mt-3 bg-white rounded-lg shadow-md py-2">
      <a
        href="#"
        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100"
      >
        <UserPlus size={18} /> Sign Up
      </a>
      <a
        onClick={() => setCurrentPage('login')}
        href="#"
        className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100"
      >
        <LogIn size={18} /> Sign In
      </a>
      <button className="w-full text-left bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 mt-2">
        Free download
      </button>
    </div>
  )}
</header>



      {/* Main content */}
      <div className="flex min-h-screen bg-gray-100 font-sans antialiased">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 lg:p-8">
          {currentPage === 'login' ? <LoginForm /> : <ForgotPasswordForm />}
        </div>

        {/* Right: Image + text */}
        <div
          className="hidden md:flex md:w-1/2 relative bg-cover bg-center  shadow-xl transition-all duration-300"
          style={{ backgroundImage: "url('https://admin.maxifysolutions.in/assets/img/image-sign-in.jpg')" }}
        >
          <div className="absolute bottom-10 left-10 right-10 p-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl border border-white shadow-lg">
            <h2 className="text-4xl font-bold text-gray-900">
              Enter our global community of developers.
            </h2>
            <p className="mt-2 font-semibold text-sm text-gray-700">
              Copyright &copy; 2022 Corporate UI Design System by Creative Tim.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forget;
