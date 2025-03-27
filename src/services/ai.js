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