import React from 'react';

const Input = ({
    label,
    type = 'text',
    id,
    name,
    value,
    onChange,
    placeholder,
    error,
    className = '',
    required = false,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label htmlFor={id || name} className="text-sm font-medium text-hkn-navy">
                    {label} {required && <span className="text-hkn-red">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id || name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-field ${error ? 'border-hkn-red focus:border-hkn-red focus:ring-red-100' : ''}`}
                required={required}
                {...props}
            />
            {error && <span className="text-xs text-hkn-red">{error}</span>}
        </div>
    );
};

export default Input;
