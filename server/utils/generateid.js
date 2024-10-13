const generateid = (id, subValid) => {
    const date = new Date();
    // if(date.getFullYear() < 2024) -- handle if system error
    const prefix = "DT" + date.getFullYear()
    if (!id) {
        const newId = prefix + "00" + 1
        return newId
    }
    let newId = prefix + Number.parseInt(Number.parseInt(String(id).substring(subValid)) + 1)
    if(newId.length != id.length) {
        while(newId.length < id.length) {
            newId = newId.slice(0, 6) + "0" + newId.slice(6)
        }
    }
    return newId
}
module.exports = { generateid }