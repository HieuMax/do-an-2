import { API_ENDPOINT } from "..";

const url = "/notify";

export const getNotify = async (message) => {
    try {
        await fetch(`${API_ENDPOINT}${url}/send-notification`, {
            method: "POST",
            body: message
        })
    } catch (error) {
        console.error(error)
    }
}