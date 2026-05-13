const InputField = ({
  label,
  type = "text",
  placeholder,
  hint,

}) => (
  <div className="mb-5 animate-fade-up">
    
    <label className="mb-1.5 block text-sm font-medium text-black">
      {label}
    </label>

    <input
      type={type}
      placeholder={placeholder}
      className="input-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
    />



    {hint && (
      <p className="mt-1.5 text-xs text-gray-400">
        {hint}
      </p>
    )}
  </div>
);

export default InputField;
