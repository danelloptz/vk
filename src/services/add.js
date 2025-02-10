import axios from 'axios';

export async function getAdds() {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/get_group_ads');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении рекламы", error);
        return false; 
    }
}

export async function getOtherAdds(vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/others/get_ads', {
            "payload": {
                "vk_id": vk_id
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении рекламных баннеров", error);
        return false; 
    }
}

export async function sendOtherAdd(payload) {
    try {
        const response = await axios.post("https://web.intelektaz.com/api/v2/others/add_ads", 
            payload,
            {
                headers: { "Content-Type": "multipart/form-data" } 
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при отправке рекламы", error);
        return false;
    }
}

export async function getUserAdds(vk_id) {
    console.log("vk_id: ",vk_id);
    try {
        const response = await axios.post("https://web.intelektaz.com/api/v2/users/get_ads", 
            {
                "vk_id": vk_id
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении всех реклам пользователя", error);
        return false;
    }
}