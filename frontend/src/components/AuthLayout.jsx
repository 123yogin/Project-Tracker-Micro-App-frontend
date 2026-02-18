
import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
        }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-600)', textDecoration: 'none' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', color: 'var(--slate-900)' }}>
                        SaaS Tracker
                    </span>
                </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '400px' }}>
                {children}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                &copy; {new Date().getFullYear()} SaaS Tracker Inc.
            </div>
        </div>
    );
};

export default AuthLayout;
