import { API_ENDPOINT } from "..";

const url = "/notify";

export const getNotify = async (info) => {
    const message = JSON.stringify({ value: info })
    // console.log(message)
    try {
        await fetch(`${API_ENDPOINT}${url}/send-notification`, {
            method: "POST",
            body: message,
            headers: {
                'Content-type': 'application/json',
            },
        })
    } catch (error) {
        console.error(error)
    }
}

export const getNotificate =  async () => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/getAllNotifies`)
        const json = await response.json();
        return json
        console.log(json)
    } catch (error) {
        console.log(error)
    }
}