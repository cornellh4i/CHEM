import React from 'react';
import ProfilePage from "@/components/organisms/ProfilePage";
import DashboardTemplate from "@/components/templates/DashboardTemplate";

const TestPage = () => {
    return (
        <DashboardTemplate>
            <ProfilePage />
        </DashboardTemplate>
    );
};

export default TestPage;
