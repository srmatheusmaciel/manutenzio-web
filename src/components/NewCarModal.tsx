import { useState } from 'react';
import { api } from '../services/api';
import { X, Save, Loader2, Car } from 'lucide-react';

interface NewCarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function NewCarModal({ isOpen, onClose, onSuccess }: NewCarModalProps) {
    const [formData, setFormData] = useState({
        placa: '',
        modelo: '',
        fabricante: '',
        ano: new Date().getFullYear(),
        cor: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSave() {
        if (!formData.placa || !formData.modelo) return alert('Preencha os campos obrigatórios.');

        setLoading(true);
        try {
            await api.post('/carros', formData);
            onSuccess();
            onClose();
            setFormData({ placa: '', modelo: '', fabricante: '', ano: new Date().getFullYear(), cor: '' });
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar carro. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-800 shadow-2xl ring-1 ring-white/10">
                <div className="flex items-center justify-between border-b border-gray-800 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Car className="h-5 w-5 text-blue-500"/> Novo Veículo
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Cadastre um novo carro na frota</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-300">Placa</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-blue-500 uppercase"
                                placeholder="ABC-1234"
                                value={formData.placa}
                                onChange={e => setFormData({...formData, placa: e.target.value.toUpperCase()})}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Ano</label>
                            <input 
                                type="number" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-blue-500"
                                value={formData.ano}
                                onChange={e => setFormData({...formData, ano: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-300">Modelo</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-blue-500"
                                placeholder="Ex: Fiesta"
                                value={formData.modelo}
                                onChange={e => setFormData({...formData, modelo: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Fabricante</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-blue-500"
                                placeholder="Ex: Ford"
                                value={formData.fabricante}
                                onChange={e => setFormData({...formData, fabricante: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-300">Cor</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-blue-500"
                            placeholder="Ex: Prata"
                            value={formData.cor}
                            onChange={e => setFormData({...formData, cor: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-800 p-6 bg-gray-900/50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md">Cancelar</button>
                    <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm font-semibold text-white rounded-md hover:bg-blue-500 disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Carro
                    </button>
                </div>
            </div>
        </div>
    );
}