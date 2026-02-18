
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

// Simple debounce
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

function Search() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 300);
    const [results, setResults] = useState({ projects: [], tasks: [] });
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setResults({ projects: [], tasks: [] });
            setHasSearched(false);
            return;
        }

        const performSearch = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/search?q=${encodeURIComponent(debouncedQuery)}`);
                setResults(res.data);
                setHasSearched(true);
            } catch (err) {
                console.error(err);
                addToast('Search failed.', 'error');
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery, addToast]);

    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', letterSpacing: '-0.5px' }}>Search</h1>

                <Input
                    placeholder="Search projects or tasks (Cmd+K)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    style={{ fontSize: '16px', padding: '12px' }}
                />

                {loading && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Searching...
                    </div>
                )}

                {!loading && hasSearched && results.projects.length === 0 && results.tasks.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--slate-200)', borderRadius: '8px' }}>
                        No results found for "{query}".
                    </div>
                )}

                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {results.projects.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>Projects</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {results.projects.map(p => (
                                    <Link to={`/projects/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                                        <Card style={{ transition: 'all 0.2s', cursor: 'pointer', border: '1px solid var(--slate-200)' }} hoverable>
                                            <Card.Content style={{ padding: '16px' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--slate-900)' }}>{p.name}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: '4px' }} className="truncate">
                                                    {p.description || 'No description'}
                                                </div>
                                            </Card.Content>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.tasks.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.05em' }}>Tasks</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {results.tasks.map(t => (
                                    // Link to project logic could be better if we could anchor to task, but loading project is fine
                                    <Link to={`/projects/${t.project_id}`} key={t.id} style={{ textDecoration: 'none' }}>
                                        <Card style={{ transition: 'all 0.2s', cursor: 'pointer', border: '1px solid var(--slate-200)' }} hoverable>
                                            <Card.Content style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div style={{ fontWeight: '500', color: 'var(--slate-700)' }}>{t.title}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--slate-400)', marginTop: '2px' }}>
                                                        Priority: <span style={{ textTransform: 'capitalize' }}>{t.priority}</span> • Status: <span style={{ textTransform: 'capitalize' }}>{t.status}</span>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--slate-400)' }}>Go to Project →</div>
                                            </Card.Content>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default Search;
