import React, { useEffect } from "react";
import "./Modal.css";
import CloseIcon from "@mui/icons-material/Close";
import { Close } from "@mui/icons-material";
const Modals = ({ handleClose, show, children }) => {
  



  return (
    <div
      className={
        show
          ? "modal w-full p-4 overflow-x-hidden  md:inset-0 h-auto max-h-full"
          : ""
      }
      style={
        show
          ? { display: "block" }
          : { display: "none" }
      }
    >
      <div className="modal-content" style={{ borderRadius: "8px" }}>
        {children}
        <div
          style={{
            position: "absolute",
            top: "0px",
            cursor: "pointer",
            margin: "10px",

            right: "0px",
          }}
          onClick={handleClose}
        >
          <CloseIcon style={{ width: "40px", color: "#B3B3B3" }} />
        </div>
      </div>
    </div>
  );
};

export default Modals;
