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


export async function getTransactions(offset, limit, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/v1/user/transactions', { 
            params: { 
                offset: offset,
                limit: limit
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о транзакциях", error);
        return false; 
    }
}