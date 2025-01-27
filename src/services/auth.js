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

export function getToken(code, state, code_verifier, device_id, redirect_uri) {
    console.log(code_verifier);
    localStorage.setItem("POST CODE_VERIFIER", code_verifier);
    return axios.post('https://web.intelektaz.com/api/v1/auth/', {
        code, 
        state,
        code_verifier,
        device_id,
        redirect_uri
    })
    .then((response) => {
        console.log(response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        return response; // Возвращаем ответ, чтобы вызвать .then на результат
    })
    .catch((error) => {
        console.error("Error during request:", error.response || error);
        throw error; // Пробрасываем ошибку для обработки в вызвавшем коде
    });
}


export async function check() {
    try {
        const response = await axios.get('https://web.intelektaz.com/ping');
        console.log(response);
        return response;
    } catch (error) {
        console.error("Ошибка при проверке авторизации", error);
        return false; 
    }
}


// здесь тоже пути запросов менять