import React, { useContext, useEffect, useState } from "react";
import InputBox from "../InputBox";
import Logo from "./FormComponents/Logo/Logo";
import FirstComponent from "./FormComponents/FirstComponent/FirstComponent";
import Name from "./FormComponents/NameComponent/Name";
import ThankyouComponent from "./FormComponents/ThankyouComponent/ThankyouComponent";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { DataContext } from "../context/dataContext";

import Cookies from "js-cookie"
function Home() {
  
    
  const { id } = useParams();
 
  let [login, setLogin] = useState(localStorage.getItem("login"));
  let [mainToken, setMainToken] = useState(
    localStorage.getItem(`formId${id}_token`)
  );
  let [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { handleLoginRequired, token, loginRequired } = useContext(DataContext);

  // https://app.joshtalks.org/api/skill/v1/forms/${id}
  const [data, setData] = useState("");
  let [fieldList, setFieldList] = useState([]);
  // useEffect(() => {
  //   loginRequired && !loginData && navigate(`/scholarship/upsc/submit-form/${id}/login`)
  // }, []); //sent this to name component

//sent this to name component
  useEffect(() => {
    id &&
      fetch(`http://staging.joshtalks.org:9002/api/skill/v1/forms/${id}`)
        .then((res) => res.json())
        .then((data) => {
    
          console.log(data, " checking line 29 ");

          document.title = data.title;

          if (data.login_required == true && login == undefined || login != "done" ||  mainToken == undefined ) {

            handleLoginRequired(true);
            navigate(`/scholarship/upsc/submit-form/${id}/login`);
           
          } 
          
          if (data.login_required == false){
            handleLoginRequired(false);
                    navigate(`/scholarship/upsc/submit-form/${id}`);
          }
          console.log(data, " data nw");

          setData(data);

          let tempList = data.field_list.sort((a, b) => {
            return a.sort_order - b.sort_order;
          });

          setFieldList(tempList);
        });
  }, []);

  return (
    <>
      {!data ? (
        <div>
          <div className="mt-3">
            <CircularProgress />
          </div>
        </div>
      ) : (
        <div className="m-3">
          <Logo img={data.banner_link} />
          {submitted == false ? (
            <>
              <FirstComponent
                title={data.title}
                subtitle={data.subtitle}
                description={data.description}
              />
              <Name
                fields={fieldList}
                allData={data}
                setSubmitted={setSubmitted}
              />
            </>
          ) : (
            <ThankyouComponent title={data.title} />
          )}
        </div>
      )}
    </>
  );
}

export default Home;
