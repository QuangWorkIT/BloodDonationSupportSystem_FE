// return formatted phone number +8496...
export const formatPhoneOtp = (phone: string): string =>  {    
    return '+84'.concat(phone.trim().substring(1))
}
// return formatted phone number 096...
export const formatPhoneRegister = (phone: string):string => {
    return '0'.concat(phone.trim().substring(3))
}
// return hidden phone number 096xxxx
export const hiddenPhone = (phone: string): string => {
    const subPhone = phone.trim().substring(0,6)
    return subPhone.concat('XXXXXX')
}