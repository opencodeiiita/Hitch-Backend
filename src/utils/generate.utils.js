const genrateRandomPassword = (size) => { 
    let randomPass=''
    const availableChar='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ124567890!@#$%^&*'
    for(let i=0; i<size; i++){
        const ind=Math.floor(Math.random*availableChar.length())
        randomPass+=availableChar.charAt(ind)
    }
    return randomPass
}

module.exports = {
    genrateRandomPassword
}