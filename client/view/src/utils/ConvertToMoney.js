export const ConvertToMoney = (string) => {
    if(!string) return
    const arr = []
    for(let i=1; i <= string.length; i++) {
        arr.push(String(string).substring(i-1,i))
    }
    for(let i=0; i < arr.length; i++) {
        if((i+1) % 3 == 0) {
            arr.fill(`${arr[i-2]},`, i-2, i-1)
        }
    }
    return(arr.join(''));
}

