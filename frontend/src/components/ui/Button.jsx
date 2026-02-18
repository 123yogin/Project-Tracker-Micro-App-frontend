
import React from 'react';

const Button = React.forwardRef(({
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    children,
    ...props
}, ref) => {

    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        lineHeight: '1',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        borderRadius: 'var(--radius-md)',
        cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: loading || props.disabled ? '0.6' : '1',
        border: '1px solid transparent',
        transition: 'background 0.1s, box-shadow 0.1s, transform 0.05s',
        outline: 'none',
        textDecoration: 'none',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        position: 'relative'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-600)',
            color: '#ffffff',
            border: '1px solid var(--primary-700)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        },
        primaryHover: {
            backgroundColor: 'var(--primary-700)'
        },
        secondary: {
            backgroundColor: '#ffffff',
            color: 'var(--slate-700)',
            border: '1px solid var(--slate-300)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        },
        secondaryHover: {
            backgroundColor: 'var(--slate-50)',
            color: 'var(--slate-800)'
        },
        destructive: {
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger-text)',
            border: '1px solid var(--danger-border)'
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--slate-600)',
            border: '1px solid var(--slate-300)'
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--slate-600)',
            border: '1px solid transparent'
        }
    };

    const sizes = {
        sm: { padding: '6px 12px', fontSize: '13px', height: '32px' },
        md: { padding: '8px 16px', fontSize: '14px', height: '38px' },
        lg: { padding: '10px 24px', fontSize: '16px', height: '44px' }
    };

    // Generate complete style object
    const computedStyle = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        ...(props.style || {})
    };

    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <button
            ref={ref}
            style={{
                ...computedStyle,
                ...(isHovered && !loading && !props.disabled ? variants[`${variant}Hover`] || { opacity: 0.9 } : {})
            }}
            disabled={loading || props.disabled}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {loading && (
                <span
                    style={{
                        marginRight: '8px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        border: '2px solid currentColor',
                        borderRightColor: 'transparent',
                        display: 'inline-block',
                        animation: 'spin 0.75s linear infinite'
                    }}
                />
            )}
            {children}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </button>
    );
});

export default Button;
