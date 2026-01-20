export function getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.role || null;
    } catch (error) {
        console.error("Erro ao decodificar token", error);
        return null;
    }
}