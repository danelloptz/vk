import axios from 'axios';

export async function checkTxid(txid) {
    try {
        const response = await axios.post('http://localhost:3000/api/txid-check', {
            "txid": txid
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при проверке TxID", error);
        return false; 
    }
}

export async function getHistory() {
    try {
        const response = await axios.get('http://localhost:3000/api/history-trans');
        return response.data.history;
    } catch (error) {
        console.error("Ошибка при получении истории транзакций", error);
        return false; 
    }
}


export async function getTransactions(offset, limit, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/beta/user/transactions', { 
            params: { 
                offset: offset,
                limit: limit
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении информации о транзакциях", error);
        return false; 
    }
}

export async function sendTo(to_user, amount, token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/beta/transactions/transfer', { 
            params: { 
                to_user: to_user,
                amount: amount
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при переводе средств", error);
        return false; 
    }
}

export async function putMoney(amount, hash, contractaddress, recipient, chain, token) {
    console.log(amount, hash, contractaddress, recipient, chain);
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/user/balance/pick_up', {
            "amount": amount,
            "hash": hash,
            "contractaddress": contractaddress,
            "recipient": recipient,
            "chain": chain
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при пополнении баланса");
        return { 
            "isError": true,
            "message": error.response.data.detail
        }; 
    }
}

export async function getTariffs(token) {
    try {
        const response = await axios.get('https://web.intelektaz.com/api/beta/tariffs', { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении тарифов", error);
        return false; 
    }
}

export async function getMoney(id, sum_money, wallet, chain, commission) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/v2/users/withdrawal_money', {
            "id": id,
            "sum_money": sum_money,
            "wallet": wallet,
            "chain": chain,
            "commission": commission
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при выводе средств", error);
        return {"code": error.status}
    }
}

export async function buyTariff(tariff_id, count_month, tariff_name, tariff_price_per_month, token) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/user/tariffs/buy', {
            "tariff_id": tariff_id,
            "count_month": count_month,
            "tariff_name": tariff_name,
            "tariff_price_per_month": tariff_price_per_month
        }, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при оплате тарифа", error);
        return { 
            "isError": true,
            "message": error.response.data.detail
        }; 
    }
}

export async function buyBooster(price, token) {
    console.log(token);
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/user/tariffs/buy_booster', {}, { 
            params: {
                price: price
            },
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при оплате бустера", error);
        return { 
            "isError": true,
            "message": error.response.data.detail
        }; 
    }
}

export async function cancelTransaction(transaction_id) {
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/v2/users/cancel_withdrawal_money', {
            "transaction_id": transaction_id,
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при отмене перевода", error);
        return false; 
    }
}

export async function upgradeToLeader(amount, token) {
    console.log(amount);
    try {
        const response = await axios.post('https://web.intelektaz.com/api/beta/user/upgrade_to_leader', {}, { 
            params: {
                amount: amount
            },
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
         });
        return response.data;
    } catch (error) {
        console.error("Ошибка при апгрейде до лидера", error);
        return { 
            "isError": true,
            "message": error.response.data.detail
        }; 
    }
}