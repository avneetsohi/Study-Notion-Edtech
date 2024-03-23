exports.secsToDuration = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds/3600)
    const minutes= Math.floor((timeInSeconds%3600)/60)
    const seconds=Math.floor((timeInSeconds%3600)%60)

    let courseDuration="";

    if(hours>0){
        courseDuration += `${hours} hour(s) `
    }
    if(minutes>0){
        courseDuration += `${minutes} min(s) `
    }
    if(seconds>0){
        courseDuration += `${seconds} second(s)`
    }
    if(courseDuration===""){
        courseDuration += "0 second(s)"
    }
    return courseDuration
}