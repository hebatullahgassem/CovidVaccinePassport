import React, { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import useInput from "../hooks/use-input";
import isVacinatedImg from "../images/vaccinated.jpeg";
import isNotVacinatedImg from "../images/notvaccinated.jpeg";
import { useAlert } from "react-alert";

export const Dashboard = () => {
  const alert = useAlert();
  const [src, setSrc] = useState("");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formIsShowen, setFormIsShown] = useState(false);
  const [secondDose, setSecondDose] = useState("");
  const [thirdDose, setThirdDose] = useState("");

  const { currentUser } = useAuth();
  const qr = useCallback(() => {
    QRCode.toDataURL(
      `
        ${
          userData.isVaccinated
            ? `
        - Vacinated: ${userData.isVaccinated ? "Yes" : "No"}
        - Email: ${userData.email}
        - Name: ${userData.fullName}
        - National Id: ${userData.nationalId}
        - Gender: ${userData.gender}
        - Birth Date  : ${userData.birthDate}
        - Vacine : ${userData.vacine || "not provided"}
        - First Dose  : ${userData.firstDose || "not provided"}
        - Second Dose  : ${userData.secondDose || "not provided"}
        - Third Dose  : ${userData.thirdDose || "not provided"}`
            : `Not Valid (Not Vaccinated)`
        }
  
      `
    ).then((data) => {
      setSrc(data);
    });
  }, [
    userData.birthDate,
    userData.email,
    userData.firstDose,
    userData.fullName,
    userData.gender,
    userData.isVaccinated,
    userData.nationalId,
    userData.secondDose,
    userData.thirdDose,
    userData.vacine,
  ]);

  const getUserData = useCallback(() => {
    var docRef = db.collection("users").doc(currentUser.uid);
    setIsLoading(true);
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setUserData(doc.data());
        setIsLoading(false);
      } else {
        setUserData({});
        setIsLoading(false);
      }
    });
  }, [currentUser.uid]);

  useEffect(() => {
    getUserData();
    qr();
  }, [getUserData, qr]);

  function handleVacFormApperance() {
    setFormIsShown((prevState) => !prevState);
  }

  const isNotEmpty = (value) => value.trim() !== "";

  const {
    value: vacineValue,
    isValid: vacineIsValid,
    hasError: vacineHasError,
    valueChangeHandler: vacineChangeHandler,
    InputBlurHandler: vacineBLurHandler,
  } = useInput(isNotEmpty);

  const {
    value: firstDoseValue,
    isValid: firstDoseIsValid,
    hasError: firstDoseHasError,
    valueChangeHandler: firstDoseChangeHandler,
    InputBlurHandler: firstDoseBLurHandler,
    reset: restFirstDose,
  } = useInput(isNotEmpty);

  let formIsValid = false;
  if (firstDoseIsValid && vacineIsValid) {
    formIsValid = true;
  }

  const calculateDate = useCallback(() => {
    if (firstDoseValue) {
      let firstDoseDate = new Date(firstDoseValue);
      const yyyy = firstDoseDate.getFullYear();
      let mmSecondDose = firstDoseDate.getMonth() + 2; // Months start at 0!
      let mmThirdDose = firstDoseDate.getMonth() + 3; // Months start at 0!
      let dd = firstDoseDate.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mmSecondDose < 10) mmSecondDose = "0" + mmSecondDose;
      if (mmThirdDose < 10) mmThirdDose = "0" + mmThirdDose;

      const secondDoseDate = yyyy + "-" + mmSecondDose + "-" + dd;
      const thirdDoseDate = yyyy + "-" + mmThirdDose + "-" + dd;

      setSecondDose(secondDoseDate);
      setThirdDose(thirdDoseDate);
    }
    // console.log(date.toLocaleDateString());
  }, [firstDoseValue]);

  useEffect(() => {
    calculateDate();
  }, [calculateDate]);

  const submitHandler = async (event) => {
    event.preventDefault();

    db.collection("users")
      .doc(currentUser.uid)
      .set(
        {
          vacine: vacineValue,
          isReserved: true,
          firstDose: firstDoseValue,
          secondDose,
          thirdDose,
        },
        { merge: true }
      )
      .then((d) => {
        alert.show("Vaccine First dose setted succesfully !", {
          type: "success",
        });
        console.log(d);
      }).catch(err=>console.log(err))
  };

  // console.log(userData);
  return (
    <>
      {!isLoading && (
        <div style={{ width: "45rem" }}>
          <div className="w-50 m-auto">
            <img src={src} alt="qrcode" className="w-100 " />
          </div>
          <div className="card mt-3 fw-bold" style={{ width: "100%" }}>
            <h2 className="card-header text-secondary">Your Infomation</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                Email :
                <span className="d-inline-block ms-2 text-primary">
                  {userData.email}
                </span>
              </li>
              <li className="list-group-item">
                Full Name :
                <span className="d-inline-block ms-2 text-primary">
                  {userData.fullName}
                </span>
              </li>
              <li className="list-group-item">
                Birth Date:
                <span className="d-inline-block ms-2 text-primary">
                  {userData.birthDate}
                </span>
              </li>
              <li className="list-group-item">
                Gender :
                <span className="d-inline-block ms-2 text-primary">
                  {userData.gender}
                </span>
              </li>
              <li className="list-group-item">
                National Id :
                <span className="d-inline-block ms-2 text-primary">
                  {userData.nationalId}
                </span>
              </li>

              {userData.isReserved && (
                <>
                  <li className="list-group-item">
                    Vaccine :
                    <span className="d-inline-block ms-2 text-primary">
                      {userData.vacine || "not provided"}
                    </span>
                  </li>

                  <li className="list-group-item">
                    First Dose :
                    <span className="d-inline-block ms-2 text-primary">
                      {userData.firstDose || "not provided"}
                    </span>
                  </li>

                  <li className="list-group-item">
                    Second Dose:
                    <span className="d-inline-block ms-2 text-primary">
                      {userData.secondDose || "not provided"}
                    </span>
                  </li>
                  <li className="list-group-item">
                    Third Dose :
                    <span className="d-inline-block ms-2 text-primary">
                      {userData.thirdDose || "not provided"}
                    </span>
                  </li>
                </>
              )}
              {userData.isVaccinated && (
                <li className="list-group-item">
                  <img src={isVacinatedImg} alt={isVacinatedImg} />
                </li>
              )}
              {!userData.isVaccinated && (
                <li className="list-group-item">
                  <img src={isNotVacinatedImg} alt={isNotVacinatedImg} />
                </li>
              )}
              {!userData.isReserved && !userData.isVaccinated && (
                <li className="list-group-item">
                  <button
                    className="btn btn-danger"
                    onClick={handleVacFormApperance}
                  >
                    Set Vacination Date
                  </button>
                </li>
              )}
              {!userData.isReserved && formIsShowen && (
                <div className="card">
                  <div className="card-body">
                    <h2 className="text-danger">Vacine Info</h2>
                    <form onSubmit={submitHandler}>
                      <div className="mb-3">
                        <label htmlFor="Vaccine" className="form-label">
                          Vaccine
                        </label>
                        <select
                          className="form-select"
                          onChange={vacineChangeHandler}
                          onBlur={vacineBLurHandler}
                          value={vacineValue}
                        >
                          <option value="">-- Select Vaccine --</option>
                          <option>Johnson</option>
                          <option>Astrazinca</option>
                          <option>Pfizer</option>
                          <option>Sinopharm </option>
                          <option>Covaxin</option>
                        </select>
                        {vacineHasError && (
                          <div className="form-text fw-bold text-danger">
                            Please select vacine
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="firstDose" className="form-label">
                          First Dose
                        </label>
                        <input
                          type="date"
                          className="form-control invalid"
                          id="firstDose"
                          onChange={firstDoseChangeHandler}
                          onBlur={firstDoseBLurHandler}
                        />
                        {firstDoseHasError && (
                          <div className="form-text fw-bold text-danger">
                            Please select First Dose Date
                          </div>
                        )}
                      </div>
                      <button
                        className="btn btn-primary"
                        disabled={!formIsValid}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
      {isLoading && (
        <div
          className="spinner-grow text-light d-flex justify-content-center"
          role="status"
          style={{ width: "218px", height: "218px" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </>
  );
};
