import React, { forwardRef } from "react";

const Input = forwardRef(({ label, type = "text", ...props }, ref) => {
  const id = props.id || Math.random().toString(36).substr(2, 9);

  return (
    <>
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      <input type={type} ref={ref} className={`input`} id={id} {...props} />
    </>
  );
});

export default Input;
