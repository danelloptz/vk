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

export async function getGroupInfo() {
    try {
        const response = await axios.get('http://localhost:3000/api/group-info');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении данных группы", error);
        return false; 
    }
}

export async function isSubscribe() {
    try {
        const response = await axios.get('http://localhost:3000/api/is-subscribe');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о подписке", error);
        return false; 
    }
}