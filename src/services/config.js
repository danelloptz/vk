import axios from 'axios';

export async function getConfig(key, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/v1/config', {
            params: {
                key: key
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data;
    } catch(error) {
        console.error("Ошибка при получении конфигов", error);
        return false; 
    }
}