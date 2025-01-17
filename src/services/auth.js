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
