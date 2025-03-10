import axios from 'axios';

export async function sendBrief(payload, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/brif/create', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch(error) {
        console.error("Ошибка при отправке брифа", error);
        return false; 
    }
}