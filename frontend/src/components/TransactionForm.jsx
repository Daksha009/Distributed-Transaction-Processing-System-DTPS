import { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function TransactionForm() {
    const [formData, setFormData] = useState({
        sender: '',
        receiver: '',
        amount: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [receipt, setReceipt] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        setReceipt(null);

        try {
            const response = await axios.post('/api/tx', formData);
            setReceipt(response.data);
            setStatus('success');
            setFormData({ sender: '', receiver: '', amount: '' }); // Reset form
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Transaction failed. Please check inputs.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Send className="w-5 h-5 text-indigo-600" />
                        New Transaction
                    </h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From (Sender)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="e.g. Alice"
                                    value={formData.sender}
                                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To (Receiver)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="e.g. Bob"
                                    value={formData.receiver}
                                    onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg font-mono"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Process Transaction
                                    <Send className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {status === 'error' && (
                        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 border border-red-100">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold">Transaction Failed</p>
                                <p className="text-sm mt-1 opacity-90">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && receipt && (
                        <div className="mt-6 p-6 bg-green-50 text-green-800 rounded-xl border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <h3 className="font-semibold text-lg text-green-900">Transaction Successful</h3>
                            </div>

                            <div className="bg-white/60 p-4 rounded-lg space-y-2 text-sm font-mono border border-green-100/50">
                                <div className="flex justify-between">
                                    <span className="text-green-700/70">Transaction ID:</span>
                                    <span className="font-semibold truncate max-w-[200px]">{receipt.id}</span>
                                </div>
                                <div className="flex justify-between border-t border-green-100/30 pt-2">
                                    <span className="text-green-700/70">Amount:</span>
                                    <span className="font-bold text-lg">${receipt.amount}</span>
                                </div>
                                <div className="flex justify-between border-t border-green-100/30 pt-2">
                                    <span className="text-green-700/70">Receipt URL:</span>
                                    <a href="#" className="underline truncate max-w-[200px]" title={receipt.receiptUrl}>{receipt.receiptUrl}</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
