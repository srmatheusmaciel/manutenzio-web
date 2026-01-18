import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { X, Save, Loader2, Pencil } from 'lucide-react';
import type { Carro } from '../types/Carro';

interface EditCarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    carroToEdit: Carro | null;
}

export function EditCarModal({ isOpen, onClose, onSuccess, carroToEdit }: EditCarModalProps) {
    const [formData, setFormData] = useState({
        modelo: '',
        fabricante: '',
        ano: 0,
        cor: '',
        placa: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (carroToEdit) {
            setFormData({
                modelo: carroToEdit.modelo,
                fabricante: carroToEdit.fabricante,
                ano: carroToEdit.ano,
                cor: carroToEdit.cor,
                placa: carroToEdit.placa
            });
        }
    }, [carroToEdit]);

    if (!isOpen || !carroToEdit) return null;

    async function handleUpdate() {
        if (!formData.modelo || !formData.fabricante) return alert('Preencha os campos obrigatórios.');
        
        if (!carroToEdit) return; 

        setLoading(true);
        try {
            await api.put(`/carros/${carroToEdit.id}`, {
                ...formData,
                id: carroToEdit.id,
                status: carroToEdit.status
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar veículo.');
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
                            <Pencil className="h-5 w-5 text-yellow-500"/> Editar Veículo
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Editando: <span className="font-mono text-yellow-500">{formData.placa}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
                </div>

                <div className="p-6 space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm text-gray-300">Modelo</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-yellow-500"
                                value={formData.modelo}
                                onChange={e => setFormData({...formData, modelo: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Ano</label>
                            <input 
                                type="number" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-yellow-500"
                                value={formData.ano}
                                onChange={e => setFormData({...formData, ano: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-300">Fabricante</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-yellow-500"
                                value={formData.fabricante}
                                onChange={e => setFormData({...formData, fabricante: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="text-sm text-gray-300">Cor</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 bg-gray-800 border-gray-700 text-white rounded-md p-2 focus:ring-yellow-500"
                                value={formData.cor}
                                onChange={e => setFormData({...formData, cor: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-800 p-6 bg-gray-900/50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-md">Cancelar</button>
                    <button onClick={handleUpdate} disabled={loading} className="flex items-center gap-2 bg-yellow-600 px-4 py-2 text-sm font-semibold text-white rounded-md hover:bg-yellow-500 disabled:opacity-50">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}