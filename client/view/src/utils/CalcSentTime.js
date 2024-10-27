export const calcSentTime = (time_stamp) => {
    const sentTime = time_stamp;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - sentTime) / 1000);
    if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} giờ trước`;
    } else if (diffInSeconds < 2592000) { // less than 30 days
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ngày trước`;
    } else if (diffInSeconds < 31536000) { // less than 1 year
        const months = Math.floor(diffInSeconds / 2592000);
        return `${months} tháng trước`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} năm trước`;
    }
};
