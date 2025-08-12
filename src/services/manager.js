import axios from 'axios';

export async function getManagers(user_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/get-managers/${user_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении менеджеров пользователя", error);
        return false; 
    }
}

export async function bindBot(bot_token, manager_id, client_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/manager-api/bots/bind-bot', 
            {
                "bot_token": bot_token,
                "manager_id": manager_id,
                "client_id": client_id
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при привязке телеграмм бота к менеджеру", error);
        return false; 
    }
}

export async function createManager(client_id, telegram_token, brief, communication_style, welcome_message) {
    try {
        const response = await axios.post('https://web.intelektaz.com/manager-api/manager/create', 
            {
                "client_id": client_id,
                "telegram_token": telegram_token,
                "brief": brief,
                "communication_style": communication_style,
                "welcome_message": welcome_message
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании менеджера", error);
        return false; 
    }
}

export async function getManager(manager_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/manager/${manager_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении менеджера пользователя", error);
        return false; 
    }
}

export async function updateBrief(manager_id, brief, communication_style, welcome_message) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/manager/${manager_id}/update_brief`, 
            {
                "brief": brief,
                "communication_style": communication_style,
                "welcome_message": welcome_message,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении брифа", error);
        return false; 
    }
}

export async function deleteManager(manager_id) {
    try {
        const response = await axios.delete(`https://web.intelektaz.com/manager-api/manager/${manager_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при удалении менеджера пользователя", error);
        return false; 
    }
}

export async function getHelloMessage(manager_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/manager/generate-welcome/${manager_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при генерации приветственного сообщения менеджера пользователя", error);
        return false; 
    }
}