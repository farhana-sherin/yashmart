import React from "react";

const Input = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <input
        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        {...props}
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;