import { useState } from 'react';
import { api } from '../services/api';
import { X, Save, Loader2 } from 'lucide-react';

interface NewOSModalProps {
    placa: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NewOSModal({ placa, isOpen, onClose, onSuccess }: NewOSModalProps) {
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSave() {
        if (!descricao.trim()) return alert('Informe a descrição do problema.');

        setLoading(true);
        try {
            await api.post('/ordens-servico', {
                placa,
                descricao
            });
            onSuccess();
            onClose();
            setDescricao('');
        } catch (error) {
            console.error(error);
            alert('Erro ao abrir OS. Verifique se o carro já não está em manutenção.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-800 shadow-2xl ring-1 ring-white/10">
                
                <div className="flex items-center justify-between border-b border-gray-800 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Nova Ordem de Serviço</h2>
                        <p className="text-sm text-gray-400 mt-1">Veículo: <span className="text-blue-400 font-mono">{placa}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Descrição do Problema
                        </label>
                        <textarea
                            rows={4}
                            className="block w-full rounded-md border-0 bg-gray-800 p-3 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 resize-none"
                            placeholder="Ex: Cliente relata barulho na suspensão ao frear..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-800 p-6 bg-gray-900/50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Abrir OS
                    </button>
                </div>
            </div>
        </div>
    );
}