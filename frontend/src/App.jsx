import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import { Wallet } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">DTPS Console</h1>
              <p className="text-sm text-gray-500 font-medium">Distributed Transaction Processing System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              User: dtps-admin
            </span>
          </div>
        </header>

        <Dashboard />

        <main>
          <TransactionForm />
        </main>

        <footer className="mt-12 text-center text-sm text-gray-400">
          <p>© 2026 Distributed Transaction Processing System. All systems operational.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
