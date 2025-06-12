
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { db, auth } from '../../firebase/firebase';
import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const Home = () => {
    const [user] = useAuthState(auth);
    const [timePeriod, setTimePeriod] = useState('Monthly');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userCompany, setUserCompany] = useState('');

    useEffect(() => {
        const fetchUserCompanyAndLeads = async () => {
            if (!user) {
                setError("Please login to view the dashboard");
                setLoading(false);
                return;
            }

            try {
                // Try to fetch user data from all possible collections
                const collections = ['marketingManager', 'salesManager', 'companyOwner'];
                let userData = null;
                let userCompanyName = '';

                for (const collectionName of collections) {
                    const userDoc = await getDoc(doc(db, collectionName, user.uid));
                    if (userDoc.exists()) {
                        userData = userDoc.data();
                        userCompanyName = userData.companyName;
                        break;
                    }
                }

                if (!userCompanyName) {
                    setError("Unable to determine your company. Please contact support.");
                    setLoading(false);
                    return;
                }

                setUserCompany(userCompanyName);
                await fetchLeads(userCompanyName);

            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load dashboard data. Please try again.");
                setLoading(false);
            }
        };

        fetchUserCompanyAndLeads();
    }, [user]);

  const fetchLeads = async (companyName) => {
  try {
  const q = query(
  collection(db, "leads"),
  where("submittedLead", "==", companyName),
  orderBy("createdAt", "desc")
)
    const querySnapshot = await getDocs(q)
    const leadsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setLeads(leadsData)
  } catch (error) {
    console.error("Error fetching leads:", error)
    if (error.code === "failed-precondition" && error.message.includes("requires an index")) {
      setError("Database index is missing. Please contact support to resolve this issue.")
    } else if (error.code === "permission-denied") {
      setError("Permission denied. Please ensure you have the necessary permissions to view leads.")
    } else {
      setError("Failed to fetch leads. Please try again.")
    }
  } finally {
    setLoading(false)
  }
}

    // Filter leads based on time period
    const getFilteredLeads = () => {
        if (!leads.length) return [];

        const now = new Date();
        const timeRanges = {
            Daily: 1 * 24 * 60 * 60 * 1000,    // 1 day in milliseconds
            Weekly: 7 * 24 * 60 * 60 * 1000,   // 7 days
            Monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
        };

        return leads.filter((lead) => {
            const createdAt = lead.createdAt?.toDate?.() || new Date(lead.createdAt);
            return now - createdAt <= timeRanges[timePeriod];
        });
    };

    const filteredLeads = getFilteredLeads();

    const totalLeads = filteredLeads.length;
    const wonLeads = filteredLeads.filter(lead => lead.status === "Won").length;
    const lostLeads = filteredLeads.filter(lead => lead.status === "Lost").length;
    const winPercentage = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const lostPercentage = totalLeads > 0 ? Math.round((lostLeads / totalLeads) * 100) : 0;

    const recentLeads = filteredLeads.slice(0, 7);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl">Loading dashboard...</div>
                </div>
            </div>
        );
    }


    return (
        <>
            <Header />
            <div className="flex-1 p-4 sm:p-8 flex flex-col gap-6">
                {/* Header with Dropdown */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl sm:text-3xl font-semibold">Performance Overview</h2>
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

                {/* Win/Lost Stats */}
                <div className="bg-opacity-20 bg-white backdrop-blur-lg flex flex-col sm:flex-row justify-between items-center text-lg font-medium p-4 rounded-lg shadow-lg gap-2">
                    <div>Win Percentage: {winPercentage}%</div>
                    <div>Lost Percentage: {lostPercentage}%</div>
                </div>

                {/* Main Dashboard Area */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Incoming Leads */}
                    <div className="bg-gray-100 p-6 shadow-2xl rounded-lg w-full lg:w-1/5">
                        <h1 className="font-bold text-xl text-center mb-4">Incoming Leads</h1>
                        <ul className="flex flex-col text-center gap-3 font-medium">
                            {recentLeads.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <li key={lead.id}>
                                        {lead.name} ({lead.company})
                                    </li>
                                ))
                            ) : (
                                <li>No leads found for this time period.</li>
                            )}
                        </ul>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="w-full lg:w-3/5 flex justify-center items-center">
                        <div className="relative w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full shadow-2xl overflow-hidden">
                            {/* Orange - Qualified */}
                            <div
                                className="absolute inset-0 bg-orange-500"
                                style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%, 0% 100%)' }}
                            >
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm sm:text-lg">
                                    QUALIFIED
                                </div>
                            </div>

                            {/* Red - Lost */}
                            <div
                                className="absolute inset-0 bg-red-500"
                                style={{ clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%)' }}
                            >
                                <div className="absolute top-12 left-6 text-white font-bold text-sm sm:text-lg">
                                    LOST
                                </div>
                            </div>

                            {/* Green - Won */}
                            <div
                                className="absolute inset-0 bg-green-500"
                                style={{ clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)' }}
                            >
                                <div className="absolute top-12 right-6 text-white font-bold text-sm sm:text-lg">
                                    WON
                                </div>
                            </div>

                            {/* Center Dot */}
                            <div className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
                        </div>
                    </div>

                    {/* Result Overview Bar Chart */}
                    <div className="bg-gray-100 p-6 shadow-2xl rounded-lg w-full lg:w-1/5">
                        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">Result Overview</h1>
                        <div className="flex justify-around items-end h-[250px] sm:h-[400px]">
                            {/* Won Bar */}
                            <div className="flex spacing-x-4 flex-col justify-end items-center w-1/2">
                                <p>{winPercentage}%</p>
                                <div
                                    className="bg-green-500 w-10 sm:w-16 rounded-t-lg"
                                    style={{ height: `${(winPercentage / 100) * 300}px` }} // Dynamic height
                                ></div>
                                <p>Won</p>
                            </div>
                            {/* Lost Bar */}
                            <div className="flex flex-col justify-end items-center w-1/2">
                                <p>{lostPercentage}%</p>
                                <div
                                    className="bg-red-500 w-10 sm:w-16 rounded-t-lg"
                                    style={{ height: `${(lostPercentage / 100) * 300}px` }} // Dynamic height
                                ></div>
                                <p>Lost</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;