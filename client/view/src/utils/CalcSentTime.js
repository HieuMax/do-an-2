export const calcSentTime = (time_stamp) => {
    let time = '';
    const day = new Date(Date.now())
    const sentTime = new Date (day - (day - time_stamp));
    if (day.getUTCFullYear() >= sentTime.getUTCFullYear()) {
        if (day.getUTCMonth() >= sentTime.getUTCMonth()) {
            if (day.getUTCDate() == sentTime.getUTCDate()) {
                if (day.getHours() == sentTime.getHours()) {
                    if (day.getMinutes() == sentTime.getMinutes()) {
                        return time=+ (day.getSeconds() - sentTime.getSeconds()) + " giây trước"
                    } else {
                        return time=+ (day.getMinutes() - sentTime.getMinutes()) + " phút trước"
                    }
                } else {
                    return time=+ (day.getHours() - sentTime.getHours()) + " giờ trước"
                }
            } else {
                return time=+ (day.getUTCDate() - sentTime.getUTCDate()) + " ngày trước"
            }
        } else {
            return time=+ (day.getUTCMonth() - sentTime.getUTCMonth()) + " tháng trước"
        }
    } else {
        return time=+ (day.getUTCFullYear() - sentTime.getUTCFullYear()) + " năm trước"
    }
    // console.log(`Calc sent time: ${calcSentTime.toTimeString()} - ${calcSentTime.toDateString() > new Date().toDateString()} - ${new Date().toDateString()}`)

}