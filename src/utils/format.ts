// return formatted phone number +8496...
export const formatPhone = (phone: string): string =>  {    
    return '+84'.concat(phone.substring(1))
}

// return hidden phone number 096xxxx
export const hiddenPhone = (phone: string): string => {
    const subPhone = phone.substring(0,6)
    return subPhone.concat('XXXXXX')
}