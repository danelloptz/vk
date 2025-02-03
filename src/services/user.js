import axios from 'axios';

export async function getUserInfo(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/v1/user/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('в js: ', response)
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
        return false; 
    }
}

export async function getUserInfoLocal() {
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

export async function sendNewSettings(payload) {
    axios.post('https://web.intelektaz.com/api/v2/users/new_user', { payload })
        .then(response => {
            if (response.data.status)
                console.log('Настройки сохранены!')
            else 
                console.log('Что-то не так!')
        })
        .catch(error => {
            console.error("Ошибка при сохранении настроек:", error);
        });
}
