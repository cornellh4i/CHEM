"use client";

import React from "react";
import DefaultTemplate from "@/components/templates/DefaultTemplate";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const params = useParams();
  const userid = params.userid as string;

  return (
    <DefaultTemplate>This is a profile page for user {userid}</DefaultTemplate>
  );
};

export default ProfilePage;
