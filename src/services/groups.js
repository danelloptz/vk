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

export async function checkGroupLink(vk_link, vk_id, move) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/check_group', 
            {
                "payload": {
                    "vk_link": vk_link,
                    "vk_id": vk_id,
                    "type_sub": move
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении проверки валидности группы", error);
        return false; 
    }
}

export async function checkGroupSub(vk_link, vk_id, move) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/check_user_subscribe', 
            {
                "payload": {
                    "vk_link": vk_link,
                    "vk_id": vk_id,
                    "type_sub": move
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении проверки подписки на группу", error);
        return false; 
    }
}

export async function editGroup(vk_link, vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/edit_group', {
            "payload": {
                "vk_link": vk_link,
                "vk_id": vk_id,
                "type_sub": ""
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при изменении группы", error);
        return false; 
    }
}

export async function editVideo(video_link, vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/save_video', {
            "video_link": video_link,
            "vk_id": vk_id,
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении видео", error);
        return false; 
    }
}

export async function addInRotation(vk_id, rotation_type) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/add_in_rotation', {
            "vk_id": vk_id,
            "rotation_type": rotation_type,
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении группы/видео в ротацию", error);
        return false; 
    }
}

export async function getGroups(vk_id) {
    console.log(typeof vk_id);
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/get_registration_groups', {
            params: {
                vk_id: vk_id
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при выводе групп для подписки", error);
        return false; 
    }
}