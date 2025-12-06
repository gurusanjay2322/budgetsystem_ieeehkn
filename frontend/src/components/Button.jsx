import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    type = 'button',
    onClick,
    disabled = false,
    loading = false,
    ...props
}) => {
    const baseStyles = "btn";

    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-600 hover:shadow-lg hover:shadow-red-500/30",
        ghost: "text-slate-700 hover:bg-slate-100 shadow-none hover:shadow-sm",
        success: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-600 hover:shadow-lg hover:shadow-green-500/30"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''} ${className} relative overflow-hidden group`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {/* Ripple effect overlay */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {children}
            </span>
        </button>
    );
};

export default Button;
