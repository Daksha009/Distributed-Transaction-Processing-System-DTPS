import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Database, Cpu } from 'lucide-react';

export default function Dashboard() {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetrics = async () => {
        try {
            const response = await axios.get('/api/health');
            setMetrics(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch metrics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="p-4 text-gray-500">Loading metrics...</div>;
    if (error) return <div className="p-4 text-red-500 flex items-center gap-2"><Activity className="w-4 h-4" /> {error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Database Status</p>
                    <p className={`text-lg font-semibold ${metrics?.['db.connection.status'] === 'UP' ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics?.['db.connection.status'] || 'Unknown'}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                    <Cpu className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">JVM Memory Free</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {metrics?.['jvm.memory.free'] ? (metrics['jvm.memory.free'] / 1024 / 1024).toFixed(2) + ' MB' : '-'}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">System Status</p>
                    <p className="text-lg font-semibold text-green-600">Operational</p>
                </div>
            </div>
        </div>
    );
}
