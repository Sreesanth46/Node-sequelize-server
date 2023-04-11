function getRandomCharacter(regex) {
    return regex.charAt(Math.floor(Math.random() * regex.length));
}

function generatePassword() {
    let password = ''
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '1234567890'
    const specialCharacters = '!@#$%&*'

    while (password.length < 12) {
        password += getRandomCharacter(upperCaseLetters)
        password += getRandomCharacter(lowerCaseLetters)
        password += getRandomCharacter(numbers)
        password += getRandomCharacter(specialCharacters)
    }

    return password;
}

module.exports = { generatePassword }