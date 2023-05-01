import React from "react";

function InputBox({ label, name, value, onChange, onBlur, error }) {
  return (
    <div style={{ border: error ? "1px solid red" : "" }}>
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "error" : "noerror"}
      />
      {error && <div className="error-message">Please fill in this field</div>}
    </div>
  );
}

export default InputBox;
