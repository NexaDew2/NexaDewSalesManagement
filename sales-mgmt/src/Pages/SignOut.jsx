// SignOut.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <button 
            onClick={handleSignOut}
            className="w-full text-left"
        >
            Sign Out
        </button>
    );
};

export default SignOut;