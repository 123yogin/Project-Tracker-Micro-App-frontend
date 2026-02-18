
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        style={{
                            minWidth: '250px',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#ffffff',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border-subtle)',
                            borderLeft: `4px solid ${toast.type === 'error' ? 'var(--danger-text)' :
                                    toast.type === 'success' ? 'var(--success-text)' :
                                        'var(--primary-600)'
                                }`,
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
