import axios from 'axios';

export async function getAssemblyGroups() {
    try {
        const response = await axios.get('http://localhost:3000/api/assembly-groups');
        return response.data.groups;
    } catch (error) {
        console.error("Ошибка при получении данных о группах для конвеера", error);
        return false; 
    }
}

export async function checkGroupLink(vk_link, vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/check_group', 
            {
                "payload": {
                    "vk_link": vk_link,
                    "vk_id": vk_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении проверки валидности группы", error);
        return false; 
    }
}

export async function checkGroupSub(vk_link, vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/check_user_subscribe', 
            {
                "payload": {
                    "vk_link": vk_link,
                    "vk_id": vk_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении проверки подписки на группу", error);
        return false; 
    }
}