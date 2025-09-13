import axios from 'axios';

export async function getManagers(user_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/get-managers/${user_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении менеджеров пользователя", error);
        return false; 
    }
}

export async function bindBot(bot_token, manager_id, client_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/manager-api/bots/bind-bot', 
            {
                "bot_token": bot_token,
                "manager_id": manager_id,
                "client_id": client_id
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при привязке телеграмм бота к менеджеру", error);
        return false; 
    }
}

export async function createManager(client_id, telegram_token, brief, communication_style, welcome_message) {
    try {
        const response = await axios.post('https://web.intelektaz.com/manager-api/manager/create', 
            {
                "client_id": client_id,
                "telegram_token": telegram_token,
                "brief": brief,
                "communication_style": String(communication_style),
                "welcome_message": welcome_message
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании менеджера", error);
        return false; 
    }
}

export async function getManager(manager_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/manager/${manager_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении менеджера пользователя", error);
        return false; 
    }
}

export async function updateBrief(manager_id, brief, communication_style, welcome_message) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/manager/${manager_id}/update_brief`, 
            {
                "brief": brief,
                "communication_style": String(communication_style),
                "welcome_message": welcome_message,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при сохранении брифа", error);
        return false; 
    }
}

export async function deleteManager(manager_id) {
    try {
        const response = await axios.delete(`https://web.intelektaz.com/manager-api/manager/${manager_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при удалении менеджера пользователя", error);
        return false; 
    }
}

export async function getHelloMessage(manager_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/manager/generate-welcome/${manager_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при генерации приветственного сообщения менеджера пользователя", error);
        return false; 
    }
}

export async function getCompaigns(manager_id, limit, offset) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/campaigns`, {
            params: {
                manager_id: manager_id,
                limit: limit,
                offset: offset
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении рассылок пользователя", error);
        return false; 
    }
}

export async function createCampaign(manager_id, user_id, name, filters, filter_connection, add_current_contacts, copy_to_managers, is_active) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/campaign`, 
            {
                "name": name,
                "filters": filters,
                "filter_connection": filter_connection,
                "add_current_contacts": add_current_contacts,
                "copy_to_managers": copy_to_managers,
                "is_active": is_active
            },
            {
                params: {
                    manager_id: manager_id,
                    user_id: user_id,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании рассылки", error);
        return false; 
    }
}

export async function getCompaign(manager_id, campaign_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/campaign`, {
            params: {
                manager_id: manager_id,
                campaign_id: campaign_id
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении подробной информации по рассылке", error);
        return false; 
    }
}

export async function saveCompaignSettings(manager_id, campaign_id, name, filters, filter_connection, add_current_contacts) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/manager-api/campaign`, {
            "name": name,
            "filters": filters,
            "filter_connection": filter_connection,
            "add_current_contacts": add_current_contacts
        }, {
            params: {
                manager_id: manager_id,
                campaign_id: campaign_id
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при обновлении данных о рассылке", error);
        return false; 
    }
}

export async function createCampaignStep(campaign_id, name, title, text_html, image_url, send_time) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/campaign/step`, 
            {
                "name": name,
                "title": title,
                "text_html": text_html,
                "image_url": image_url,
                "send_time": send_time,
            },
            {
                params: {
                    campaign_id: campaign_id,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании шага рассылки", error);
        return false; 
    }
}

export async function deleteCampaign(campaign_id) {
    try {
        const response = await axios.delete(`https://web.intelektaz.com/manager-api/campaign`,
            {
                params: {
                    campaign_id: campaign_id
                }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Ошибка при удалении рассылки пользователя", error);
        return false; 
    }
}

export async function deleteCampaignStep(step_id) {
    try {
        const response = await axios.delete(`https://web.intelektaz.com/manager-api/campaign/step`,
            {
                params: {
                    step_id: step_id
                }
            }
        );
        return response.data;
    } catch(error) {
        console.error("Ошибка при удалении шага рассылки пользователя", error);
        return false; 
    }
}

export async function startCampaign(manager_id, campaign_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/campaign/start`, {},
            {
                params: {
                    manager_id: manager_id,
                    campaign_id: campaign_id,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при запуске рассылки", error);
        return false; 
    }
}

export async function stopCampaign(manager_id, campaign_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/campaign/stop`, {},
            {
                params: {
                    manager_id: manager_id,
                    campaign_id: campaign_id,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при остановке рассылки", error);
        return false; 
    }
}

export async function getCompaignStep(step_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/campaign/step/${step_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении подробной информации по шаге рассылки", error);
        return false; 
    }
}

export async function saveStepSettings(step_id, name, title, text_html, image_url, send_time) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/manager-api/campaign/step`, {
            "name": name,
            "title": title,
            "text_html": text_html,
            "image_url": image_url,
            "send_time": send_time
        }, {
            params: {
                step_id: step_id,
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при обновлении данных о шаге рассылки", error);
        return false; 
    }
}

export async function copyCompaignTo(manager_id, campaign_id, copy_to) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/campaign/copy`, 
            {
                "copy_to": copy_to
            },
            {
                params: {
                    manager_id: manager_id,
                    campaign_id: campaign_id,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при копировании рассылки в другой менеджер", error);
        return false; 
    }
}

export async function addContactsToCampaign(manager_id, campaign_id) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/campaign/add_existing_contacts`, {},
            {
                params: {
                    manager_id: manager_id,
                    campaign_id: campaign_id,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при добавлении текущих контактов в рассылку", error);
        return false; 
    }
}

export async function getAllDialogs(bot_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/get-dialogs/${bot_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении всех пользователей в переписке", error);
        return false; 
    }
}

export async function getDialog(bot_id, dialog_id, user_telegram_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/get-dialog/${bot_id}/${dialog_id}/${user_telegram_id}`, {
            params: {
                limit: 100
            }
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении переписки с конкретным пользователем", error);
        return false; 
    }
}

export async function changeDialog(dialog_id, data) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/manager-api/get-dialog/${dialog_id}`, {
            "data": data,
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при обновлении данных о беседе с пользователем", error);
        return false; 
    }
}

export async function changeUser(user_id, data) {
    try {
        const response = await axios.patch(`https://web.intelektaz.com/manager-api/get-user/${user_id}`, {
            "data": data,
        });
        return response.data;
    } catch(error) {
        console.error("Ошибка при обновлении данных о пользователе", error);
        return false; 
    }
}

export async function deleteUser(dialog_id) {
    try {
        const response = await axios.delete(`https://web.intelektaz.com/manager-api/get-dialog/${dialog_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при удалении пользователя из бота", error);
        return false; 
    }
}

export async function buyLimits(user_id, count) {
    try {
        const response = await axios.post(`https://web.intelektaz.com/manager-api/buy-limits`, {},
            {
                params: {
                    user_id: user_id,
                    count: count,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка при покупке лимитов", error);
        return false; 
    }
}

export async function getLimits(user_id) {
    try {
        const response = await axios.get(`https://web.intelektaz.com/manager-api/get-limits/${user_id}`);
        return response.data;
    } catch(error) {
        console.error("Ошибка при получении лимитов в менеджере", error);
        return false; 
    }
}