import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Logo from "./uploadlogo.png";
import { Button } from "@mui/material";
const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "70px",
  margin:"30px",
  width:"100%",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function DropzoneComponent({mainId, handleClose, documentTypes, handleFiles, maxAllowed}) {

  const [files, setFiles] = useState([]);

const onDrop = useCallback(
  (acceptedFiles) => {
    
    let updatedFiles = [...files];
    
  if (updatedFiles.length < maxAllowed){
 for (let i = 0; i < acceptedFiles.length; i++) {
  if (updatedFiles.length < maxAllowed){
   updatedFiles.push(
     Object.assign(acceptedFiles[i], {
       preview: URL.createObjectURL(acceptedFiles[i]),
     })
   );
  }
   
 }

 setFiles(updatedFiles);

 handleFiles(updatedFiles);
  }
   
  },
  [files, handleFiles, maxAllowed]
);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: maxAllowed,
    accept: "image/jpeg, image/png",
  });
  const thumbs = files.map((file) => (
    <div key={file.name}>
      <img src={file.preview} alt={file.name} />
    </div>
  ));
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );


  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} disabled={files.length === 5} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={Logo} alt="new" />
          <p>Drag and drop file here</p>
          <p>OR</p>
          <Button variant="contained">Browse Files</Button>
        </div>
      </div>
    </section>
  );
}

export default DropzoneComponent;
