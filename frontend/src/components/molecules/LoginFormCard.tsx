import React from "react";
import { Button, Input } from "@/components";

const LoginFormCard = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-700"> 
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <div className="w-96 mb-8 text-4xl text-[#185F96] font-serif">Log In</div>
    <div>
      <form>
        <div className="mb-6">
          <Input label="Email address" placeholder="john.doe@company.com" />
        </div>
        <div className="mb-6">
          <Input label="Password" type="password" placeholder="•••••••••" />
        </div>
        <div className="mb-2">
          <Button type="submit" 
          className="w-full text-white bg-{#3E6DA6} border hover:bg-grey-dark focus:ring-4 focus:ring-blue-300 font-normal rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          style={{ backgroundColor: '#3E6DA6' }}
          >
          Log in
          </Button>
        </div>
      </form>
    </div>
    </div>
   </div>
  );
};


export default LoginFormCard; 