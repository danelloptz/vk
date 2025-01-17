import axios from 'axios';

export async function getUserInfo() {
    try {
        const response = await axios.get('http://localhost:3000/api/user-info');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
        return false; 
    }
}

export async function getReferInfo() {
    try {
        const response = await axios.get('http://localhost:3000/api/refer-info');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
        return false; 
    }
}