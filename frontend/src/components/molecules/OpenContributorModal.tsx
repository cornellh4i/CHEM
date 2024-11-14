import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Button from "@/components/atoms/Button";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaidIcon from "@mui/icons-material/Paid";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SavingsIcon from "@mui/icons-material/Savings";

interface DonorInfo {
  date: string;
  fund: string;
  amount: string;
}

interface Document {
  name: string;
  date: string;
}

interface OpenContributorModalProps {
  buttonText?: string;
  title: string;
  description: string;
  donorInfo: DonorInfo;
  documents: Document[];
}

const OpenContributorModal: React.FC<OpenContributorModalProps> = ({
  buttonText = "Open Modal",
  title,
  description,
  donorInfo,
  documents,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 border p-4 shadow-lg sm:max-w-md">
        <div className="p-8">
          <DialogHeader>
            <div className="flex justify-between">
              {/* Updated DialogTitle with flex and items-center */}
              <DialogTitle className="flex items-center text-xl font-semibold">
                <PersonIcon fontSize="large" className="mr-2" />
                {title}
              </DialogTitle>
              <Button
                variant="success"
                style={{ width: "25%" }}
                className="rounded-full bg-green-300 px-3 py-1 text-xs text-black"
              >
                Deposit
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-center space-x-2">
              <CalendarTodayIcon fontSize="small" sx={{ color: "black" }} />
              <p className="text-sm">{donorInfo.date}</p>
            </div>
            <div className="flex items-center space-x-2">
              <SavingsIcon className="text-gray-500" sx={{ color: "black" }} />
              <p className="text-sm">{donorInfo.fund}</p>
            </div>
            <div className="flex items-center space-x-2">
              <PaidIcon fontSize="small" sx={{ color: "black" }} />
              <p className="text-sm">{donorInfo.amount}</p>
            </div>
          </div>
          <div />

          <div className="mt-6 text-left">
            <h4 className="text-m font-bold">Description</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          <div className="mt-6 text-left">
            <h4 className="text-m font-bold">Additional documents</h4>
            <div className="mt-6 flex justify-between">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="mr-2 w-1/2 rounded-lg border bg-grey-light p-3 text-left"
                >
                  <InsertDriveFileOutlinedIcon />
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" style={{ width: "40%" }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<EditIcon />}
              style={{ width: "40%" }}
            >
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenContributorModal;
