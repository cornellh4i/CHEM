"use client";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import React, { useEffect, useState } from "react";
import Switch from '@mui/material/Switch';
import Person from "@mui/icons-material/Person";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import auth from "@/utils/firebase-client";
import { onAuthStateChanged } from "firebase/auth";

const apiBase =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type CurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization?: { name: string };
};

interface ProfileFieldProps {
  label: string;
  value: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <p className="text-xs" style={{ color: "#838383" }}>{label}</p>
    <p className="font-normal">{value}</p>
  </div>
);

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <h2 className="text-xl font-semibold mb-4">{title}</h2>
);


// Listen for Firebase auth changes, and whenever a user is logged in,
// call /auth/login with their ID token to load and store the full user record from the backend.
const ProfilePage = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          return;
        }
        const token = await firebaseUser.getIdToken();
        const res = await fetch(`${apiBase}/auth/login`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Failed to load profile user", res.status);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error loading profile user", err);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <DashboardTemplate>
      {/* Page header */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-700 text-base font-medium">
          <Person />
          {user ? `${user.firstName} ${user.lastName}` : "Loading user..."}
        </div>
      </div>
      <div className="h-px bg-gray-200 w-full mb-6" />

      {/* Container for profile content */}
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Section: Your Profile */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Profile</h2>
            <button className="px-6 py-2 border border-black rounded-full text-xs font-semibold text-gray-800 bg-transparent">
              Edit Profile
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-start">
            {/* Profile image placeholder with checkerboard background */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-md border border-gray-300 bg-gray-100 bg-[repeating-conic-gradient(#ccc_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]" />
              <button className="mt-2 text-sm font-[500] rounded-[16px] border border-black flex items-center justify-center gap-2 w-[112px] h-[26px] bg-[#EAEAEA] text-[#323232]">
                Add Photo
              </button>
            </div>

            {/* Personal Info section */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[18px] font-semibold text-gray-600">Personal Information</p>
                <ModeEditIcon fontSize="small" />
              </div>
              <div className="bg-gray-50 p-6 rounded-md border">
                <div className="grid grid-cols-2 gap-4">
                  <ProfileField
                    label="First Name"
                    value={user?.firstName ?? "Not set"}
                  />
                  <ProfileField
                    label="Last Name"
                    value={user?.lastName ?? "Not set"}
                  />
                  <ProfileField label="Date of Birth" value="Not set" />
                  <ProfileField label="Phone Number" value="Not set" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Account Details */}
        <SectionHeader title="Details" />
        <div className="bg-white rounded-lg shadow-md p-6 border space-y-6">
          <div className="space-y-4">
            <ProfileField
              label="Role"
              value={user?.role ?? "USER"}
            />
            <ProfileField
              label="Email Address"
              value={user?.email ?? "Not set"}
            />
            <ProfileField label="Password" value="••••••••" />
          </div>
        </div>

        {/* Section: Two Factor Authentication */}
        <div className="bg-white rounded-lg shadow-md p-6 border relative">
          <SectionHeader title="Two Factor Authentication" />
          <div className="text-sm text-gray-700 pr-24">
            Add more security to your account by enabling Two Factor Authentication. When logging in, you will need to enter a code generated by your preferred authenticator app.
          </div>
          {/* Toggle Switch aligned top-right */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <span className="text-sm text-gray-700">Enabled</span>
            <Switch color="primary" />
          </div>
        </div>

      </div>
    </DashboardTemplate>
  );
};

export default ProfilePage;