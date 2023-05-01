import "./Name.css";
import { MySelect } from "./MySelect";
import { Alert, Button, Modal } from "@mui/material";
import "./Modal.css";
import UploadLogo from "./uploadlogo.png";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import pdfIcon from "./pdfIcon.png";
import dataImg from "./dataImg.png";
import Dropzone, { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CircularProgress from "@mui/material/CircularProgress";
import React, {
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { Formik, Form } from "formik";

import "@fontsource/roboto";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import * as Yup from "yup";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modals from "./Modals";

import axios from "axios";
import DropModals from "./DropModals";
import BasicModal from "./GooglePopUp";
import CircularStatic from "./Progress";



const CSRF_TOKEN =
  "Ic2vJLgmmzOGz5LahoImdlHJ4AqBUWUfNsyJ0nRnne6Y19ZynmVC5iM3l0RP8aYU";

function Name({ fields, allData, setSubmitted }) {
  const { id } = useParams();
  let [resendOtp, setResendOtp] = useState(false)
  let [storeOtp, setStoreOtp] = useState("");
  let btnData = useRef([]);
  let navigate = useNavigate();
  let [mobNumber, setMobNumber] = useState("");
  let [files, setFiles] = useState([]);
  let [progress, setProgress] = useState(0);
  let [urlsData, setUrlsData] = useState([]);

  let [combinedData, setCombinedData] = useState();
  const [DropErrors, setDropErrors] = useState([]);
  let [maxFileError, setMaxFileError] = useState(0);
  const [IdToken, setIdToken] = useState(
    localStorage.getItem(`formId${id}_token`)
  );
  let [inValidOTP, setInvalidOtp] = useState(false);
  let [otpResent, setOtpResent] = useState(false);
  const [openFileSection, setOpenFileSection] = useState(null);
  let [FileStore, setFileStore] = useState([]);
  let [dataFilled, setDataFilled] = useState({});
  const [locationData, setLocationData] = useState("");
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  console.log(allData, " line 50");
  const [btnfiles, btnsetFiles] = useState([]);

  const [widthTotal, setWidth] = useState(window.innerWidth);




useEffect(() => {
  if (allData.login_required) {
    const loginTime = localStorage.getItem("loginTime");
    const expirationTime = localStorage.getItem("expirationTime");
    const now = new Date().getTime();

    // If login time or expiration time is not set or 30 minutes have passed since the login time, remove the token and redirect to login
    if (!loginTime ||now - loginTime >= 30 * 60 * 1000) {

      localStorage.removeItem("login");
      localStorage.removeItem("loginTime");
      localStorage.removeItem("expirationTime");
      window.location.href = `/scholarship/upsc/submit-form/${id}/login`;
      return;
    }

    // Set the new expiration time for the token
    const newExpirationTime = now + 30 * 60 * 1000;
    localStorage.setItem("expirationTime", newExpirationTime);

    // Check the expiration time periodically and redirect to login if necessary
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const expirationTime = localStorage.getItem("expirationTime");

      if (!expirationTime || now > expirationTime) {
        localStorage.removeItem("login");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("expirationTime");
        clearInterval(intervalId);
        window.location.href = `/scholarship/upsc/submit-form/${id}/login`;
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }
}, []);

 
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const uploadFile = (file, valuess, setValuess, mainId, name) => {
    alert("Here incoming");
    console.log(valuess, " checking values, line 81");

    console.log(file, valuess, setValuess, mainId, name, " line 83 big check");
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: widthTotal > "800" ? "400px" : "80vw",
    bgcolor: "background.paper",

    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    pb: 0,
  };
let [fileLoading, setFileLoading] = useState(false)
  let [fieldsData, setFieldsData] = useState([]);
  let [change, setChange] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [mainProgress , setmainProgress] = useState(0)

  useEffect(()=>{
    setmainProgress(progress)
  }, [progress])

  let [loading, setLoading] = useState(false);
  let [initialValues, setInitialValues] = useState({});
  let [validationSchema, setValidationSchema] = useState({});

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);
  let refData = useRef([]);
  const [showDropModal, setDropShowModal] = useState(false);

  // const handleDropCloseModal = () => setDropShowModal(false);
  // const handleDropOpenModal = () => setDropShowModal(true);

  useEffect(() => {
    setFieldsData(getFieldsData());

    setValidationSchema(validationNewSchema()); // call validationNewSchema here
    getInitialValues(fields); // call getInitialValues here
    handleBtnData(fields);
  }, [fields, change]);
  useEffect(() => {
    handleBtnData(fieldsData);
  }, [fieldsData]);
  console.log(initialValues, " checking line 126666");

  const handleBtnData = (fields) => {
    let obj = [];

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type == "file") {
        let newobj = {
          id: fields[i].id,
          file: [],
        };
        obj.push(newobj);
      }
    }
    btnData.current = obj;
  };

  const getFieldsData = () => {
    let k = fields;
    let finalobj = [];

    for (let data in k) {
      let obj = k[data];
      obj.name = obj.name.toString().toLowerCase().split(" ").join("");
      finalobj.push(obj);
    }
    return finalobj;
  };

  const getInitialValues = (fieldsData) => {
    let fieldObject = {};
    refData.current = fieldsData;
    for (let field in fieldsData) {
      if (fieldObject[fieldsData[field].type] == "location") {
        fieldObject[fieldsData[field].name] = locationData ? locationData : "";
      } else if (
        fieldsData[field].type == "file" &&
        fieldsData[field].max_file_allowed != null &&
        fieldsData[field].max_file_allowed > 1
      ) {
        fieldObject[fieldsData[field].name] = [];
      } else if (
        fieldsData[field].type == "file" &&
        fieldsData[field].max_file_allowed != null &&
        fieldsData[field].max_file_allowed == 1
      ) {
        fieldObject[fieldsData[field].name] = [];
      } else {
        fieldObject[fieldsData[field].name] = "";
      }
    }
    console.log(fieldObject, " before checking fieldObject");
    setInitialValues(fieldObject);
    console.log(fieldObject, " checking fieldObject");
    return fieldObject;
  };
  console.log(initialValues, " cehckdf initial values");
  const validationNewSchema = () => {
    let obj = {};
    for (let field in fieldsData) {
      if (fieldsData[field].required == true) {
        if (
          fieldsData[field].type == "file" &&
          fieldsData[field].max_file_allowed > 1
        ) {
          obj[fieldsData[field].name] = Yup.array()
            .max(
              fieldsData[field].max_file_allowed,
              `Images must be at most ${fieldsData[field].max_file_allowed}`
            )
            .required("This is a required question");
        } else if (
          fieldsData[field].type == "file" &&
          fieldsData[field].max_file_allowed == 1
        ) {
          obj[fieldsData[field].name] = Yup.array()
            .length(
              fieldsData[field].max_file_allowed,
              `Images must be ${fieldsData[field].max_file_allowed}`
            )
            .required("This is a required question");
        } else if (fieldsData[field].type == "location") {
          obj[fieldsData[field].name] = Yup.string().required(
            "This is a required question"
          );
        } else if (fieldsData[field].type == "checkbox") {
          obj[fieldsData[field].name] = Yup.array().required(
            "This is a required question"
          );
        } else if (fieldsData[field].type == "email") {
          obj[fieldsData[field].name] = Yup.string()
            .email("This should be a valid email address")
            .matches(
              /^.+\.[A-Za-z]{2,}$/,
              "This should be a valid email address"
            )
            .required("This is a required question");
        } else if (fieldsData[field].type == "number") {
          obj[fieldsData[field].name] = Yup.number()
            .typeError("This should be a valid number")
            .required("This is a required question");
        } else if (fieldsData[field].type == "tel") {
          obj[fieldsData[field].name] = Yup.string()
            .matches(
              /^[0-9]{10}$/,
              "This should be a valid 10 digits phone number"
            )
            .required("This is a required question");
        } else {
          if (
            fieldsData[field].type == "text" &&
            fieldsData[field].text_only == true &&
            fieldsData[field].length > 0
          ) {
            obj[fieldsData[field].name] = Yup.string()
              .matches(
                /^[a-zA-Z\s]*$/,
                "This field should not contain numbers or special characters"
              )
              .max(
                fieldsData[field].length,
                `This field should not exceed ${fieldsData[field].length} characters`
              )
              .required("This is a required question");
          } else if (
            fieldsData[field].type === "text" &&
            fieldsData[field].text_only === true &&
            fieldsData[field].length === 0
          ) {
            obj[fieldsData[field].name] = Yup.string()
              .matches(
                /^[a-zA-Z\s]*$/,
                "This field should not contain numbers or special characters"
              )
              .required("This is a required question");
          } else if (
            fieldsData[field].type === "text" &&
            fieldsData[field].text_only === false &&
            fieldsData[field].length > 0
          ) {
            obj[fieldsData[field].name] = Yup.string()
              .max(
                fieldsData[field].length,
                `This field should not exceed ${fieldsData[field].length} characters`
              )
              .required("This is a required question");
          } else {
            obj[fieldsData[field].name] = obj[fieldsData[field].name] =
              Yup.string().required("This is a required question");
          }
        }
      } else {
        obj[fieldsData[field].name] = Yup.string();
      }
    }

    return Yup.object().shape(obj);
  };

  const handlePostData = async (values, setValues) => {
    const transformedData = [];
    setLoading(true)
   
    console.log(values, urlsData, " hcekdkfsdkjfsokdjfksdjfk");
    for (const fieldName in values) {
      const field = fieldsData.find((f) => f.name === fieldName);

      if (field.type == "file") {
        let arr = [];

        values[field.name].map(async (file) => {
          console.log(file, "line 266 hhhhhhhhhhhhhhhhhhh");
        });
        let mainData = [];
        let output = [];

        console.log(values[field.name], " linefid dsfo sdfodfkodsj fdsfoksdf ", urlsData, btnData)
        // Iterate over fileupload array
        for (let file of values[field.name]) {
          // Search for corresponding URL in urlsData array
          for (let data of urlsData) {
            if (data.id == field.id) {
              for (let obj of data.data) {
               
                console.log(obj, file, " checking on  line number 319")
                if (obj.file.name=== file.name) {
                 
                  console.log(obj, " checking after a mathc")
                  output.push(obj.url);
                  break;
                }
              }
            }
          }
        }

        console.log(output, " checking new things on line 285 dekho");
        transformedData.push({
          field: field.id,
          answer_value: output.join(","),
        });
      } else if (field.type !== "file") {
        transformedData.push({
          field: field.id,
          answer_value:
            typeof values[fieldName] == "object"
              ? values[fieldName].join(", ")
              : values[fieldName],
        });
      }
    }

    console.log(transformedData, " checking transformedData in line 300");
    let storeMob;
    for (let j = 0; j < fieldsData.length; j++) {
      if (fieldsData[j].type == "tel") {
        storeMob = dataFilled[fieldsData[j].name];
      }
    }
    console.log(transformedData, " checking transformedData in line 307");
    let updatedData = transformedData.sort((a, b) => {
      return a.field - b.field;
    });
    console.log(updatedData, " line 309");
    let data;
    if (allData.otp_required == true) {
      data = {
        answers: updatedData,
        otp: storeOtp,
        mobile: storeMob,
      };
    } else {
      data = {
        answers: updatedData,
        otp: "",
        mobile: "",
      };
    }

    console.log(data, "line 315");
    let dataFormat;

    console.log(data, " line 331");

    if (allData.otp_required == true) {
      dataFormat = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: IdToken,
        },
        body: JSON.stringify(data),
      };
    } else {
      dataFormat = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ``,
        },
        body: JSON.stringify(data),
      };
    }

    await fetch(
      `http://staging.joshtalks.org:9002/api/skill/v1/forms/${id}/submit/`,
      dataFormat
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res, " line 332 succes");
        if (res.error === "OTP is not valid") {
          setOtpResent(true);
          setInvalidOtp(true);
          setLoading(false);
          setStoreOtp("");
        } else {
          setInvalidOtp(false);
          setOtpResent(false);
          setLoading(false);
          handleCloseModal();
          setSubmitted(true);
        }
      })
      .catch((err) => {
        console.log(err, " line 332 error");
      });
  };

  return (
    <div className="my-3 max-w-2xl mx-auto">
      {/* <CircularStatic/> */}
      <Formik
        initialValues={
          Object.keys(initialValues).length > 0 ? initialValues : {}
        }
        validationSchema={validationNewSchema}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            validateForm,
            dirty,
            setTouched,
            setErrors,
            isSubmitting,

            handleBlur,
            setValues,
          } = props;

          console.log(values, " checking updaed values");
          const handleChange = (event) => {
            const { name, value, type, checked } = event.target;

            if (type === "checkbox") {
              const checkboxValue = values[name] || [];

              setValues((prevValues) => ({
                ...prevValues,
                [name]: checked
                  ? [...checkboxValue, value]
                  : checkboxValue.filter((val) => val !== value),
              }));
            } else {
              setValues((prevValues) => ({
                ...prevValues,
                [name]: value,
              }));
            }

            setDataFilled({ ...values, [name]: value });
          };
          const newFunction = () => {
            alert("hello");
          };
          function success(pos) {
            var crd = pos.coords;

            const apiKey = "47873f180d4241b1a2276aa6c204c342";
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${crd.latitude}+${crd.longitude}&key=${apiKey}`;
            axios
              .get(url)
              .then((response) => {
                console.log(response, " check response scoming from api");
                const { city, postcode, country } =
                  response.data.results[0].components;
                let datastr = `${city}, ${postcode}, ${country}`;
                city && postcode && setLocationData(datastr);
                for (let i = 0; i < fieldsData.length; i++) {
                  if (fieldsData[i].type == "location") {
                    setValues((prevValues) => ({
                      ...prevValues,
                      [fieldsData[i].name]: datastr,
                    }));
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
          function errorHandler(error) {
            console.warn(`ERROR(${error.code}): ${error.message}`);
          }
          console.log(urlsData, "line 955");
          const askLocationPermission = (e) => {
            console.log(fieldsData, " hello ");
            let newarr = fieldsData;
            if (navigator.geolocation) {
              navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                  if (result.state === "granted") {
                    console.log(result.state);
                    console.log(values, locationData, newarr, " 0th");
                    //If granted then you can directly call your function here
                    navigator.geolocation.getCurrentPosition(success);
                  } else if (result.state === "prompt") {
                    navigator.geolocation.getCurrentPosition(
                      success,
                      errorHandler,
                      options
                    );
                  } else if (result.state === "denied") {
                    //If denied then you have to show instructions to enable location
                  }
                  result.onchange = function () {
                    console.log(result.state);
                  };
                });
              console.log(values, locationData, " 0th");
              if (locationData.length > 0) {
                console.log(values, locationData, " 1st");
                for (let i = 0; i < fieldsData.length; i++) {
                  if (fieldsData[i].type == "location") {
                    setValues((prevValues) => ({
                      ...prevValues,
                      [fieldsData[i].name]: locationData,
                    }));
                  }
                }
              }
              console.log(values, locationData, "2nd");

              // let newValue = value;
              // if (name.includes("location") && locationData) {
              //   newValue = locationData;
              // }
            } else {
              alert("Sorry Not available!");
            }

            console.log(locationData, " location new");
          };

          const handleReset = async () => {
            setValues(initialValues);
            const isValid = await validateForm();

            for (let key in isValid) {
              let newerrors = errors;

              newerrors[key] = "";
            }
            console.log("after update", errors);
            const touchedFields = {};
            Object.keys(errors).forEach((fieldName) => {
              touchedFields[fieldName] = false;
            });
            setTouched(touchedFields);
            setChange(!change);
            const resetRadioButtons = document.querySelectorAll(
              'input[type="radio"]'
            );
            resetRadioButtons.forEach((radioButton) => {
              if (radioButton.checked) {
                radioButton.checked = false;
                radioButton.value = "";
              }
            });
            const resetCheckboxes = document.querySelectorAll(
              'input[type="checkbox"]'
            );
            resetCheckboxes.forEach((checkbox) => {
              if (checkbox.checked) {
                checkbox.checked = false;
                checkbox.value = "";
              }
            });
            window.location.reload(false);
          };

          return (
            <div>
              <div>
                {fieldsData.map((item) =>
                  item.type !== "radio" &&
                  item.type !== "checkbox" &&
                  item.type !== "file" &&
                  item.type !== "location" ? (
                    <div
                      key={item.id}
                      style={{ borderRadius: "8px" }}
                      className={`bg-white p-5 mt-3 ${
                        errors[item.name] && touched[item.name]
                          ? "border border-red-500"
                          : "border"
                      }`}
                    >
                      <label
                        htmlFor={item.name}
                        style={{ display: "block" }}
                        className="font-normal font-medium text-base leading-6 inputLabel"
                      >
                        {item.label}
                        <span className="text-red-600">
                          {item.required ? " * " : ""}
                        </span>
                      </label>
                      <input
                        id="name"
                        name={item.name}
                        placeholder="Your answer"
                        type={item.type === "tel" ? "number" : item.type}
                        inputMode={item.type === "tel" ? "numeric" : undefined}
                        digits={item.type === "tel" ? "10" : undefined}
                        value={values[item.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyPress={(e) => {
                          if (item.type === "tel" && !/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                          if (
                            item.type === "text" &&
                            item.text_only == true &&
                            /^\d$/.test(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className={`mt-7 mb-3 inputBox focus:outline-none ${
                          errors[item.name] && touched[item.name]
                            ? "text-input error"
                            : "text-input"
                        }`}
                      />

                      {errors[item.name] && touched[item.name] && (
                        <div className="input-feedback flex text-red-600  items-center">
                          <span>
                            <ErrorOutlineIcon />
                          </span>
                          <span
                            style={{ marginLeft: "1%" }}
                            className="errorStyle"
                          >
                            {errors[item.name]}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : item.type == "radio" ? (
                    <div
                      key={item.id}
                      style={{ borderRadius: "8px" }}
                      className={`bg-white p-5 mt-3 ${
                        errors[item.name] && touched[item.name]
                          ? "border border-red-500"
                          : "border"
                      }`}
                    >
                      <label
                        htmlFor={item.name}
                        style={{ display: "block" }}
                        className="font-normal font-medium text-base leading-6 inputLabel"
                      >
                        {item.label}
                        <span className="text-red-600">
                          {item.required ? " * " : ""}
                        </span>
                      </label>
                      <div>
                        {item.options.map((option, i) => (
                          <div className="divRadio mt-4" key={i}>
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="radio"
                              id={`${item.name}-${i}`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={item.name}
                              value={option.value}
                            />

                            <div style={{ marginLeft: "2%" }}>
                              <label
                                htmlFor={`${item.name}-${i}`}
                                style={{ cursor: "pointer" }}
                                className="label"
                              >
                                {option.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors[item.name] && touched[item.name] && (
                        <div className="input-feedback flex text-red-600  items-center mt-3">
                          <span>
                            <ErrorOutlineIcon />
                          </span>
                          <span
                            style={{ marginLeft: "1%" }}
                            className="errorStyle"
                          >
                            {errors[item.name]}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : item.type == "checkbox" ? (
                    <div
                      key={item.id}
                      style={{ borderRadius: "8px" }}
                      className={`bg-white p-5 mt-3 ${
                        errors[item.name] && touched[item.name]
                          ? "border border-red-500"
                          : "border"
                      }`}
                    >
                      <label
                        htmlFor={item.name}
                        style={{ display: "block" }}
                        className="font-normal font-medium text-base leading-6 inputLabel"
                      >
                        {item.label}
                        <span className="text-red-600">
                          {item.required ? " * " : ""}
                        </span>
                      </label>
                      <div>
                        {item.options.map((option, i) => (
                          <div className="divRadio mt-4" key={i}>
                            <input
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              id={`${item.name}-${i}`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name={item.name}
                              value={option.value}
                            />

                            <div style={{ marginLeft: "2%" }}>
                              <label
                                className="label"
                                htmlFor={`${item.name}-${i}`}
                                style={{ cursor: "pointer" }}
                              >
                                {option.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors[item.name] && touched[item.name] && (
                        <div className="input-feedback flex text-red-600  items-center mt-3">
                          <span>
                            <ErrorOutlineIcon />
                          </span>
                          <span
                            style={{ marginLeft: "1%" }}
                            className="errorStyle"
                          >
                            {errors[item.name]}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : item.type == "location" ? (
                    <div
                      key={item.id}
                      style={{ borderRadius: "8px" }}
                      className={`bg-white p-5 mt-3 ${
                        errors[item.name] && touched[item.name] && !locationData
                          ? "border border-red-500"
                          : "border border"
                      }`}
                    >
                      <label
                        htmlFor={item.name}
                        style={{ display: "block" }}
                        className="font-normal font-medium text-base leading-6 inputLabel"
                      >
                        Current Location
                        <span className="text-red-600">
                          {true ? " * " : ""}
                        </span>
                      </label>
                      {locationData.length == 0 ? (
                        <div className="mt-6">
                          <Button
                            name={item.name}
                            variant="contained"
                            value={""}
                            onClick={() => askLocationPermission()}
                            style={{
                              display: "flex",
                              backgroundColor: "white",
                              color: "blue",
                              height: "37px",
                            }}
                          >
                            <LocationOnIcon />
                            <p>Add Location</p>
                          </Button>
                          {errors[item.name] && touched[item.name] && (
                            <div className="input-feedback flex text-red-600  items-center mt-3">
                              <span>
                                <ErrorOutlineIcon />
                              </span>
                              <span
                                style={{ marginLeft: "1%" }}
                                className="errorStyle"
                              >
                                {errors[item.name]}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{ display: "flex", width: "fit-content" }}
                          className="mt-5"
                        >
                          <LocationOnIcon />
                          <input
                            style={{
                              backgroundColor: "white",
                            }}
                            name={item.name}
                            value={values[item.name]}
                            disabled
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    item.type == "file" && (
                      <div
                        key={item.id}
                        style={{ borderRadius: "8px" }}
                        className={`bg-white p-5 mt-3 ${
                          errors[item.name] && touched[item.name]
                            ? "border border-red-500"
                            : "border border"
                        }`}
                      >
                        <label
                          htmlFor={item.name}
                          style={{ display: "block" }}
                          className="font-normal font-medium text-base leading-6 inputLabel"
                        >
                          {item.label}
                          <span className="text-red-600">
                            {true ? " * " : ""}
                          </span>
                        </label>

                        {values[item.name] == undefined ||
                        values[item.name].length < item.max_file_allowed ? (
                          <Button
                            name={item.name}
                            variant="contained"
                            onClick={() => {
                              setDropErrors([]);
                              setMaxFileError(0);
                              setOpenFileSection(item.id);
                            }}
                            value={""}
                            style={{
                              display: "flex",
                              backgroundColor: "white",
                              color: "blue",
                              marginTop: "3%",
                              height: "37px",
                            }}
                          >
                            <FileUploadIcon />
                            <p>Add File</p>
                          </Button>
                        ) : (
                          values[item.name].length == item.max_file_allowed &&
                          ""
                        )}
                        {item.id === openFileSection && (
                          <div
                            className="dropzone-container"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0,0,0,0.5)",
                              zIndex: 9999,
                            }}
                            onClick={(event) => {
                              if (
                                event.target.className === "dropzone-container"
                              ) {
                                setOpenFileSection(null);
                                console.log(
                                  event.target.className,
                                  " checking new thing classes"
                                );
                              }
                            }}
                          >
                            <Dropzone
                              key={item.id}
                              maxFiles={item.max_file_allowed}
                              accept={item.document_types
                                .split(",")
                                .map((ext) => {
                                  switch (ext) {
                                    case ".jpeg":
                                    case ".jpg":
                                      return "image/jpeg";
                                    case ".png":
                                      return "image/png";
                                    case ".xls":
                                    case ".xlsm":
                                    case ".xlsx":
                                      return "application/vnd.ms-excel";
                                    case ".csv":
                                      return "text/csv";
                                    case ".doc":
                                    case ".docx":
                                      return "application/msword";
                                    case ".pdf":
                                      return "application/pdf";
                                    case ".txt":
                                      return "text/plain";
                                    default:
                                      return "";
                                  }
                                })
                                .filter((type) => type !== "") // remove any empty types
                                .join(", ")}
                              maxSize={Number(item.max_file_size) * 1024 * 1024}
                              onDrop={(acceptedFiles, rejectedFiles) => {
                                setProgress(0);

                                let newVal = acceptedFiles.map((file) => ({
                                  file,
                                  name: file.name,
                                  progress: 0,
                                  loading: false,
                                  url: "",
                                }));
                                if (
                                  values[item.name] &&
                                  values[item.name].length > 0
                                ) {
                                  newVal = newVal.filter((newFile) => {
                                    return !values[item.name].some(
                                      (existingFile) => {
                                        return (
                                          newFile.name === existingFile.name
                                        );
                                      }
                                    );
                                  });
                                }
                                if (
                                  rejectedFiles.length > item.max_file_allowed
                                ) {
                                  setMaxFileError(item.max_file_allowed);
                                }
                                if (
                                  newVal.length > item.max_file_allowed ||
                                  (values[item.name] &&
                                    newVal.length + values[item.name].length >
                                      item.max_file_allowed)
                                ) {
                                  setMaxFileError(item.max_file_allowed);
                                  return;
                                }
                                if (
                                  rejectedFiles.length > 0 ||
                                  newVal.length == 0 ||
                                  (values[item.name] &&
                                    newVal.length + values[item.name].length >
                                      item.max_file_allowed)
                                ) {
                                  if (
                                    values[item.name] &&
                                    newVal.length + values[item.name].length >
                                      item.max_file_allowed
                                  ) {
                                    setMaxFileError(item.max_file_allowed);
                                    return;
                                  }
                                  return;
                                }

                                if (
                                  values[item.name] &&
                                  values[item.name].length ==
                                    item.max_file_allowed
                                ) {
                                } else if (
                                  values[item.name] == undefined ||
                                  values[item.name].length + newVal.length <=
                                    item.max_file_allowed
                                ) {
                                  setValues((prevValues) => ({
                                    ...prevValues,
                                    [item.name]: prevValues[item.name]
                                      ? [...prevValues[item.name], ...newVal]
                                      : newVal,
                                  }));
                                  let kval = btnData.current;

                                  for (let i = 0; i < kval.length; i++) {
                                    if (kval[i].id == item.id) {
                                      if (kval[i].file.length > 0) {
                                        kval[i].file.push(...newVal);
                                      } else {
                                        kval[i].file.push(...newVal);
                                      }
                                    }
                                  }
                                  btnData.current = kval;

                                  console.log(btnData.current, " line 111");
                                }

                                console.log(
                                  values[item.name],
                                  " checking line 930"
                                );

                                const acceptedTypes = [];

                                item.document_types
                                  .split(",")
                                  .forEach(function (fileType) {
                                    if (
                                      fileType === ".jpeg" ||
                                      fileType === ".jpg"
                                    ) {
                                      acceptedTypes.push("image/jpeg");
                                    } else if (fileType === ".png") {
                                      acceptedTypes.push("image/png");
                                    } else if (
                                      fileType === ".xls" ||
                                      fileType === ".xlsm" ||
                                      fileType === ".xlsx"
                                    ) {
                                      acceptedTypes.push(
                                        "application/vnd.ms-excel"
                                      );
                                    } else if (fileType === ".csv") {
                                      acceptedTypes.push("text/csv");
                                    } else if (
                                      fileType === ".doc" ||
                                      fileType === ".docx"
                                    ) {
                                      acceptedTypes.push("application/msword");
                                    } else if (fileType === ".pdf") {
                                      acceptedTypes.push("application/pdf");
                                    } else if (fileType === ".txt") {
                                      acceptedTypes.push("text/plain");
                                    }
                                  });
                                console.log(acceptedTypes, " line 821");
                                const invalidFiles = acceptedFiles.filter(
                                  (file) => !acceptedTypes.includes(file.type)
                                );
                                const validFiles = acceptedFiles.filter(
                                  (file) => acceptedTypes.includes(file.type)
                                );
                                if (invalidFiles.length > 0) {
                                  alert(
                                    `Invalid file type(s) detected. Only ${acceptedTypes.join(
                                      ", "
                                    )} files are accepted.`
                                  );
                                }
                                console.log(
                                  DropErrors,
                                  " line 1022 ",
                                  validFiles,
                                  " checking new"
                                );

                                if (
                                  rejectedFiles.length == 0 &&
                                  validFiles.length > 0
                                ) {
                                  newVal.map(async (newItem) => {
                                    setProgress(0);

                                    const formData = new FormData();
                                    formData.append("file", newItem.file);

                                    const xhr = new XMLHttpRequest();
                                    xhr.open(
                                      "POST",
                                      `http://staging.joshtalks.org:9002/api/skill/v1/forms/upload/${item.id}/`
                                    );
                                    xhr.withCredentials = true;
                                    xhr.setRequestHeader(
                                      "Authorization",
                                      IdToken
                                    );
                                    xhr.setRequestHeader(
                                      "Cookie",
                                      `csrftoken=${CSRF_TOKEN}`
                                    );

                                    xhr.upload.addEventListener(
                                      "progress",
                                      (event) => {
                                        if (event.lengthComputable) {
                                          const percentCompleted = Math.round(
                                            (event.loaded * 100) / event.total
                                          );
                                          setProgress(percentCompleted);
                                          let newData = btnData.current;
                                          console.log(
                                            newData,
                                            " checking lin e dfnsdfjsd"
                                          );

                                          let newVal;
                                          for (
                                            let i = 0;
                                            i < newData.length;
                                            i++
                                          ) {
                                            if (newData[i].id == item.id) {
                                              let j = newData[i];
                                              let newVal = j.file.filter(
                                                (copy) =>
                                                  copy.name == newItem.name
                                              );

                                              if (percentCompleted <= 100) {
                                                newVal[0].progress =
                                                  percentCompleted;
                                              }
                                              console.log(
                                                j,
                                                newVal,
                                                newData,
                                                btnData,
                                                " line 645645645645645645"
                                              );
                                            }
                                          }

                                          //  setValues((prevFiles) =>
                                          //    prevFiles.map((f) =>
                                          //      f.name === file.name
                                          //        ? {
                                          //            ...f,
                                          //            progress: percentCompleted,
                                          //          }
                                          //        : f
                                          //    )
                                          //  );
                                        }
                                      }
                                    );
                                    console.log(
                                      values[item.name],
                                      " line 1343243423"
                                    );

                                    xhr.addEventListener("load", (event) => {
                                      setFileLoading(true);
                                      if (event.target.status === 201) {
                                        const res = JSON.parse(xhr.response);
                                        console.log(
                                          "File uploaded successfully!"
                                        );
                                        console.log(
                                          res,
                                          " checking line 1200000"
                                        ); // do something with the response data

                                        let k = urlsData;

                                        if (k.length == 0) {
                                          k.push({
                                            id: item.id,
                                            data: [
                                              {
                                                file: newItem,
                                                url: res.url,
                                              },
                                            ],
                                          });
                                        } else {
                                          let find = false;
                                          for (let i = 0; i < k.length; i++) {
                                            if (item.id == k[i].id) {
                                              find = true;
                                              k[i].data.push({
                                                file: newItem,
                                                url: res.url,
                                              });
                                            }
                                          }
                                          if (find == false) {
                                            k.push({
                                              id: item.id,
                                              data: [
                                                {
                                                  file: newItem,
                                                  url: res.url,
                                                },
                                              ],
                                            });
                                          }
                                        }

                                        setUrlsData(k);
                                        setFileLoading(false);
                                      }
                                      if (event.target.status == 403) {
                                        let newData = btnData.current;
                                        console.log(
                                          newData,
                                          " checking lin e dfnsdfjsd"
                                        );

                                        let newVal;
                                        for (
                                          let i = 0;
                                          i < newData.length;
                                          i++
                                        ) {
                                          if (newData[i].id == item.id) {
                                            let j = newData[i];
                                            let newVal = j.file.filter(
                                              (copy) =>
                                                copy.name == newItem.name
                                            );

                                            newVal[0].progress = -1;

                                            console.log(
                                              j,
                                              newVal,
                                              newData,
                                              btnData,
                                              " line 645645645645645645"
                                            );
                                          }
                                        }
                                      }
                                    });

                                    //  xhr.addEventListener("error", (error) => {
                                    //    console.error(error);
                                    //    setFiles((prevFiles) =>
                                    //      prevFiles.map((f) =>
                                    //        f.name === file.name
                                    //          ? { ...f, progress: -1 }
                                    //          : f
                                    //      )
                                    //    );
                                    //  });

                                    xhr.send(formData);
                                    setOpenFileSection(null);
                                    // const formData = new FormData();
                                    // formData.append("file", newItem);

                                    // await
                                    //  fetch
                                    //  (
                                    //   `http://staging.joshtalks.org:9002/api/skill/v1/forms/upload/${item.id}/`,
                                    //   {
                                    //     method: "POST",
                                    //     headers: {
                                    //       Authorization: IdToken,
                                    //       Cookie:
                                    //         "csrftoken=Ic2vJLgmmzOGz5LahoImdlHJ4AqBUWUfNsyJ0nRnne6Y19ZynmVC5iM3l0RP8aYU",
                                    //     },
                                    //     body: formData,
                                    //   }
                                    // )
                                    //   .then((res) => res.json())
                                    //   .then((res) => {
                                    //     console.log(
                                    //       res,
                                    //       " checking over here",
                                    //       urlsData
                                    //     );
                                    //     let k = urlsData;

                                    //     if (k.length == 0) {
                                    //       k.push({
                                    //         id: item.id,
                                    //         data: [
                                    //           {
                                    //             file: newItem,
                                    //             url: res.url,
                                    //           },
                                    //         ],
                                    //       });
                                    //     } else {
                                    //       let find = false;
                                    //       for (let i = 0; i < k.length; i++) {
                                    //         if (item.id == k[i].id) {
                                    //           find = true;
                                    //           k[i].data.push({
                                    //             file: newItem,
                                    //             url: res.url,
                                    //           });
                                    //         }
                                    //       }
                                    //       if (find == false) {
                                    //         k.push({
                                    //           id: item.id,
                                    //           data: [
                                    //             {
                                    //               file: newItem,
                                    //               url: res.url,
                                    //             },
                                    //           ],
                                    //         });
                                    //       }
                                    //     }

                                    //     setUrlsData(k);
                                    //   })
                                    //   .catch((error) => console.log(error));
                                  });
                                }

                                // console.log(urlsData, "line 955");

                                // if (
                                //   rejectedFiles.length == 0 &&
                                //   DropErrorTrack == false
                                // ) {
                                //   setOpenFileSection(null);
                                // } else {
                                // }
                              }}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div
                                  style={{
                                    width: widthTotal > 800 ? "40%" : "90%",
                                    height: "423px",

                                    borderRadius: "8px",
                                    backgroundColor: "white",
                                    display: "flex",
                                    padding: "0px",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      paddingTop: "5%",
                                      paddingBottom: "5%",
                                      textAlign: "center",
                                      display: "flex",

                                      width: "100%",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontSize: "28px",
                                        color: "#1A73E8",
                                        fontFamily: "Roboto",
                                        paddingLeft: "4%",
                                        paddingRight: "4%",
                                        fontStyle: "normal",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Upload Files
                                    </p>
                                    <p
                                      style={{
                                        width: "90%",
                                      }}
                                    >
                                      Please make sure that the picture or PDF
                                      is clear
                                    </p>{" "}
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "70%",

                                      flexDirection: "column",
                                      marginBottom: "5%",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div
                                      {...getRootProps({
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        margin: "30px",
                                        width: "300px",

                                        border: "2px solid purple",

                                        borderWidth: 2,
                                        borderRadius: 2,
                                        borderColor: "#eeeeee",
                                        borderStyle: "dashed",
                                        backgroundColor: "#fafafa",
                                        color: "#bdbdbd",
                                        transition: "border .3s ease-in-out",
                                      })}
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <input
                                        {...getInputProps({
                                          maxFiles: item.max_file_allowed,
                                          accept: item.document_types
                                            .split(",")
                                            .map((ext) => {
                                              switch (ext) {
                                                case ".jpeg":
                                                case ".jpg":
                                                  return "image/jpeg";
                                                case ".png":
                                                  return "image/png";
                                                case ".xls":
                                                case ".xlsm":
                                                case ".xlsx":
                                                  return "application/vnd.ms-excel";
                                                case ".csv":
                                                  return "text/csv";
                                                case ".doc":
                                                case ".docx":
                                                  return "application/msword";
                                                case ".pdf":
                                                  return "application/pdf";
                                                case ".txt":
                                                  return "text/plain";
                                                default:
                                                  return "";
                                              }
                                            })
                                            .filter((type) => type !== "") // remove any empty types
                                            .join(", "),

                                          // limit to 5MB
                                        })}
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          height: "230px",

                                          borderWidth: 2,
                                          borderRadius: 9,
                                          borderColor: "#1A73E8",
                                          borderStyle: "dashed",
                                          backgroundColor: "#fafafa",
                                          border: "4px dashed #1A73E8",
                                          color: "#bdbdbd",
                                          transition: "border .3s ease-in-out",

                                          width: "100%",
                                        }}
                                      >
                                        <img src={UploadLogo} alt="new" />
                                        <p>Drag and drop file here</p>
                                        <p>OR</p>
                                        <Button variant="contained">
                                          Browse Files
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  {/* {values[item.name].length == item.max_file_allowed ? (
                                    <Alert
                                      icon={false}
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        margin: "0 auto",
                                        backgroundColor: "black",
                                        color: "white",
                                      }}
                                    >
                                      <p>
                                        {" "}
                                        {DropErrors.length}
                                        {DropErrors.length == 1
                                          ? " file"
                                          : " files"}{" "}
                                        have been rejected. Make sure all files
                                        size should be within{" "}
                                        {item.max_file_size} mb
                                      </p>
                                    </Alert>
                                        ):""} */}

                                  {DropErrors && DropErrors.length > 0 ? (
                                    <Alert
                                      icon={false}
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        margin: "0 auto",
                                        backgroundColor: "black",
                                        color: "white",
                                      }}
                                    >
                                      <p>
                                        {" "}
                                        {DropErrors.length}
                                        {DropErrors.length == 1
                                          ? " file"
                                          : " files"}{" "}
                                        have been rejected. Make sure all files
                                        size should be within{" "}
                                        {item.max_file_size} mb. Select Again
                                      </p>
                                    </Alert>
                                  ) : (
                                    ""
                                  )}
                                  {maxFileError && maxFileError > 0 ? (
                                    <Alert
                                      icon={false}
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        margin: "0 auto",
                                        backgroundColor: "black",
                                        color: "white",
                                      }}
                                    >
                                      <p>
                                        Try again with fewer items. Upload of
                                        upto {maxFileError} files is allowed.
                                        <span>
                                          {" "}
                                          <Button
                                            style={{
                                              color: "#F3F800",
                                              border: "none",
                                              background: "transparent",
                                            }}
                                            variant="outlined"
                                            onClick={() => setMaxFileError(0)}
                                          >
                                            Dismiss
                                          </Button>
                                        </span>
                                      </p>
                                    </Alert>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginTop: "3%",
                          }}
                        >
                          {values[item.name] && item.max_file_allowed >= 1
                            ? btnData.current
                                .filter((obj) => obj.id === item.id)
                                .map((ite, i) =>
                                  ite.file.map((items, j) => {
                                    return (
                                      <div
                                        key={j}
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          // alignItems: "center",

                                          // marginTop: "10px",
                                          // paddingTop: "10px",
                                          // paddingBottom: "10px",

                                          // paddingRight: "10px",
                                          // height: "40px",
                                          // paddingLeft: "10px",
                                          // marginRight: "10px",
                                          // marginBottom: "10px",
                                          // borderRadius: "4px",
                                          // border: "0.5px solid black",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",

                                            marginTop: "10px",
                                            paddingTop: "10px",
                                            paddingBottom: "10px",

                                            paddingRight: "10px",
                                            height: "40px",
                                            paddingLeft: "10px",
                                            marginRight: "10px",
                                            marginBottom: "10px",
                                            borderRadius: "4px",
                                            border: "0.5px solid black",
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              marginRight: "30px",
                                            }}
                                          >
                                            {" "}
                                            <img
                                              style={{
                                                width: "24px",
                                                height: "24px",
                                                marginRight: "10px",
                                              }}
                                              src={
                                                items.name.includes(".xls") ||
                                                items.name.includes(".xlsm") ||
                                                items.name.includes(".xlsx") ||
                                                items.name.includes(".csv") ||
                                                items.name.includes(".doc") ||
                                                items.name.includes(".docx") ||
                                                items.name.includes(".pdf") ||
                                                items.name.includes(".txt")
                                                  ? pdfIcon
                                                  : dataImg
                                              }
                                              alt="i"
                                            />
                                            <p
                                              style={{
                                                flex: 1,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              {" "}
                                              {items.name.length > 10
                                                ? items.name
                                                    .split(".")
                                                    .slice(0, -1)
                                                    .join(".")
                                                    .slice(0, 10)
                                                : items.name.split(".")[0]}
                                            </p>
                                          </div>

                                          {items.progress == 100 ||
                                          items.progress == -1 ? (
                                            <div
                                              style={{
                                                fontSize: "16px",
                                                fontWeight: "bold",

                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                let newvalues =
                                                  values[item.name];
                                                console.log(
                                                  values[item.name],
                                                  " checking here line 1103",
                                                  items
                                                );

                                                let newData = btnData.current;
                                                console.log(
                                                  newData,
                                                  btnData.current,
                                                  " checking out here, line 42423"
                                                );

                                                for (
                                                  let i = 0;
                                                  i < newData.length;
                                                  i++
                                                ) {
                                                  console.log(
                                                    newData,
                                                    " checking dfjdnfsdn"
                                                  );
                                                  if (
                                                    newData[i].id == item.id
                                                  ) {
                                                    let j = newData[i];
                                                    let newval = j.file.filter(
                                                      (copy) =>
                                                        copy.name != items.name
                                                    );
                                                    j.file = newval;
                                                    console.log(
                                                      j,
                                                      newData,
                                                      btnData,
                                                      " line 88888888"
                                                    );
                                                  }
                                                }

                                                let k = newvalues.filter(
                                                  (itemnew) =>
                                                    itemnew.name !== items.name
                                                );
                                                setValues((prevValues) => ({
                                                  ...prevValues,
                                                  [item.name]: k,
                                                }));
                                              }}
                                            >
                                              X
                                            </div>
                                          ) : (
                                            <CircularProgress
                                              variant="determinate"
                                              value={items.progress}
                                              size="3vh"
                                            />
                                          )}
                                        </div>
                                        {items.progress === -1 && (
                                          <p style={{ color: "red" }}>
                                            Failed to upload!
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })
                                )
                            : ""}
                        </div>
                        {errors[item.name] && touched[item.name] && (
                          <div className="input-feedback flex text-red-600  items-center mt-3">
                            <span>
                              <ErrorOutlineIcon />
                            </span>
                            <span
                              style={{ marginLeft: "1%" }}
                              className="errorStyle"
                            >
                              {errors[item.name]}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  )
                )}

                <div
                  style={{
                    marginTop: "3%",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Roboto",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "12px",
                    }}
                  >
                    {" "}
                    By clicking 'Submit,' you acknowledge that you have read,
                    understood, and agree to the &nbsp;
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      <a
                        href="https://app.joshtalks.org/privacy-policy/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Privacy Policy
                      </a>
                    </span>
                    &nbsp; and&nbsp;
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        cursor: "pointer",
                      }}
                    >
                      {" "}
                      <a
                        href="https://app.joshtalks.org/terms-conditions/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {" "}
                        Terms & Conditions{" "}
                      </a>
                    </span>{" "}
                    &nbsp;of Josh Talks. Please review these documents to ensure
                    you are fully informed before proceeding.
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",

                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                  className={` p-5 mt--1 `}
                >
                  {allData.otp_required == false && loading ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      style={{
                        textTransform: "none",
                        backgroundColor: "#E33900",
                      }}
                      variant="contained"
                      onClick={async () => {
                        console.log("values checking new thing", values);
                        const isValid = await validateForm();

                        if (Object.keys(isValid).length > 0) {
                          const err = Object.keys(isValid);
                          if (err.length) {
                            const input = document.querySelector(
                              `label[for=${`${err[0]}`}]`
                            );

                            input.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                              inline: "start",
                            });
                          }
                          for (let key in isValid) {
                            let newerrors = errors;

                            newerrors[key] = isValid[key];
                          }
                          console.log(errors, "line 1282");
                          const touchedFields = {};
                          Object.keys(errors).forEach((fieldName) => {
                            touchedFields[fieldName] = true;
                          });
                          setTouched(touchedFields);
                        } else {
                          if (allData.otp_required == true) {
                            let num;
                            for (let i = 0; i < fieldsData.length; i++) {
                              if (fieldsData[i].type == "tel") {
                                num = dataFilled[fieldsData[i].name];
                              }
                            }
                            if (!num) {
                              alert("Number not present");
                            } else {
                              fetch(
                                `http://staging.joshtalks.org:9002/api/skill/v1/forms/otp/${num}/`,
                                {
                                  headers: {
                                    Authorization: IdToken,
                                  },
                                }
                              )
                                .then((res) => res.json())
                                .then((res) => {
                                  console.log(res, IdToken, " checking res");

                                  if (res.message == "opt sent to number") {
                                    setMobNumber(num);
                                    handleOpenModal();
                                  } else {
                                    alert("Error Ocurred, Try again");
                                    setStoreOtp("");
                                    handleCloseModal();
                                  }
                                });
                            }
                          } else {
                            handlePostData(values, setValues);
                          }
                        }
                      }}
                    >
                      Submit
                    </Button>
                  )}

                  <Button
                    style={{
                      textTransform: "none",
                      color: "#E33900",
                    }}
                    variant="text"
                    onClick={handleOpen}
                  >
                    Clear Form
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h5"
                        component="h2"
                        style={{
                          fontWeight: "570",
                        }}
                      >
                        Clear Form
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        This will remove your answers from all questions, and
                        cannot be undone.
                      </Typography>

                      <div
                        style={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                        }}
                      >
                        <Button
                          style={{
                            marginRight: "6%",
                            color: "#5b5b5b",
                            textTransform: "none",
                          }}
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          style={{
                            color: "#5b5b5b",
                            textTransform: "none",
                          }}
                          onClick={handleReset}
                        >
                          Clear Form
                        </Button>
                      </div>
                    </Box>
                  </Modal>
                </div>
              </div>
              <Modals show={showModal} handleClose={handleCloseModal}>
                <div
                  style={{
                    display: "flex",
                    marginTop: "5px",
                   
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Roboto",
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: "16px",
                    }}
                  >
                    Please enter the OTP sent to your mobile number{" "}
                    <span> +91{mobNumber} </span>
                    to verify your identity. This step ensures that only you,
                    the authorized user, can upload sensitive documents.
                  </p>
                  <p
                    style={{
                      paddingTop: "20px",
                    }}
                  >
                    For your security, do not share this OTP with anyone else.
                  </p>
                  <div
                    style={{
                      marginTop: "30px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: widthTotal > 800 ? "95%" : "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={{
                          width: "100%",
                          paddingLeft: "2%",
                          height: "34.58px",

                          background: "#F0F0F0",
                          border: "1px solid #E2E2E2",
                          borderRadius: "4px",
                        }}
                        value={storeOtp}
                        type="text"
                        onChange={(e) => setStoreOtp(e.target.value)}
                        placeholder="OTP"
                      />
                    </div>

                    {inValidOTP ? (
                      <div
                        style={{
                          width: "95%",
                          marginTop: "10px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Button
                          style={{
                            color: "#FF0000",
                            width: "fit-content",
                            height: "21px",
                            fontFamily: "Roboto",
                            fontStyle: "normal",
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: "24px",
                            right: "0px",
                            textTransform: "none",
                          }}
                        >
                          Invalid OTP
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                    {resendOtp ? <div
                      style={{
                        display: "flex",
                        marginTop: "10px",
                        width: "95%",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          color: "#038E00",
                          fontSize: "14px",
                          width: "fit-content",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <CheckCircleIcon style={{ width: "20px" }} />
                        <p style={{ margin: "0px", padding: "0px" }}>
                          OTP resent
                        </p>
                      </div>
                    </div> :""}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      marginTop: "3%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div className="modalBtnDiv">
                      <Button
                        variant="contained"
                        style={{
                          textTransform: "none",
                          backgroundColor: loading ? "white" : "#E33900",
                          width: "200px",
                          fontSize: "13px",
                          height: "36px",
                          border: loading && "none",
                          boxShadow: loading && "none",
                        }}
                        className="firstmodalBtn"
                        onClick={async () => {
                          setResendOtp(false)
                          if (storeOtp.toString().length == 4) {
                            await handlePostData(values, setValues);
                          } else {
                            alert("Otp should be 4 digits");
                          }
                        }}
                      >
                        {loading ? (
                          <CircularProgress size="4vh" />
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>

                      <Button
                        style={
                          inValidOTP
                            ? {
                                textTransform: "none",
                                color: "blue",
                              }
                            : {
                                textTransform: "none",
                                color: "#B3B3B3",
                              }
                        }
                        className="secondModalBtn"
                        disabled={inValidOTP == false ? true : false}
                        onClick={() => {
                           setInvalidOtp(false);
                          setResendOtp(true)
                          
                          if (otpResent) {
                            let num;
                            for (let i = 0; i < fieldsData.length; i++) {
                              if (fieldsData[i].type == "tel") {
                                num = dataFilled[fieldsData[i].name];
                              }
                            }
                            if (!num) {
                              alert("Number not present");
                            } else {
                              let num;
                              for (let i = 0; i < fieldsData.length; i++) {
                                if (fieldsData[i].type == "tel") {
                                  num = dataFilled[fieldsData[i].name];
                                }
                              }
                              if (!num) {
                                alert("Number not present");
                              } else {
                                fetch(
                                  `http://staging.joshtalks.org:9002/api/skill/v1/forms/otp/${num}/`,
                                  {
                                    headers: {
                                      Authorization: IdToken,
                                    },
                                  }
                                )
                                  .then((res) => res.json())
                                  .then((res) => {
                                    console.log(res, IdToken, " checking res");

                                    if (res.message == "opt sent to number") {
                                      setMobNumber(num);
                                      handleOpenModal();
                                    } else {
                                      alert(
                                        "Wrong Number! Write correct 10 digit phone number"
                                      );
                                      localStorage.removeItem("token");
                                      localStorage.removeItem("login");
                                      navigate(
                                        `/scholarship/upsc/submit-form/${id}/login`
                                      );
                                    }
                                  });
                              }
                            }
                          }
                        }}
                      >
                        Resend OTP{" "}
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",

                        textAlign: "left",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Roboto",
                          fontStyle: "normal",
                          fontWeight: 400,
                          fontSize: "12px",
                        }}
                      >
                        By proceeding with the OTP verification, you confirm
                        that you are the intended user and take full
                        responsibility for the authenticity of the documents, to
                        the best of your knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </Modals>
            </div>
          );
        }}
      </Formik>

      {/*       
      <button onClick={handleDropOpenModal}> Hello</button> */}
    </div>
  );
}

export default Name;
