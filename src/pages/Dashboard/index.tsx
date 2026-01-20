/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Carro } from '../../types/Carro';
import { useNavigate } from 'react-router-dom';
import { LogOut, CarFront, Wrench, Search, PlusCircle, AlertCircle, Trash2, Pencil } from 'lucide-react';
import { NewOSModal } from '../../components/NewOSModal';
import { FinishOSModal } from '../../components/FinishOSModal';
import { NewCarModal } from '../../components/NewCarModal';
import { EditCarModal } from '../../components/EditCarModal';
import { getUserRole } from '../../utils/auth';

export function Dashboard() {
    const [carros, setCarros] = useState<Carro[]>([]);
    
    const [modalOpen, setModalOpen] = useState(false);
    const [finishModalOpen, setFinishModalOpen] = useState(false);
    const [newCarModalOpen, setNewCarModalOpen] = useState(false);
    const [editCarModalOpen, setEditCarModalOpen] = useState(false);
    
    const [selectedPlaca, setSelectedPlaca] = useState('');
    const [carroToEdit, setCarroToEdit] = useState<Carro | null>(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    async function loadCarros(query: string = '') {
        try {
            const params = query ? { params: { placa: query } } : {};
            const response = await api.get('/carros', params);
            setCarros(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const userRole = getUserRole();

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/');
    }

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const text = e.target.value;
        setSearchTerm(text);
        loadCarros(text);
    }

    function handleOpenOS(placa: string) {
        setSelectedPlaca(placa);
        setModalOpen(true);
    }

    function handleFinishOS(placa: string) {
        setSelectedPlaca(placa);
        setFinishModalOpen(true);
    }

    function handleEditCar(carro: Carro) {
        setCarroToEdit(carro);
        setEditCarModalOpen(true);
    }

    async function handleDeleteCar(id: number, placa: string) {
        const confirm = window.confirm(`Tem certeza que deseja excluir o veículo ${placa}? Essa ação não pode ser desfeita.`);
        
        if (confirm) {
            try {
                await api.delete(`/carros/${id}`);
                alert('Veículo excluído com sucesso!');
                loadCarros(searchTerm);
            } catch (error) {
                console.error(error);
                alert('Erro ao excluir. Verifique se existem OS abertas para este carro.');
            }
        }
    }

    useEffect(() => {
        loadCarros();
    }, []);

    const getStatusBadge = (status: string) => {
        const styles = {
            'DISPONIVEL': 'bg-green-900/30 text-green-400 ring-green-500/30',
            'EM_MANUTENCAO': 'bg-yellow-900/30 text-yellow-400 ring-yellow-500/30',
            'INATIVO': 'bg-red-900/30 text-red-400 ring-red-500/30'
        }[status] || 'bg-gray-700 text-gray-300 ring-gray-500/30';

        const formattedStatus = status.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

        return (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles}`}>
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${styles.replace('/30', '')} bg-current opacity-80`}></span>
                {formattedStatus}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950">
            <NewOSModal 
                isOpen={modalOpen} 
                placa={selectedPlaca} 
                onClose={() => setModalOpen(false)} 
                onSuccess={() => loadCarros(searchTerm)} 
            />
            <FinishOSModal
                isOpen={finishModalOpen}
                placa={selectedPlaca}
                onClose={() => setFinishModalOpen(false)}
                onSuccess={() => loadCarros(searchTerm)}
            />

            <NewCarModal
                isOpen={newCarModalOpen}
                onClose={() => setNewCarModalOpen(false)}
                onSuccess={() => loadCarros(searchTerm)}
            />
            <EditCarModal 
                isOpen={editCarModalOpen}
                carroToEdit={carroToEdit}
                onClose={() => setEditCarModalOpen(false)}
                onSuccess={() => loadCarros(searchTerm)}
            />

            <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/10 p-2 rounded-lg ring-1 ring-blue-500/20">
                                <Wrench className="h-6 w-6 text-blue-400" />
                            </div>
                            <span className="text-lg font-semibold text-white tracking-wide">Manutenzio</span>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Sair
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between mb-6">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-3">
                            <CarFront className="h-7 w-7 text-gray-400" />
                            Frota da Oficina
                        </h2>
                    </div>
                    <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
                         <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 bg-gray-800 py-1.5 pl-10 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                                placeholder="Buscar por placa..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <button 
                            onClick={() => setNewCarModalOpen(true)}
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all"
                        >
                            Novo Carro
                        </button>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden ring-1 ring-white/5">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Placa</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Veículo</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Manutenção</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Gerenciar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 bg-gray-900">
                                {carros.map(carro => (
                                    <tr key={carro.id} className="hover:bg-gray-800/40 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-white font-mono tracking-wider">{carro.placa}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-200">{carro.modelo}</span>
                                                <span className="text-xs text-gray-500">{carro.fabricante} • {carro.ano} • {carro.cor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(carro.status)}</td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {carro.status === 'DISPONIVEL' ? (
                                                <button 
                                                    onClick={() => handleOpenOS(carro.placa)}
                                                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-md transition-all border border-blue-500/20"
                                                >
                                                    <PlusCircle className="h-4 w-4" />
                                                    Abrir OS
                                                </button>
                                            ) : carro.status === 'EM_MANUTENCAO' ? (
                                                <button 
                                                    onClick={() => handleFinishOS(carro.placa)}
                                                    className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 bg-yellow-500/10 hover:bg-yellow-500/20 px-3 py-1.5 rounded-md transition-all border border-yellow-500/20 cursor-pointer"
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                    Finalizar
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-gray-500 cursor-not-allowed opacity-50 px-3 py-1.5">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Inativo
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditCar(carro)}
                                                    className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-full transition-colors"
                                                    title="Editar Veículo"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                
                                                {userRole === 'ADMIN' && (
                                                    <button 
                                                        onClick={() => handleDeleteCar(carro.id, carro.placa)}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                                        title="Excluir Veículo"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                                
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}