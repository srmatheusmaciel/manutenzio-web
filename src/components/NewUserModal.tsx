import { useState } from 'react';
import { api } from '../services/api';
import { X, Save, Loader2, UserPlus } from 'lucide-react';

interface NewUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewUserModal({ isOpen, onClose }: NewUserModalProps) {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        role: 'FUNCIONARIO'
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSave() {
        if (!formData.nome || !formData.email || !formData.password) {
            return alert('Preencha todos os campos.');
        }

        setLoading(true);
        try {
            await api.post('/usuarios', formData);
            alert('Usuário cadastrado com sucesso!');
            onClose();
            setFormData({ nome: '', email: '', password: '', role: 'FUNCIONARIO' });
        } catch (error) {
            console.error(error);
            alert('Erro ao criar usuário. Verifique se o email já existe.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl bg-gray-900 border border-gray-800 shadow-2xl ring-1 ring-white/10">
                <div className="flex items-center justify-between border-b border-gray-800 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-purple-500"/> Novo Usuário
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Cadastrar acesso ao sistema</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-300">Nome</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-purple-500"
                            value={formData.nome}
                            onChange={e => setFormData({...formData, nome: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Email</label>
                        <input 
                            type="email" 
                            className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-purple-500"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Senha</label>
                        <input 
                            type="password" 
                            className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-purple-500"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Perfil de Acesso</label>
                        <select 
                            className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-purple-500"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="FUNCIONARIO">Funcionário (Mecânico)</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-800 p-6 bg-gray-900/50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md">Cancelar</button>
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-purple-600 px-4 py-2 text-sm font-semibold text-white rounded-md hover:bg-purple-500 disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
    );
}