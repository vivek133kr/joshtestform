import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "@fontsource/inter";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import ControlledCarousel from "./Carousal.js";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleLogo from "../../productsImg/GoogleLogo.png";
import { Alert } from "@mui/material";
import axios from "axios";
import Image from "../../productsImg/Image1.png";

import UPSCLogo from "../../productsImg/JoshTalksUPSCLogo.png";


import jwt_decode from "jwt-decode"
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../../context/dataContext.js";
export default function BasicModal({
  
}) {
      const [widthTotal, setWidth] = useState(window.innerWidth);
      const {id} = useParams()
      const {handleLoginRequired, handleToken} = useContext(DataContext)
const navigate = useNavigate()
      useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

      useEffect(()=>{
       localStorage.removeItem(`formId${id}_token`);
        localStorage.removeItem("login");
          localStorage.removeItem("loginTime");
             localStorage.removeItem("expirationTime");
      }, [])
  const [index, setIndex] = useState(0);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: widthTotal > "800"? "70vw": "100%",
    height: widthTotal > "800" ?  "80%" :"100%",
 
    backgroundColor: "white",
    
    borderRadius: "15px",
    p: 4,
  };
  const responseMessage = (response) => {
    console.log(response, " line 47");
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const getUserInfo = async (accessToken) => {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        config
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const onSuccess = async (response) => {
    console.log(response);
    const idToken = response.tokenId; // This is the idToken
    const userInfo = await getUserInfo(response.accessToken);
    console.log(userInfo);
  };
const { signIn } = useGoogleLogin({
  clientId: "YOUR_GOOGLE_CLIENT_ID",
  onSuccess,
  onFailure: (error) => {
    console.log(error);
  },
  scope: "profile email",
  prompt: "consent",
});
  const login =  useGoogleLogin({
    onSuccess: async (response) => {
      console.log(response);
      const userInfo = await getUserInfo(response.access_token);
      console.log(userInfo);
      console.log(response.id_token," chekcing id token")
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const slides = [
    {
      url: Image,
    },
   
  ];
  const logins = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

 const responseGoogle = (response) => {
   console.log(response);
 };
const loginCheck = useGoogleLogin({
  onSuccess: (codeResponse) => console.log(codeResponse , "lin 110"),
  flow: "auth-code",
});
  return (
    <div>
      <div>
        <Box
          sx={style}
          style={{
            display: "flex",

            padding: "0px",
            margin: "0px",
          }}
        >
          {widthTotal > 800 ? (
            <div
              style={{
                width: "60%",
                height: "100%",
                margin: "0px",
                padding: "0px",
              }}
            >
              <ControlledCarousel slides={slides} />
            </div>
          ) : (
            ""
          )}
          <div
            style={{
              width: widthTotal > 800 ? "50%" : "100vh",
              height: widthTotal < 800 ? "100vh" : "",
              margin: "0px",

              display: widthTotal < "800" ? "flex" : "",
              flexDirection: widthTotal < "800" ? "column" : "",
              justifyContent: widthTotal < "800" ? "center" : "",

              padding: widthTotal < 800 ? "1%" : "",
            }}
          >
            <div
              style={{
                width: widthTotal > "600" ? "fit-content" : "90%",

                padding: "2%",
                margin: "4%",
                marginTop: widthTotal > "600" ? "5%" : "0px",
              }}
            >
              <img
                style={{
                  width: "120px",

                  margin: widthTotal < "600" ? "auto" : "",
                }}
                src={UPSCLogo}
                alt="d"
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "90%",
                    marginTop: widthTotal < "600" ? "3%" : "",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      fontFamily: "Inter",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "28.025px",
                      lineHeight: "34px",
                    }}
                  >
                    Sign In
                  </Typography>
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    style={{
                      fontFamily: "Inter",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: "14.5px",
                      lineHeight: "18px",
                    }}
                  >
                    Please log in with Google to access and complete the
                    Document Upload Form.
                  </Typography>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  marginTop: widthTotal > "800" ? "15%" : "15%",

                  justifyContent: "center",
                }}
              >
                <GoogleLogin
                  clientId="555163836458-ekq299o1li21bvqavnppmuqjt66vv95o.apps.googleusercontent.com"
                
                  onSuccess={(response) => {
                    console.log(response, " checking res");
                    fetch(
                      "http://staging.joshtalks.org:9002/api/skill/v1/forms/get_info/",
                      {
                        method: "GET",
                        headers: {
                          Authorization: response.credential,
                        },
                      }
                    )
                      .then((res) => res.json())
                      .then((res) => {
                        console.log(res);
                        if (
                          res.detail &&
                          res.detail.includes(
                            "Authentication credentials were not provided."
                          )
                        ) {
                          navigate(`/scholarship/upsc/submit-form/${id}/login`);
                        } else {
                          handleLoginRequired(false);
const expiryDate = new Date();
localStorage.setItem("loginTime", new Date().getTime());
expiryDate.setDate(expiryDate.getDate() + 1);
                          localStorage.setItem(
                            "login",
                            "done",
                           
                          );
                         localStorage.setItem(
                           `formId${id}_token`,
                           response.credential
                         );

                          // Cookies.set("token", response.credential, expiryDate);
                          handleToken(response.credential);

                          navigate(`/scholarship/upsc/submit-form/${id}`);
                        }
                      });
                  }}
                  onFailure={(response) => {
                    console.log(response);
                  }}
                  
                />
              </div>
            </div>

            {/* {error ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Alert
                  severity="error"
                  style={{
                    display: "flex",
                    width: "84%",
                    justifyContent: "center",
                    marginTop: "2%",
                  }}
                >
                  Invalid Credentials! Try Again
                </Alert>
              </div>
            ) : (
              ""
            )} */}
          </div>
        </Box>
      </div>
    </div>
  );
}
