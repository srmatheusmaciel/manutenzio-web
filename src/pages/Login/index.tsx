import { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Wrench, Loader2 } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/usuarios/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            setError('Credenciais inválidas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 px-4">          
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <div className="rounded-full bg-blue-500/10 p-4 mb-4 ring-1 ring-blue-500/30">
                        <Wrench className="h-10 w-10 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Manutenzio</h1>
                    <p className="mt-2 text-sm text-gray-400">Acesse sua oficina digital</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm py-8 px-4 shadow-2xl ring-1 ring-white/10 sm:rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email corporativo
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-700/50 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all duration-200"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Senha
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 bg-gray-700/50 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-900/30 p-3 ring-1 ring-red-500/50">
                                <p className="text-sm text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                                {loading ? 'Entrando...' : 'Acessar Sistema'}
                            </button>
                        </div>
                    </form>
                </div>
                <p className="text-center text-xs text-gray-500 mt-4">© 2026 Manutenzio. Sistema Seguro.</p>
            </div>
        </div>
    );
}