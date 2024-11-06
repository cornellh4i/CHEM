import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Button from "@/components/atoms/Button";
import { FaMapMarkerAlt } from 'react-icons/fa';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SavingsIcon from '@mui/icons-material/Savings';

const OpenContributorModal = ({ buttonText = 'Open Modal', title, description, donorInfo, documents }) => {
  return (
    
    <Dialog >
      <DialogTrigger asChild>
        <Button variant="primary">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-4 shadow-lg border space-y-4">
      <div className = "p-8">
      <DialogHeader>
        <div className="flex justify-between">
          <DialogTitle className="text-xl font-semibold"><PersonIcon fontSize = "large" className = "mr-2"/>{title}</DialogTitle>
          <Button variant="success" style = {{width: "25%"}}className="bg-green-300 text-black px-3 py-1 rounded-full text-xs">
            Deposit
          </Button>
        </div>
      </DialogHeader>

        <div className="space-y-2 text-left mt-4">
          <div className="flex items-center space-x-2">
            <CalendarTodayIcon fontSize = "small" sx={{ color: 'black' }} />
            <p className = "text-sm">{donorInfo.date}</p>
          </div>
          <div className="flex items-center space-x-2">
            <SavingsIcon className="text-gray-500" sx={{ color: 'black' }} />
            <p className = "text-sm">{donorInfo.fund}</p>
          </div>
          <div className="flex items-center space-x-2">
            <PaidIcon fontSize = "small" sx={{ color: 'black' }} />
            <p className = "text-sm">{donorInfo.amount}</p>
          </div>
        </div>

        <div className="text-left mt-6">
          <h4 className="text-m font-bold">Description</h4>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className="text-left mt-6">
          <h4 className="text-m font-bold">Additional documents</h4>
          <div className="flex justify-between mt-6">
            {documents.map((doc, index) => (
              <div key={index} className="border bg-grey-light rounded-lg p-3 text-left w-1/2 mr-2">
                <InsertDriveFileOutlinedIcon/>
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.date}</p>
              </div>
            ))}
          </div>
        </div>

          <div className="flex justify-between mt-6">
            <Button variant="secondary" style = {{width : "40%"}}>
              Cancel
            </Button>
            <Button variant="primary" icon = {<EditIcon/>} style = {{width : "40%"}}>
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
  );
};

// Example usage
const ExamplePage = () => {
  const donorInfo = {
    date: "January 25, 2024",
    fund: "Milstein Fund",
    amount: "$9,336.84"
  };
  const documents = [
    { name: "receipt.pdf", date: "Tue Mar 12 • 230 KB" },
    { name: "note.pdf", date: "Tue Mar 12 • 230 KB" },
  ];

  return (
    <div className="p-4">
      <OpenContributorModal
        buttonText="Open Donor Modal"
        title="Claire Lee"
        description="This is a repeated donor and this is her fifth donation."
        donorInfo={donorInfo}
        documents={documents}
      />
    </div>
  );
};

export default ExamplePage;