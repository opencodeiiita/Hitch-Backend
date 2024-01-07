const genrateRandomPassword = (size) => { 
    // generate random password
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let password = '';

    for (let i = 0; i < size; i++)
    {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }

    return password;
};

module.exports = {
    genrateRandomPassword
};
