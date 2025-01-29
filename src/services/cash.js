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