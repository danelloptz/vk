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
        const send = {
            "payload": {
                "vk_link": vk_link,
                "vk_id": vk_id,
                "type_sub": move
            }
        }
        console.log(send);
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/check_user_subscribe', send);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении проверки подписки на группу", error);
        return 'zopa'; 
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

export async function editVideo(video_link, vk_id, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/save_video', {
            "video_link": video_link,
            "vk_id": vk_id,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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
            "vk_id": vk_id
        } );
        return response.data;
    } catch (error) {
        console.error("Ошибка при выводе групп для подписки", error);
        return false; 
    }
}

export async function getRotationGroups(vk_id, tariff) {
    console.log(typeof vk_id);
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/get_rotation_groups', {
            "vk_id": vk_id,
            "tariff": tariff
        } );
        return response.data;
    } catch (error) {
        console.error("Ошибка при выдаче групп для подписки", error);
        return false; 
    }
}

export async function getRotationVideos(vk_id, tariff) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/get_rotation_videos', {
            "vk_id": vk_id,
            "tariff": tariff
        } );
        return response.data;
    } catch (error) {
        console.error("Ошибка при выдаче видео для ротации", error);
        return false; 
    }
}

export async function getRotationPosts(vk_id, tariff) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/get_rotation_posts', {
            "vk_id": vk_id,
            "tariff": tariff
        } );
        return response.data;
    } catch (error) {
        console.error("Ошибка при выдаче постов для ротации", error);
        return false; 
    }
}

export async function checkLike(post_link, group_id, vk_id) {
    try {
        const payload = {
            "payload": {
                "post_link": post_link,
                "group_id": group_id,
                "vk_id": vk_id
            }
        }
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/check_like', payload);
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверки лайка поста для ротации", error);
        return false; 
    }
}

export async function addView(user_id, video_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/groups/video_viewed', {
            "video_id": video_id,
            "user_id": user_id
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении просмотра к видео", error);
        return false; 
    }
}