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

export async function setAdds(vk_link, vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/set_group_in_ads', {
            "payload": {
                "vk_link": vk_link,
                "vk_id": vk_id
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении в рекламную ленту", error);
        return false; 
    }
}

export async function getOtherAdds(vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/v2/others/get_ads', {
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

export async function editOtherAdd(payload, ad_id, timestamp) {
    try {
        console.log(ad_id, timestamp);
        payload.append("ad_id", ad_id);
        timestamp = Math.floor(timestamp / 1000);
        console.log(timestamp);
        payload.append("date_view_end", String(timestamp));
        const response = await axios.patch("https://web.intelektaz.com/api/v2/others/add_ads", 
            payload,
            {
                headers: { "Content-Type": "multipart/form-data" } 
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при редактировании рекламы", error);
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

export async function deleteAdd(ad_id) {
    console.log(typeof ad_id);
    try {
        const response = await axios.delete("https://web.intelektaz.com/api/v2/others/add_ads", {
            data: { ad_id }, 
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при удалении рекламы пользователя", error);
        return false;
    }
}