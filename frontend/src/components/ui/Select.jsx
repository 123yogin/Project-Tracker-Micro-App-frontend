
import React from 'react';

const Select = React.forwardRef(({ label, error, helperText, options = [], children, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '16px',
        width: '100%'
    };

    const labelStyle = {
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--slate-700)',
        pointerEvents: 'none'
    };

    const selectStyle = {
        appearance: 'none',
        width: '100%',
        padding: '8px 12px',
        paddingRight: '32px', // Space for arrow
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--slate-300)',
        fontSize: '14px',
        lineHeight: '1.5',
        color: 'var(--slate-900)',
        backgroundColor: '#ffffff',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        outline: 'none',
        boxShadow: 'var(--shadow-sm)',
        fontFamily: 'inherit',
        ...(error ? { borderColor: 'var(--danger-border)', backgroundColor: 'var(--danger-bg)' } : {})
    };

    const focusedStyle = {
        borderColor: 'var(--primary-500)',
        boxShadow: '0 0 0 3px var(--primary-100)',
        ...(error ? { borderColor: 'var(--danger-text)', boxShadow: '0 0 0 1px var(--danger-text)' } : {})
    };

    const messageStyle = {
        fontSize: '12px',
        marginTop: '4px',
        color: error ? 'var(--danger-text)' : 'var(--slate-500)'
    };

    return (
        <div style={containerStyle}>
            {label && <label htmlFor={props.id} style={labelStyle}>{label}</label>}
            <select
                ref={ref}
                style={{ ...selectStyle, ...(isFocused ? focusedStyle : {}) }}
                onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
                {children}
            </select>
            {(error || helperText) && (
                <span style={messageStyle}>{error || helperText}</span>
            )}
        </div>
    );
});

export default Select;
