// Header.jsx
import React, { useRef } from 'react';
import Button from '../Button/Button';
import SideBar from '../sidebar/SideBar';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const sidebarRef = useRef();

    const handleOpenSidebar = () => {
        sidebarRef.current?.open();
    };
const navigate = useNavigate()
    return (
        <>
            <header className="bg-slate-200 h-20 flex justify-between items-center px-6 shadow-2xl">
                <div className="flex items-center">
                <Button label={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" /></svg>} style={"p-4"} click={handleOpenSidebar} />
                <div className="text py-2">
                    <h1 className='font-bold text-2xl'>NexaDew</h1>
                </div>
                </div>
                <div className="flex">
                    <span className='p-2 bg-slate-300 rounded-full shadow-xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
                    </span>
                    <span className='p-2'>
                        Thatipamula Gunny
                    </span>
                    <span>
                        <Button label={"Register"} style={"p-3 bg-gray-200 shadow-lg hover:shadow-2xl "} click={()=>navigate("/marketing-manager/register")} />
                    </span>
                </div>
            </header>
            <SideBar ref={sidebarRef} />
        </>
    );
};

export default Header;
