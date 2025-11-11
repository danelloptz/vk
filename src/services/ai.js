import axios from 'axios';

export async function sendBrief(payload, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/brif/create', payload, {
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
    try {
        const response = await axios.get('https://web.intelektaz.com/api/beta/brif', {
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
        const response = await axios.patch(`https://web.intelektaz.com/api/beta/brif/${brif_id}`, payload, {
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
        const response = await axios.patch(`https://web.intelektaz.com/api/beta/content_plan`, plan, {
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
        const response = await axios.get('https://web.intelektaz.com/api/beta/content_plan/', {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/generate_topics', {}, {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/generate_posts_text', posts, {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/regenerate_topics', posts, {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/regenerate_posts_text', posts, {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/generate_banners', posts, {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/regenerate_banners', posts, {
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
        const response = await axios.post('https://web.intelektaz.com/api/beta/content_plan/accept_content_plan', plan, {
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

export async function uploadUserImage(topic_id, file, token, chose_image_index = -1) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const params = {
            topic_id: topic_id
        };

        if (chose_image_index !== -1) {
            params.chose_image_index = chose_image_index;
        }
        
        const response = await axios.post(
            `https://web.intelektaz.com/api/beta/content_plan/content_plan_custom_image/${topic_id}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
                params: params
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

export async function generateCustomImage(text, aspect_ratio, color_palette, style_type, user_id) {
    let payload;
    if (color_palette == 'AUTO') {
        payload = {
            "prompt": text,
            "aspect_ratio": aspect_ratio,
            "style_type": style_type,
            "user_id": user_id
        };
    } else {
            payload = {
                "prompt": text,
                "aspect_ratio": aspect_ratio,
                "color_palette": color_palette,
                "style_type": style_type,
                "user_id": user_id
            };
        }
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/others/generate_image', payload);
        return response.data.image_id;
    } catch(error) {
        console.error("Ошибка при генерации изображения в ии баннере", error);
        return {
            "isError": true,
            "code": error.response.status
        };
    }
}


export async function getGenerations(user_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/get_generations', {
            "user_id": user_id
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении генераций", error);
        return {
            "isError": true,
            "code": error.response.status
        };
    }
}

export async function writeOffGenerations(id, count_posts) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/v2/users/write_off_generations', {
            "id": id,
            "count_posts": count_posts,
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при списании генераций", error);
        return {
            "isError": true,
            "code": error.response.status
        };
    }
}

export async function buyGenerations(vk_id, count_posts) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/buy_generations', {
            "vk_id": vk_id,
            "count_posts": count_posts,
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при покупке генераций", error);
        return {
            "isError": true,
            "code": error.response.status
        };
    }
}

export async function saveTemplate(user_id, index, template) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/save_user_template', {
            "user_id": user_id,
            "index": index,
            "template": template
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при сохранении шаблона", error);
        return {
            "isError": true,
            "code": error.response.status
        };
    }
}

export async function getTemplates(user_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/users/get_user_template', {
            "user_id": user_id,
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении шаблона", error);
        return {
            "isError": true,
            "code": error.response.status
        };
    }
}