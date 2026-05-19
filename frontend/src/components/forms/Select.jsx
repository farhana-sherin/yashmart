const Select = ({
  label,
  options = [],
  error,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <select
        className="w-full border rounded-lg px-3 py-2"
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;