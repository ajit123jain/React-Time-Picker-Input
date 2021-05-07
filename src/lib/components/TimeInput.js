import React, { useEffect, useState,useRef } from "react";
import InputTimeHelper from "./InputTimeHelper";
import AmPmInputHelper from "./AmPmInputHelper";
import { doubleChar } from "./actions";
import "./TimeInput.css"

function TimeInput(props) {
  const { hour12Format, value, onChange, allowDelete } = props;
  const getPartsByDate = () => {
    const hourByProp = (value || "").toString().trim().substring(0, 2);
    const minuteByProp = (value || "").toString().trim().substring(3, 5);
    const editHourByFormat = hour12Format ? (hourByProp < 12 ? hourByProp : hourByProp - 12) : hourByProp;
    return {
      hour: editHourByFormat,
      minute: minuteByProp,
      amPm: hourByProp < 12 ? "AM" : "PM",
    };
  };

  const dateParts = getPartsByDate();
  const [hour, setHour] = useState(dateParts.hour);
  const [minute, setMinutes] = useState(dateParts.minute);
  const [amPm, setAmPM] = useState(dateParts.amPm);
   const hourRef=useRef(null);
  const minuteRef=useRef(null);
  const amPmRef=useRef(null);

  const hourRange = hour12Format ? { start: 1, end: 12 } : { start: 0, end: 23 };
  const focusElementByRef = (ref) =>{
    ref.current && ref.current.focus();
  }
  const toggleAmPm = () => setAmPM(amPm === "AM" ? "PM" : "AM");
  useEffect(() => {
    if (hour !== "" && minute !== "") {
      let hour24Format = !hour12Format && doubleChar(hour);
      let hour12Am = amPm === "AM" && hour === "12" && "00";
      const calculateHour = parseInt(hour) + (amPm === "PM" && hour !== "12" ? 12 : 0);
      let dateString24 = doubleChar((hour24Format || hour12Am || calculateHour).toString() )+ ":" + minute;
      let hour24 = dateString24.substring(0, 2);
      let hour12 = doubleChar(parseInt(hour24) < 12 ? hour24 : parseInt(hour24) - 12);
      let amPmString = parseInt(hour24) < 12 ? "AM" : "PM";
      onChange(dateString24);
    }
  }, [hour, minute, amPm]);

  useEffect(() => {
    const dateParts = getPartsByDate();
    setHour(dateParts.hour);
    setMinutes(dateParts.minute);
    setAmPM(dateParts.amPm);
  }, [value]);

  return (
    <div className="App">
      <div className="react-time-input-picker">
        <InputTimeHelper
          inputRef={hourRef} 
          id="react-time-input-picker__hourInput"
          value={hour}
          placeholder="- -"
          setValue={setHour}
          allowDelete={allowDelete}
          moveNext={() => focusElementByRef(minuteRef)}
          range={hourRange}
          toggleAmPm={toggleAmPm}
        />
        <span>:</span>
        <InputTimeHelper
          inputRef={minuteRef} 
          id="react-time-input-picker__minuteInput"
          value={minute}
          placeholder="- -"
          setValue={setMinutes}
          allowDelete={allowDelete}
          moveNext={hour12Format && (() =>focusElementByRef(amPmRef))}
          movePrev={() => focusElementByRef(hourRef)}
          range={{ start: 0, end: 59 }}
        />
        {hour12Format && (
          <AmPmInputHelper
            inputRef={amPmRef} 
            amPm={amPm}
            focusMinuteInput={() => focusElementByRef(minuteRef)}
            toggleAmPm={toggleAmPm}
            setAmPM={(amPm) => setAmPM(amPm)}
          />
        )}
      </div>
    </div>
  );
}

export default TimeInput;