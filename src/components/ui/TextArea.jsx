import React from "react";

function TextArea({ label = "", id = "", size = "full", required, helper = null, ...props }) {
  const sizeClass = size === "fit" ? "w-fit" : "w-full";

  return (
    <div className="relative z-0 my-1">
      <textarea
        wrap="soft"
        id={id}
        className={
          "block  rounded px-2.5 pb-2.5 pt-5 min-h-12 text-sm text-slate-900 bg-slate-50  border border-slate-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-50 disabled:cursor-not-allowed " +
          sizeClass
        }
        {...props}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute text-sm text-slate-500  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-4"
      >
        {required && <span className="mr-1 text-red-500">*</span>}
        {label}
      </label>
      {helper && <p className="text-slate-500 px-2 mt-1 text-xs">{helper}</p>}
    </div>
  );
}

export default TextArea;
