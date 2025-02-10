import axios from 'axios';

export async function getPosts() {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/v2/others/get_autoposting_posts');
        return response.data.posts;
    } catch (error) {
        console.error("Ошибка при получении информации о подписке", error);
        return false; 
    }
}