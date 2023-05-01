import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";

const API_URL = "http://staging.joshtalks.org:9002/api/skill/v1/forms/upload/11/";

const CSRF_TOKEN = "Ic2vJLgmmzOGz5LahoImdlHJ4AqBUWUfNsyJ0nRnne6Y19ZynmVC5iM3l0RP8aYU";

export default function FileUploader() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
const [AUTH_TOKEN, setAuthToken] = useState(
  "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YWZkYTM2ODJlYmYwOWViMzA1NWMxYzRiZDM5Yjc1MWZiZjgxOTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODI4Mjg1NDUsImF1ZCI6IjU1NTE2MzgzNjQ1OC1la3EyOTlvMWxpMjFidnFhdm5wcG11cWp0NjZ2djk1by5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNDY3NzI2NDc0NDY4OTkzNTk1MCIsImVtYWlsIjoidml2ZWtrdW1hcnZreTEzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI1NTUxNjM4MzY0NTgtZWtxMjk5bzFsaTIxYnZxYXZucHBtdXFqdDY2dnY5NW8uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiVml2ZWsgS3VtYXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WXJUUmdZSjBpdTVMWW1lWHJnTnFrOXhVaWlNNlo1NFFrOC16bFBQQT1zOTYtYyIsImdpdmVuX25hbWUiOiJWaXZlayIsImZhbWlseV9uYW1lIjoiS3VtYXIiLCJpYXQiOjE2ODI4Mjg4NDUsImV4cCI6MTY4MjgzMjQ0NSwianRpIjoiZTQxZGZmZjk4MGEzNmViYzM2NDhhNzJhNWUwZmMzY2I1ZTQwYzY2NSJ9.C0iUpfhzrM5nNTjRbXDkpiWt1yGnKV9Vu-YGPWF7Vi2Dj8yp3kq5K8dxjtCy0jpWstLYaw4qpsI5ITN4FtXjKsfo1yjuOfOVZuQrQ6CSQO4Qua8uY840BYgM7pJ03lqIX6IrY2bddQ9QMB0pbBL6uLDdJYXGr11JqIVEaNcU_8VE2k1u2EIpBCXDqieHfQz3Q11r0sCAyMAlGSQiz0BodN546JBqGUyKBveUV8Y3aK_xDLg48xDm7xaJM6kIUKO9RtjVqNjNT2Cbji8wt8ZL4q8EoCoQE20SlTkgKhEBIyFpQzJIRKHC8SRpyI60w2s6cHQLJPmKe6QUv-eCFN1wfQ"
);
  const onDrop = (acceptedFiles) => {
    const updatedFiles = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      progress: 0,
    }));
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    updatedFiles.forEach((file) => uploadFile(file));
  };

  const uploadFile = (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file.file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_URL);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Authorization", AUTH_TOKEN);
    xhr.setRequestHeader("Cookie", `csrftoken=${CSRF_TOKEN}`);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.name === file.name ? { ...f, progress: percentCompleted } : f
          )
        );
      }
    });

    xhr.addEventListener("load", (event) => {
      setLoading(false);
      if (event.target.status === 201) {
        const responseData = JSON.parse(xhr.response);
        console.log("File uploaded successfully!");
        console.log(responseData); // do something with the response data
      } else {
        console.error("Error uploading file!");
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.name === file.name ? { ...f, progress: -1 } : f
          )
        );
      }
    });

    xhr.addEventListener("error", (error) => {
      console.error(error);
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === file.name ? { ...f, progress: -1 } : f
        )
      );
    });

    xhr.send(formData);
  };

  const handleCancel = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf,.doc,.docx",
  })
  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {files.map((file) => (
        <div key={file.name}>
          <Button variant="contained" disabled={file.progress === 100}>
            {file.name}
          </Button>
          {file.progress > 0 && file.progress < 100 && 
          (
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress variant="determinate" value={file.progress} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                >
                  {`${file.progress}%`}
                </Typography>
              </Box>
            </Box>
          )}
          {file.progress === -1 && (
            <p style={{ color: "red" }}>Failed to upload</p>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleCancel(file.name)}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      ))}
    </div>
  );}