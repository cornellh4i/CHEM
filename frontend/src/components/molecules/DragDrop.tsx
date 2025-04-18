import { SetStateAction, useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const fileTypes = ["JPEG", "PNG", "PDF"];

interface DragDropProps {
  onDrop?: (files: File[]) => void; // Add prop to communicate back to parent
}

const DragDrop = ({ onDrop }: DragDropProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (uploadedFiles: any) => {
    // Convert to array if single file is uploaded
    const fileArray = Array.isArray(uploadedFiles)
      ? uploadedFiles
      : [uploadedFiles];
    setFiles(fileArray);

    // Call the onDrop callback to notify parent component
    if (onDrop) {
      onDrop(fileArray);
    }
  };

  return (
    <div className="mt-[8px] w-full">
      <FileUploader
        label="Drop"
        uploadedLabel="Upload Successful"
        multiple={true}
        handleChange={handleChange}
        name="file"
        hoverTitle="Drop"
        types={fileTypes}
      >
        <div className="flex items-center justify-center border-gray-500 bg-gray-100 h-[150px] rounded-2xl border-2 border-dotted">
          <div className="flex flex-col items-center justify-center">
            
            <div className="text-[#747474] text-center text-base ">
              <UploadFileIcon />
              Add a document
            </div>
            <div className="mt-2 text-extralight text-[#B7B7B7] justify-center text-center text-sm">
              or <span className="underline">or click to select files</span>
            </div>
          </div>
        </div>
      </FileUploader>
    </div>
  );
};

export default DragDrop;
