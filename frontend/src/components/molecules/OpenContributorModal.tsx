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
import { FaCalendarAlt, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const Modal = ({ buttonText = 'Open Modal', title, description, donorInfo, documents }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 rounded-lg shadow-lg border">
        <DialogHeader className="flex items-center space-x-3">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <Button variant="success" className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-xs">
            Deposit
          </Button>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {/* Donor Info */}
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-gray-500" />
            <p>{donorInfo.date}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <p>{donorInfo.fund}</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaDollarSign className="text-gray-500" />
            <p>{donorInfo.amount}</p>
          </div>
          {/* Description */}
          <div className="mt-4">
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-gray-600">{description}</p>
          </div>
          {/* Additional Documents */}
          <div className="mt-4">
            <h4 className="text-sm font-medium">Additional documents</h4>
            <div className="flex space-x-4 mt-2">
              {documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-3 text-center">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.date}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="secondary" className="px-4 py-2">
              Cancel
            </Button>
            <Button variant="primary" className="px-4 py-2">
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
      <Modal
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


















