"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DefaultTemplate } from "@/components";

const ProfilePage = () => {
  const params = useParams();
  const userid = params.userid as string;

  return (
    <DefaultTemplate>This is a profile page for user {userid}</DefaultTemplate>
  );
};

export default ProfilePage;
