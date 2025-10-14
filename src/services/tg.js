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
        console.log(sponsor_tg_id, sponsor_platform);
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

export async function loadTgData(_, country, city, sex_db, interests, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/login/load_user_data', {
            "country": country,
            "city": city,
            "sex_db": sex_db,
            "interests": interests
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении информации о пользователе", error);
        return false; 
    }
}

export async function getSubTgChannels(_, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/login/get_registration_groups', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении каналов для подписки при регистрации", error);
        return false; 
    }
}

export async function checkTgSub(_, channel_id, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/rotation/check_subscribe',
            {
                params: {
                    channel_id: channel_id
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверки подписки на канал", error);
        return false; 
    }
}

export async function activateTgUser(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/login/activate', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при активации пользователя", error);
        return false; 
    }
}

export async function getTgReferer(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_referer',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении реферера", error);
        return false; 
    }
}
