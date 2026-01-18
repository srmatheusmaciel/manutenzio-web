import { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/usuarios/login', {
                email,
                password
            });

            const { token } = response.data;

            localStorage.setItem('token', token);
            alert('Login realizado com sucesso! Token salvo.');
            
        } catch (err) {
            console.error(err);
            setError('Falha no login. Verifique suas credenciais.');
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1>Manutenzio 🔧</h1>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                <input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Sua senha" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}