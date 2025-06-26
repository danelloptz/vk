import axios from 'axios';

export async function getNews() {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/others/get_news');
        return response.data.news;
    } catch(error) {
        console.error("Ошибка при получении новостей", error);
        return false; 
    }
}

export async function sendTrouble(group_link, user_id, reason, comment) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/others/send_report', {
            "group_link": group_link,
            "user_id": user_id,
            "reason": reason,
            "comment": comment
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при отправке жалобы", error);
        return false; 
    }
}

export async function loadImage(file) {
    try {
        const formData = new FormData();
        formData.append("img", file);
        const response = await axios.post('https://web.intelektaz.com/api/v2/others/load_image', formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при загрузке изображения", error);
        return false; 
    }
}

export async function getImage(image_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/api/v2/others/proxy/${image_id}`,
        {
            params: {
                image_id: image_id
            },
            responseType: 'blob',
        });
        
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении изображения", error);
        return false; 
    }
}