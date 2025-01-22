import axios from 'axios';

export async function getAdds(len) {
    try {
        const response = await axios.post('http://localhost:3000/api/get-add', { len: len });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении рекламы", error);
        return false; 
    }
}