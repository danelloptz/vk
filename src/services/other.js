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