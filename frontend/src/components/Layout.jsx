
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{
                flex: 1,
                maxWidth: '1280px',
                width: '100%',
                margin: '0 auto',
                padding: '32px 24px'
            }}>
                {children}
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '24px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                borderTop: '1px solid var(--border-subtle)'
            }}>
                &copy; {new Date().getFullYear()} Project Tracker SaaS. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
