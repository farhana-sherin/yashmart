const Textarea = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
      </label>

      <textarea
        className="w-full border rounded-lg px-3 py-2"
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

export default Textarea;