import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { PolyglotFlow } from '../../types/polyglotElements';
import { MdOutlineCreateNewFolder, MdDriveFolderUpload } from 'react-icons/md';

type UploadFormProps = {
  fetchFunction: (flow: PolyglotFlow) => Promise<AxiosResponse<PolyglotFlow>>;
};

const UploadForm = ({ fetchFunction }: UploadFormProps) => {
  const [selectedFiles, setselectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // handle drag events
  const handleDrag = function (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
    type: string;
  }) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.length) {
      Array.from(files).forEach((file: File) => {
        if (file?.type !== 'application/json') {
          alert('We only accept .json files!');
          return;
        }
        setselectedFiles((prev) => prev?.concat(file));
      });
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;
    const tmp: File[] = selectedFiles;
    tmp.forEach(async (file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result?.toString() || '';
        const flow = JSON.parse(text);

        fetchFunction(flow)
          .then((resp) => {
            alert('Succesfully created the flow!');
          })
          .catch((error: Error) => {
            alert(
              "Unable to create the flow from file '" +
                file.name +
                "' : " +
                error.message
            );
          })
          .finally(() => {
            setselectedFiles((prev) => prev.filter((item) => item !== file));
          });
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-black">
      <form onSubmit={onSubmitHandler} className="w-1/2 h-1/4">
        <label htmlFor="formId" className="">
          <input
            type="file"
            id="formId"
            accept="application/json"
            multiple={true}
            onChange={(e) => {
              const files = e.target.files?.length ? e.target.files : [];
              Array.from(files).forEach((file: File) => {
                if (file?.type !== 'application/json') {
                  alert('We only accept .json files!');
                  return;
                }
                setselectedFiles((prev) => prev?.concat(file));
              });
              e.target.value = '';
            }}
            hidden
          />
          <div className="flex w-full h-full">
            <div className="flex flex-col justify-between grow bg-gray-700 border-6 border-solid">
              <div className="text-white font-bold m-3">Uploaded files:</div>
              {selectedFiles.length &&
                selectedFiles.map((file, id) => {
                  return (
                    <div className="text-white m-3" key={id}>
                      {file.name}
                    </div>
                  );
                })}
              <input type="submit" className="m-3" />
            </div>
            <div
              className={
                'flex flex-col items-center justify-center grow rounded border-4 border-dashed border-black dark:border-white'
              }
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {dragActive ? (
                <>
                  <MdDriveFolderUpload className="dark:text-white text-8xl" />
                  <div className="text-black dark:text-white">
                    Add files or drag and drop it...
                  </div>
                </>
              ) : (
                <>
                  <MdOutlineCreateNewFolder className="dark:text-white text-8xl" />
                  <div className="text-black dark:text-white">
                    Add files or drag and drop it...
                  </div>
                </>
              )}
            </div>
          </div>
        </label>
      </form>
    </div>
  );
};

export default UploadForm;
