import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { X, CheckCircle, Loader2, Calendar, FileText } from 'lucide-react';

interface FinishOSModalProps {
    placa: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface OrdemServico {
    id: number;
    descricaoProblema: string;
    dataAbertura: string;
    status: string;
}

export function FinishOSModal({ placa, isOpen, onClose, onSuccess }: FinishOSModalProps) {
    const [os, setOs] = useState<OrdemServico | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (isOpen && placa) {
            setFetching(true);
            api.get(`/ordens-servico/aberta/${placa}`)
                .then(response => setOs(response.data))
                .catch(err => {
                    console.error(err);
                    alert("Erro ao buscar dados da OS.");
                    onClose();
                })
                .finally(() => setFetching(false));
        } else {
            setOs(null);
        }
    }, [isOpen, placa]);

    if (!isOpen) return null;

    async function handleFinish() {
        if (!os) return;
        setLoading(true);
        try {
            await api.post(`/ordens-servico/${os.id}/finalizar`);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao finalizar serviço.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl bg-gray-900 border border-gray-800 shadow-2xl ring-1 ring-white/10">
                
                <div className="flex items-center justify-between border-b border-gray-800 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Finalizar Serviço</h2>
                        <p className="text-sm text-gray-400 mt-1">Veículo: <span className="text-yellow-400 font-mono">{placa}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {fetching ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : os ? (
                        <div className="space-y-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                                    <FileText className="h-4 w-4" /> Descrição do Problema
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">{os.descricaoProblema}</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar className="h-4 w-4" />
                                <span>Aberto em: {new Date(os.dataAbertura).toLocaleString()}</span>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleFinish}
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 transition-all"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                                    Concluir Manutenção e Liberar Carro
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-red-400">Dados da OS não encontrados.</p>
                    )}
                </div>
            </div>
        </div>
    );
}