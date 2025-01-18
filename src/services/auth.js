import axios from 'axios';

export async function checkUserAuthorization() {
    try {
        const response = await axios.get('http://localhost:3000/api/check-auth');
        return response.data.isAuthorized;
    } catch (error) {
        console.error("Ошибка при проверке авторизации", error);
        return false; 
    }
}

export async function silentTokenBack(secret_token) {
    try {
        const response = await axios.post('http://localhost:3000/api/vk', {
            token: secret_token
        })
        return response.data
    }  catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        throw error;
    }
    
}

// здесь тоже пути запросов менять