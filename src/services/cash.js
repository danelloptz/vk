import axios from 'axios';

export async function checkTxid(txid) {
    try {
        const response = await axios.post('http://localhost:3000/api/txid-check', {
            "txid": txid
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке TxID", error);
        return false; 
    }
}

export async function getHistory() {
    try {
        const response = await axios.get('http://localhost:3000/api/history-trans');
        return response.data.history;
    } catch (error) {
        console.error("Ошибка при получении истории транзакций", error);
        return false; 
    }
}