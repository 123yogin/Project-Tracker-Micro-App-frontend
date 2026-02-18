
import React from 'react';

const Input = React.forwardRef(({ label, error, helperText, ...props }, ref) => {
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

    const inputStyle = {
        appearance: 'none',
        width: '100%',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--slate-300)',
        fontSize: '14px',
        lineHeight: '1.5',
        color: 'var(--slate-900)',
        backgroundColor: '#ffffff',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        outline: 'none',
        boxShadow: 'var(--shadow-sm)',
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
            <input
                ref={ref}
                style={{ ...inputStyle, ...(isFocused ? focusedStyle : {}) }}
                onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
                onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
                {...props}
            />
            {(error || helperText) && (
                <span style={messageStyle}>{error || helperText}</span>
            )}
        </div>
    );
});

export default Input;
