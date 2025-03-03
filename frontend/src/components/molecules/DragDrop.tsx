import { SetStateAction, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const fileTypes = ["JPEG", "PNG", "PDF"];

const DragDrop = () => {
  const [file, setFile] = useState(null);
  const handleChange = (file: SetStateAction<null>) => {
    setFile(file);
  };

  return (
    <div className="mt-[50px] w-[95%]">
      <FileUploader
        label="Drop"
        uploadedLabel="Upload Successful"
        multiple={true}
        handleChange={handleChange}
        name="file"
        hoverTitle="Drop"
        types={fileTypes}
      >
        <div className="border-gray-500 bg-gray-100 h-[150px] rounded-2xl border-2 border-dotted">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="align-center text-gray-800 dark:text-white h-16 w-16"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2"
              />
            </svg>
            <div className="text-black text-center text-[22px]">
              Drop files here
            </div>
            <div className="text-extralight text-gray-500 justify-center text-center text-[20px]">
              or <span className="underline">select files</span>
            </div>
          </div>
        </div>
      </FileUploader>
    </div>
  );
};

export default DragDrop;
