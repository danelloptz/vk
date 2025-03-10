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

export async function sendNewSettings(payload, token) {
    try {
        const response = await axios.patch('https://web.intelektaz.com/api/v1/user', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch(error) {
        console.error("Ошибка при получении информации пользователя по айди", error);
        return false; 
    }
}

export async function getUserInfoById(user_id, token) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/api/v1/user/${user_id}`, { 
            params: { 
                user_id: user_id,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации пользователя по айди", error);
        return false; 
    }
}

export async function getReferer(vk_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/api/v2/users/get_referer`, { 
            "vk_id": vk_id
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о реферере", error);
        return false; 
    }
}

export async function getVipUser(vk_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/api/v2/users/get_vip_user`, { 
            "vk_id": vk_id
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о вип юзере", error);
        return false; 
    }
}

export async function getTree(vk_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/api/v2/users/get_tree`, { 
            "vk_id": vk_id
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации для структуры", error);
        return false; 
    }
}

export async function setLeg(user_id, leg) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/api/v2/users/change_current_leg`, { 
            "user_id": user_id,
            "leg": leg
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при изменении ноги", error);
        return false; 
    }
}

export async function getReferals(vk_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/api/v2/users/get_referals`, { 
            "vk_id": vk_id
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении рефералов пользователя", error);
        return false; 
    }
}

export async function getStructureInfo(vk_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/api/v2/users/get_structure`, { 
            "vk_id": vk_id
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении данных для раздела структуры", error);
        return false; 
    }
}