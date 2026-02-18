
import React from 'react';

const Badge = ({ variant = 'neutral', children }) => {
    const variants = {
        neutral: { bg: 'var(--slate-100)', color: 'var(--slate-600)', border: 'var(--slate-200)' },
        primary: { bg: 'var(--primary-50)', color: 'var(--primary-700)', border: 'var(--primary-200)' },
        success: { bg: 'var(--success-bg)', color: 'var(--success-text)', border: 'var(--success-border)' },
        danger: { bg: 'var(--danger-bg)', color: 'var(--danger-text)', border: 'var(--danger-border)' },
        warning: { bg: '#fffbeb', color: '#92400e', border: '#fcd34d' },
    };

    const style = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        lineHeight: '1.5',
        backgroundColor: variants[variant]?.bg || variants.neutral.bg,
        color: variants[variant]?.color || variants.neutral.color,
        border: `1px solid ${variants[variant]?.border || variants.neutral.border}`,
        whiteSpace: 'nowrap'
    };

    return <span style={style}>{children}</span>;
};

export default Badge;
