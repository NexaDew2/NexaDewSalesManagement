import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Make sure this is exported in your firebase config
import { useNavigate } from 'react-router-dom';

const MarketingManagerRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const MarketManagerSignup = async (e) => {
    e.preventDefault();
    try {
      const managerCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = managerCredential.user;

    await setDoc(doc(db, "marketingManager", user.uid), {
  name: name,
  email: email,
  phone: phone,
  role: 'Marketing Manager',
  uid: user.uid
});

      console.log('User registered successfully:', user);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1>Marketing Manager Register</h1>
      <p>Welcome to the Marketing Manager registration page.</p>
      <form className='flex flex-col gap-4 w-1/3 mx-auto mt-10' onSubmit={MarketManagerSignup}>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="phone">Phone Number:</label>
        <input type="text" name="phone" id="phone" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
          Register
        </button>
      </form>
    </div>
  );
};

export default MarketingManagerRegister;
