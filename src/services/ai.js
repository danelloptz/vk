import axios from 'axios';

export async function sendBrief(payload, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/brif/create', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch(error) {
        console.error("Ошибка при отправке брифа", error);
        return false; 
    }
}

export async function getBrief(token) {
    console.log(token);
    try {
        const response = await axios.get('https://web.intelektaz.com/api/v1/brif', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении брифа", error);
        return false; 
    }
}

export async function updateBrief(brif_id, payload,  token) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/api/v1/brif/${brif_id}`, payload, {
            params: {
                brif_id: brif_id
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch(error) {
        console.error("Ошибка при сохранении брифа", error);
        return false; 
    }
}

export async function updateContentPlan(plan, token) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/api/v1/content_plan`, plan, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch(error) {
        console.error("Ошибка при сохранени контент плана", error);
        return false; 
    }
}

export async function getContentPlan(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/v1/content_plan/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении контент плана", error);
        return false; 
    }
}

export async function generateTopics(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/generate_topics', {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при генерации тем контент плана", error);
        return false; 
    }
}

export async function generatePostsText(posts, token) {
    try {
        console.log(posts);
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/generate_posts_text', posts, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при генерации постов контент плана", error);
        return false; 
    }
}

export async function regenerateThemes(posts, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/regenerate_topics', posts, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при регенерации тем контент плана", error);
        return false; 
    }
}

export async function regeneratePosts(posts, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/regenerate_posts_text', posts, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при регенерации текстов постов контент плана", error);
        return false; 
    }
}

export async function generateBanners(posts, token) {
    try {
        console.log(posts);
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/generate_banners', posts, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        return response.data;
    } catch(error) {
        console.error("Ошибка при генерации баннеров контент плана", error);
        return false; 
    }
}

export async function regenerateBanners(posts, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/regenerate_banners', posts, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при регенерации картинок постов контент плана", error);
        return false; 
    }
}

export async function acceptPlan(plan, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v1/content_plan/accept_content_plan', plan, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при одобрении контент плана", error);
        return false; 
    }
}

export async function uploadUserImage(topic_id, file, token) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(
            `https://web.intelektaz.com/api/v1/content_plan/content_plan_custom_image/${topic_id}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
                params: {
                    topic_id: topic_id
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке изображения для поста контент плана", error);
        return false;
    }
}

export async function getAnalytics(vk_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/get_stats', {
            "vk_id": vk_id
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении статистики о группе", error);
        return false; 
    }
}

export async function getChat(user_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/get_helper_messages', {
            "user_id": user_id
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении диалога с ИИ", error);
        return false; 
    }
}

export async function sendChatMessage(message, history, thread_id, dialog_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/helper_chat', {
            "message": message,
            "history": history,
            "thread_id": thread_id,
            "dialog_id": dialog_id
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при отправлении сообщения в чат ИИ", error);
        return false; 
    }
}

export async function getScenario(user_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/get_scenario', {
            "user_id": user_id
        });
        return response.data.scenario;
    } catch(error) {
        console.error("Ошибка при получении сценария", error);
        return false; 
    }
}

export async function generateScenario(payload) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/generate_scenario', payload);
        return response.data.scenario;
    } catch(error) {
        console.error("Ошибка при генерации сценария", error);
        return false; 
    }
}

export async function editScenario(payload) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/edit_scenario', payload);
        return response.data.scenario;
    } catch(error) {
        console.error("Ошибка при редактировании сценария", error);
        return false; 
    }
}