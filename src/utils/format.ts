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

// return a array of date and time ["20/05/2025", "19:00"]
export const formatDateTime = (date: string): string[] => {
    if(!date) return []
    const currentDate = new Date(date)
    const formattedDate = `${String(currentDate.getDate()).padStart(2,'0')}/${String(currentDate.getMonth() + 1).padStart(2,'0')}/${currentDate.getFullYear()}`
    const time = `${String(currentDate.getHours()).padStart(2,'0')}:${String(currentDate.getMinutes()).padStart(2,'0')}`

    return [formattedDate, time]
}