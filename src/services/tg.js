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

export async function getTokensByCode(code) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/login/get_tokens_by_code', 
            {
                params: {
                    code: code
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении токенов", error);
        return false; 
    }
}

export async function activeTg(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/login/became_dumbass',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при активации телеграмма", error);
        return false; 
    }
}

export async function getRotationGroups(tariff, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/rotation/get_rotation_groups',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    tariff: tariff
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении групп для ротации", error);
        return false; 
    }
}

export async function sendPostsTg(topic_ids, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/processes/create_delayed_publication', {
            topic_ids: topic_ids
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
        console.error("Ошибка при активации пользователя", error);
        return false; 
    }
}


export async function turnAdsOn(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/user/on_intelektaz_ads', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при включении Эдс", error);
        return false; 
    }
}

export async function turnAdsOff(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/user/off_intelektaz_ads', {},
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

export async function getTelegramLinks(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_tg_links',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении ссылок на телеграмм каналы пользователя", error);
        return false; 
    }
}

export async function turnRotationChannels(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/add_group', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при активации ротации", error);
        return false; 
    }
}

export async function getMandatoryChannels(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/login/check_mandatory_channels_subs',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении ссылок на телеграмм каналы пользователя", error);
        return false; 
    }
}

export async function addPromotionChannel(channel_link, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/user/add_promotion_channel', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    channel_link: channel_link
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при привязки канала для автопродвижения", error);
        return false; 
    }
}

export async function getStoriesRotationChannels(tariff, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/rotation/get_rotation_stories',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    tariff: tariff
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении историй для ротации", error);
        return false; 
    }
}

export async function addTelegramStory(story_url, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/create_story', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    story_url: story_url
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при привязки телеграмм истории для автопродвижения", error);
        return false; 
    }
}

export async function getVkToken(code, state, code_verifier, device_id, redirect_uri, user_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/auth/add_vk', {
            "code": code,
            "state": state,
            "code_verifier": code_verifier,
            "device_id": device_id,
            "redirect_uri": redirect_uri
        },
        {
            params: {
                user_id: user_id
            }
        }
    );
        return response.data;
    } catch (error) {
        console.error("Ошибка при привязке вк", error);
        return false; 
    }
}

export async function getUserStory(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_cur_story', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении пользовательской истории", error);
        return false; 
    }
}

export async function getTgGroupStats(user_tg_id, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/group/get_statistics', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    user_tg_id: user_tg_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении статистики о группе пользователя", error);
        return false; 
    }
}

export async function turnRotationStories(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/add_story', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при активации сториз", error);
        return false; 
    }
}

export async function checkStoryViewed(story_id, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/check_story_viewed', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    story_id: story_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке просмотра сториз", error);
        return false; 
    }
}


export async function upgradeTelegrmChannel(channel_link, token) {
    try {
        const response = await axios.put(`https://web.intelektaz.com/api/tg/group/upgrade_channel`, {},{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                channel_link: channel_link
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении телеграмм канал пользователя", error);
        return false; 
    }
}

export async function updateVipPlatform(platform, token) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/api/tg/user/update_vip_platform`, {},{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                platform: platform
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при обновлении платформы рекламного предложения", error);
        return false; 
    }
}

export async function getUserPlatform(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_vip_platform', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении рекламной платформы пользователя", error);
        return false; 
    }
}

export async function getRotationTgPosts(tariff, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/rotation/get_rotation_posts', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    tariff: tariff
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении постов для тг ротации", error);
        return false; 
    }
}

export async function createTgPost(post_url, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/create_post', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    post_url: post_url
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при привязке телеграмм поста для продвижения", error);
        return false; 
    }
}

export async function checkPostViewed(post_id, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/check_post_viewed', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    post_id: post_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке просмотра телеграмм поста", error);
        return false; 
    }
}

export async function addTgPostRotation(token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/tg/rotation/add_post', {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении поста в ротацию", error);
        return false; 
    }
}

export async function getTgGroupInfo(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/group/get_group_photo_and_name', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о привязанном тг канале.", error);
        return false; 
    }
}

export async function getUserInfoById(user_id, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_user_info', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    user_id: user_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о пользователе.", error);
        return false; 
    }
}

export async function getBaseIdByTgOrVk(external_id, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_internal_id_by_external', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    external_id: external_id
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о пользователе.", error);
        return false; 
    }
}

export async function getCurPost(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/user/get_cur_post', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о пользователе.", error);
        return false; 
    }
}


export async function getPostStat(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/tg/rotation/get_post_statistics', 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении статы о посте.", error);
        return false; 
    }
}