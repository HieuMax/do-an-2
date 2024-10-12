const handleTotalMark = (mark) => {
    let flag = false;
    let total = 0;
    mark && mark.info.forEach(item => {
        !flag && item.mark !== '' 
          ? total+= item.mark
          : flag = true
    })
    if(flag) return
    return total
}

export default handleTotalMark
