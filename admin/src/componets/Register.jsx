// import { useState } from 'react';
// import { Mail, Lock, User, Menu, X, LogIn, UserPlus, Phone } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser } from '../store/reducer/authReducer';

// const Register = () => {
//   const dispatch = useDispatch();
//   const { loading, error, user } = useSelector((state) => state.auth);

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [terms, setTerms] = useState(false);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!terms) {
//       alert('You must accept the Terms and Conditions');
//       return;
//     }
//     dispatch(registerUser({ name, email, phone, password, role: "user" })).then((res) => {
//         if (res.payload.success) {
//           toast.success(res.payload.message);
//         } else {
//           toast.error(error);
//         }
//       })
//   };

//   return (
//     <>
//       {/* Header */}
//       <header className="bg-white fixed top-10 left-0 right-0 z-50 shadow-sm py-4 px-6 md:px-12 rounded mx-4 md:mx-12">
//         <div className="container mx-auto flex items-center justify-between">
//           <div className="flex items-center">
//             <h2 className="text-xl font-bold text-gray-900">Corporate UI</h2>
//           </div>
//           <div className="hidden md:flex items-center gap-6 font-semibold absolute left-1/2 transform -translate-x-1/2">
//             <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
//               <UserPlus size={18} /> Sign Up
//             </a>
//             <a href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
//               <LogIn size={18} /> Sign In
//             </a>
//           </div>
//           <div className="hidden md:block">
//             <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">
//               Free download
//             </button>
//           </div>
//           <div className="md:hidden">
//             <button onClick={toggleMenu} className="text-gray-600">
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//         {isMenuOpen && (
//           <div className="md:hidden mt-3 bg-white rounded-lg shadow-md py-2">
//             <a href="#" className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100">
//               <UserPlus size={18} /> Sign Up
//             </a>
//             <a href="#" className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:bg-gray-100">
//               <LogIn size={18} /> Sign In
//             </a>
//             <button className="w-full text-left bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 mt-2">
//               Free download
//             </button>
//           </div>
//         )}
//       </header>

//       {/* Main Layout */}
//       <div className="flex flex-col md:flex-row bg-gray-100 font-sans">

//         {/* Left Side: Image */}
//         <div
//           className="hidden md:flex w-full md:w-1/2 bg-cover bg-center p-8 flex-col justify-center text-white"
//           style={{
//             backgroundImage: "url('https://admin.maxifysolutions.in/assets/img/image-sign-up.jpg')",
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundColor: '#8B5CF6',
//           }}
//         >
//           <div className='pt-36'>
//             <h2 className="text-4xl font-extrabold mb-4 leading-tight">Start your <br /> new journey.</h2>
//             <p className="mb-6 max-w-md text-gray-200">
//               Use these awesome forms to login or create new account in your project for free.
//             </p>
//             <div className="flex items-center gap-2 mb-6">
//               <div className="flex -space-x-2 overflow-hidden">
//                 <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32/FFD700/000000?text=U1" />
//                 <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32/ADFF2F/000000?text=U2" />
//                 <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://placehold.co/32x32/87CEEB/000000?text=U3" />
//               </div>
//               <span className="text-sm font-medium">Join 2.5M+ users</span>
//             </div>
//           </div>
//           <div className="mt-10 text-sm text-gray-200">
//             Copyright © 2022 Corporate UI Design System by Creative Tim.
//           </div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="w-full md:w-1/2 flex items-center justify-center pt-36 px-4 pb-20 md:pb-0">
//           <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
//             <div className="text-center mb-6">
//               <h1 className="font-extrabold text-3xl text-gray-900 mb-2">Sign up</h1>
//               <p className="text-gray-500">Nice to meet you! Please enter your details.</p>
//             </div>

//             {loading && <p className="text-blue-500 mb-2">Registering...</p>}
//             {error && <p className="text-red-500 mb-2">{error}</p>}
//             {user && <p className="text-green-500 mb-2">Registered successfully!</p>}

//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {/* Name */}
//               <div>
//                 <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
//                 <div className="relative">
//                   <User className="absolute left-4 top-3 text-gray-400" size={18} />
//                   <input
//                     type="text"
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     placeholder="Enter your name"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-3 text-gray-400" size={18} />
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email address"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Phone */}
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
//                 <div className="relative">
//                   <Phone className="absolute left-4 top-3 text-gray-400" size={18} />
//                   <input
//                     type="tel"
//                     id="phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="+91 1234567890"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-3 text-gray-400" size={18} />
//                   <input
//                     type="password"
//                     id="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Create a password"
//                     className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Terms & Conditions */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   checked={terms}
//                   onChange={() => setTerms(!terms)}
//                   className="w-4 h-4 text-gray-700 border-gray-300 rounded"
//                 />
//                 <label htmlFor="terms" className="text-sm text-gray-700">
//                   I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>.
//                 </label>
//               </div>

//               <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg shadow-md">
//                 Sign Up
//               </button>
//             </form>

//             <div className="mt-4 text-center text-sm">
//               Already have an account?{' '}
//               <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign in</a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Register;
