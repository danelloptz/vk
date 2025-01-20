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