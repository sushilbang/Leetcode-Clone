import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import ProfileMenu from "@/components/ProfileMenu";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const TOTAL_PROBLEMS = 10; // Hardcoded total problems

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true, // Ensures the cookie is sent with the request
        });

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  // Calculate solved & unsolved problems
  const solvedProblems = userData?.submissions?.length || 0;
  const unsolvedProblems = TOTAL_PROBLEMS - solvedProblems;

  // Chart data
  const chartData = {
    labels: ["Solved", "Unsolved"],
    datasets: [
      {
        data: [solvedProblems, unsolvedProblems],
        backgroundColor: ["#4CAF50", "#F44336"], // Green for solved, Red for unsolved
        hoverBackgroundColor: ["#45A049", "#D32F2F"],
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-8">
        <ProfileMenu />
      </div>
      <div className="rounded-2xl p-6 flex flex-col absolute top-0 left-8">
        <div className="flex flex-col justify-between items-start">
          <div className="text-left bg-white rounded-md p-4">
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Profile</h1>
            {userData && (
              <>
                <p className="text-lg font-medium text-gray-600">
                  Name: <span className="font-semibold">{userData.username}</span>
                </p>
                <p className="text-lg font-medium text-gray-600">
                  Email: <span className="font-semibold">{userData.email}</span>
                </p>
              </>
            )}
          </div>
        </div>
          <div className="bg-white mt-5 rounded-md p-2 w-40 items-center">
            <Pie data={chartData} />
            <p className="mt-2 text-center font-semibold text-gray-700">
              Solved: {solvedProblems} / {TOTAL_PROBLEMS}
            </p>
          </div>
      </div>
    </div>
  );
};

export default Profile;
