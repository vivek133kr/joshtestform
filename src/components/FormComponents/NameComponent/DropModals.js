import React, { useEffect } from "react";
import "./DropModal.css";
import Previews from "./DropBox";
import CloseIcon from "@mui/icons-material/Close";
import { Close } from "@mui/icons-material";
const DropModals = ({ handleClose, show, handleFiles,  maxAllowed, id, documentTypes }) => {
  const handleModalClick = (e) => {
    if (e.target.classList.contains("modal")) {
      handleClose();
    }
  };

  return (
    <div

      className={
        show
          ? "modal w-full p-4 overflow-x-hidden  md:inset-0 h-auto max-h-full"
          : ""
      }
      onClick={handleModalClick}
      style={show ? { display: "block" } : { display: "none" }}
    >
      <div
        className="modal-content"
        style={{ borderRadius: "8px", textAlign: "center" }}
      >
        <p
          style={{
            fontSize: "28px",
            color: "#1A73E8",
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: 500,
          }}
        >
          Upload Files
        </p>
        <p>Please make sure that the picture or PDF is clear</p>
        <div style={{
            display:"flex",
            flexDirection:'column',
            justifyContent:"center",
       
        }}>
          <Previews mainId={id} handleClose={handleClose} documentTypes={documentTypes} handleFiles={handleFiles} maxAllowed={maxAllowed}/>
        </div>
      </div>
    </div>
  );
};

export default DropModals;
