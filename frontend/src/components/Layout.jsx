
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{
                flex: 1,
                maxWidth: '1320px',
                width: '100%',
                margin: '0 auto',
                padding: '28px 24px 36px',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.74)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '22px',
                    boxShadow: 'var(--shadow-sm)',
                }}>
                    {children}
                </div>
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '24px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                borderTop: '1px solid var(--border-subtle)',
            }}>
                &copy; {new Date().getFullYear()} Project Tracker SaaS. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
