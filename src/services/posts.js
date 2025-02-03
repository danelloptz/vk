import axios from 'axios';

export async function getPosts() {
    try {
        const response = await axios.get('http://localhost:3000/api/get-posts');
        return response.data.posts;
    } catch (error) {
        console.error("Ошибка при получении информации о подписке", error);
        return false; 
    }
}