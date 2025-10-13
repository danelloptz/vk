import axios from "axios";

export async function getTgButton() {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/btn/');
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении html-кода кнопки авторизации Telegram", error);
        return false; 
    }
}

export async function tgLogin(id, first_name, last_name, username, photo_url, auth_date, hash, sponsor_tg_id, sponsor_platform) {
    try {
        let payload = {};
        let telegram_data = {
            id: id, 
            first_name: first_name, 
            last_name: last_name,
            username: username,
            photo_url: photo_url,
            auth_date: auth_date,
            hash: hash,
        }
        payload["telegram_data"] = telegram_data;
        console.log(sponsor_tg_id);
        if (sponsor_tg_id && sponsor_tg_id != "" && sponsor_tg_id != 'null') {
            payload["sponsor_tg_id"] = sponsor_tg_id;
        }
        if (sponsor_platform == 'tg') {
            payload["sponsor_platform"] = sponsor_platform;
        }
        const response = await axios.post('https://web.intelektaz.com/api/tg/login/', payload);
        return response.data;
    } catch (error) {
        console.error("Ошибка при авторизации пользователя", error);
        return false; 
    }
}

export async function loadTgData(tg_id, country, city, sex_db, interests) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/login/load_user_data', {
            "tg_id": tg_id,
            "country": country,
            "city": city,
            "sex_db": sex_db,
            "interests": interests
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении информации о пользователе", error);
        return false; 
    }
}

export async function getSubTgChannels(owner_id) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/login/get_registration_groups',
            {
                params: {
                    owner_id: owner_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении каналов для подписки при регистрации", error);
        return false; 
    }
}