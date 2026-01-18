export interface Carro {
    id: number;
    placa: string;
    modelo: string;
    fabricante: string;
    ano: number;
    cor: string;
    status: 'DISPONIVEL' | 'EM_MANUTENCAO' | 'INATIVO';
}