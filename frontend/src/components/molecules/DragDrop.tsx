import { SetStateAction, useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
        <div className="border-gray-500 bg-gray-100 flex h-[120px] items-center justify-center rounded-2xl border-2 border-dotted">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-base text-[#747474]">
              <UploadFileIcon />
              Add a document
            </div>
            <div className="text-extralight mt-2 justify-center text-center text-sm text-[#B7B7B7]">
              <span className="underline">or click to select files</span>
            </div>
          </div>
        </div>
      </FileUploader>
    </div>
  );
};

export default DragDrop;
