import React, { useState } from 'react';
import Header from '../../components/Header/Header';

const Home = () => {
    const [timePeriod, setTimePeriod] = useState('Monthly'); // Added state for dropdown

    return (
        <>
            <Header />
            <div className="flex-1 p-8 flex-wrap flex flex-col gap-6 ">

                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold">Performance Overview</h2>
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none border border-gray-600"
                    >
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Daily">Daily</option>
                    </select>
                </div>

                <div className="bg-opacity-20 bg-white backdrop-blur-lg flex justify-between items-center text-lg font-medium p-4 rounded-lg shadow-lg">
                    <div>Win Percentage: 65%</div>
                    <div>Lost Percentage: 35%</div>
                </div>
                <div className="incoming flex w-full flex-wrap px-0 sm:px-20">

                    <div className=" min-w-[300px] w-full sm:w-[20%] bg-gray-100 p-10 shadow-2xl h-auto">
                        <h1 className='font-bold text-xl text-center '>Incomming Leads</h1>
                        <ul className='p-5 flex flex-col text-center gap-5 font-medium'>
                            <li>Lead-1 Random Informationx</li>
                            <li>Lead-1 Random Informationx</li>
                            <li>Lead-1 Random Informationx</li>
                            <li>Lead-1 Random Informationx</li>
                            <li>Lead-1 Random Informationx</li>
                            <li>Lead-1 Random Informationx</li>
                            <li>Lead-1 Random Informationx</li>

                        </ul>
                    </div>
                    <div className="w-full sm:w-[60%]  justify-center flex ">

                        <div className="relative flex justify-center items-center w-[500px] h-[500px]">

                            <div className="relative w-[400px] h-[400px] rounded-full shadow-2xl overflow-hidden">

                                <div
                                    className="absolute inset-0 bg-orange-500"
                                    style={{
                                        clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%, 0% 100%)',
                                    }}
                                >
                                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                                        QUALIFIED
                                    </div>
                                </div>


                                <div
                                    className="absolute inset-0 bg-red-500"
                                    style={{
                                        clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%)',
                                    }}
                                >
                                    <div className="absolute top-16 left-16 text-white font-bold text-lg">
                                        LOST
                                    </div>
                                </div>


                                <div
                                    className="absolute inset-0 bg-green-500"
                                    style={{
                                        clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)',
                                    }}
                                >
                                    <div className="absolute top-16 right-16 text-white font-bold text-lg">
                                        WON
                                    </div>
                                </div>

                                <div className="absolute w-6 h-6 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
                            </div>


                        </div>
                    </div>
                    <div className="w-full sm:w-[20%] bg-gray-100 shadow-2xl  p-10 ">
                        <h1 className='text-2xl font-bold text-center p-3'>Result OverView </h1>
                        <div className="w-full flex gap-10 justify-center items-end   h-[500px]">

                            <div className="w-full h-full flex flex-col justify-end text-center items-center">
                                <p>65%</p>
                                <div className="win h-[65%] w-24 bg-green-500 rounded-t-lg">

                                </div>
                                <p>Won</p>
                            </div>
                            <div className="w-full h-full flex flex-col justify-end text-center items-center">
                                <p>35%</p>
                                <div className="lost h-[35%] w-24 bg-red-500 rounded-t-lg">

                                </div>
                                Lost
                            </div>


                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Home;