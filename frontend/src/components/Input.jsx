import { forwardRef } from "react";

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = "", 
  containerClassName = "",
  type = "text",
  ...props 
}, ref) => {
  return (
    <div className={`input-group ${containerClassName}`}>
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`input-field ${error ? "border-red-500 focus:border-red-500" : ""} ${className}`}
          placeholder=" "
          {...props}
        />
        {label && <label className="input-label">{label}</label>}
        
        {Icon && (
            <div className="absolute right-3 top-3 text-slate-400">
                <Icon size={20} />
            </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1 font-medium animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
