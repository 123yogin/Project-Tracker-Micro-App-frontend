
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

function Settings() {
    const { addToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                setUser(res.data);
                setFullName(res.data.full_name || '');
            } catch (err) {
                addToast('Failed to load profile', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [addToast]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/users/me', { full_name: fullName });
            addToast('Profile updated!', 'success');
            // Update local state to reflect saved status if needed
        } catch (err) {
            addToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Layout>Loading...</Layout>;

    if (!user) return <Layout>Error loading profile.</Layout>;

    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' }}>Account Settings</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Manage your personal details and workspace preferences.</p>

                <Card>
                    <Card.Header title="Personal Information" />
                    <Card.Content>
                        <form onSubmit={handleSave}>
                            <Input
                                label="Email Address"
                                value={user.email}
                                disabled
                                helperText="Email cannot be changed currently."
                                style={{ backgroundColor: 'var(--slate-50)', opacity: 0.7 }}
                            />

                            <Input
                                label="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Jane Doe"
                            />

                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
                            </div>
                        </form>
                    </Card.Content>
                </Card>

                {user.last_login && (
                    <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Last login: {new Date(user.last_login).toLocaleString()}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Settings;
