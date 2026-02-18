
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    const style = {
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        ...props.style
    };

    return (
        <div className={`card-root ${className}`} style={style}>
            {children}
        </div>
    );
};

const CardHeader = ({ title, description, children }) => {
    const style = {
        padding: '20px 24px',
        borderBottom: children ? '1px solid var(--slate-100)' : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    return (
        <div style={style}>
            <div>
                {title && <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--slate-900)' }}>{title}</h3>}
                {description && <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{description}</p>}
            </div>
            {children && <div>{children}</div>}
        </div>
    );
};

const CardContent = ({ children, padding = '24px' }) => {
    return <div style={{ padding }}>{children}</div>;
};

const CardFooter = ({ children }) => {
    const style = {
        padding: '16px 24px',
        borderTop: '1px solid var(--slate-100)',
        backgroundColor: 'var(--slate-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '12px'
    };
    return <div style={style}>{children}</div>;
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
