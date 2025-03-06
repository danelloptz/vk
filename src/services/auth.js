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

export function getToken(code, state, code_verifier, device_id, redirect_uri) {
    return axios.post('https://web.intelektaz.com/api/v1/auth/', {
        code, 
        state,
        code_verifier,
        device_id,
        redirect_uri
    })
    .then((response) => {
        return response;
    })
    .catch((error) => {
        console.error("Error during request:", error.response || error);
        throw error;
    });
}

export async function refreshToken(refresh_token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/auth/refresh', {
            "refresh_token": refresh_token,
        },
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке авторизации", error);
        return false; 
    }
}

export async function addReferer(referer_id, referal_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/add_referer', {
            "referer_id": referer_id,
            "referal_id": referal_id
        },
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении реферала", error);
        return false; 
    }
}

export async function setNewUser(payload) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/new_user', payload);
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении нового пользователя", error);
        return false; 
    }
}

export async function changeStatus(token) {
    console.log("token: ", token);
    try {
        const response = await axios.post(
            'https://web.intelektaz.com/api/v2/users/change_user_status',
            {},
            {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при изменении статуса пользователя", error);
        return false; 
    }
}