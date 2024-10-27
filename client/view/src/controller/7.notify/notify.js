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

export const updateSeenMsg = async (id) => {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid

    const data = {
        uid: userId,
        messId: id
    }
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/updateSeenMsg`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const json = await response.json();
        return json
    } catch (error) {
        console.log(error)
    }
}

// export const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid

export const getNotify = async (targetUid, text, typeOfUser) => {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid
    
    const message = {
        userId,
        targetUid,
        text,
        typeOfUser,
    };
    socket.send(JSON.stringify(message))
}

export const sendMessToAdmin = async (text) => {
    const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid

    const message = {
        userId,
        text,
        type: "sendAdmin"
    }

    socket.send(JSON.stringify(message))
}

export const getNotificate =  async () => {
    try {
        const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid
        const response = await fetch(`${API_ENDPOINT}${url}/getAllNotifies/?userId=${userId}`)
        const json = await response.json();
        return json
    } catch (error) {
        // console.log(error)
    }
}

export const getFullNotification = async () => {
    try {
        const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid
        const response = await fetch(`${API_ENDPOINT}${url}/getFullNotifies/?userId=${userId}`)
        const json = await response.json();
        return json
    } catch (error) {
        // console.log(error)
    }
}