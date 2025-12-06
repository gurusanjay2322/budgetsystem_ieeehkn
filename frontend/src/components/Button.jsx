import { Loader2 } from "lucide-react";

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  isLoading = false,
  icon: Icon,
  disabled,
  ...props 
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary", 
    ghost: "btn-ghost",
    danger: "btn-danger"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-6 py-3",
    icon: "p-2 aspect-square"
  };

  return (
    <button 
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin mr-2" size={18} />
      ) : Icon ? (
        <Icon className="mr-2" size={18} />
      ) : null}
      
      {children}
    </button>
  );
}
