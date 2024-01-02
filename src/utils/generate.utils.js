const genrateRandomPassword = (size) => {
    // generate random password
    let password = "";
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+=";
    const all = upperCaseLetters + lowerCaseLetters + numbers + symbols;

    for (let i = 0; i < size; i++) {
        password += all.charAt(Math.floor(Math.random() * all.length));
    }

    return password;
}

module.exports = {
    genrateRandomPassword
}