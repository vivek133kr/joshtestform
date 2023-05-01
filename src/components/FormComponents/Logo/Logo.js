import React, { useContext, useEffect } from 'react'
import Image from "./logo.png"
import { useNavigate, useParams } from 'react-router-dom';
import { DataContext } from '../../../context/dataContext';
function Logo({img}) {
 const {id} = useParams()

  const { handleLoginRequired, token, loginRequired } = useContext(DataContext);

    const navigate = useNavigate();

  return (
    <div>
      <img
        style={{ width: "675px", borderRadius: "8px" }}
        className="my-3 "
        src={img}
        alt="logo"
      />
    </div>
  );
}

export default Logo