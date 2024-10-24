import { API_ENDPOINT } from "..";
import socket from "../../provider/websocket";

const url = "/notify";

// const message = JSON.stringify({ value: info })
// console.log(message)
// try {
//     await fetch(`${API_ENDPOINT}${url}/send-notification`, {
//         method: "POST",
//         body: message,
//         headers: {
//             'Content-type': 'application/json',
//         },
//     })
// } catch (error) {
//     console.error(error)
// }

// export const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid

export const getNotify = async (targetUid, text) => {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid
    const message = {
        userId,
        targetUid,
        text,
    };
    socket.send(JSON.stringify(message))
}

export const getNotificate =  async () => {
    try {
        const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid
        const response = await fetch(`${API_ENDPOINT}${url}/getAllNotifies/?userId=${userId}`)
        const json = await response.json();
        return json
    } catch (error) {
        console.log(error)
    }
}