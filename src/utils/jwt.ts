export interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
  key: string;
  role: string
}

// decode jwt to get payload
export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch (error) {
        console.log("can not decode jwt: ", error)
        return null
    }
}

// check for token expired time
export const isTokenExpired = (token: string):boolean => {
    const decoded = decodeJwt(token)
    if(decoded === null || !decoded.exp) return true

    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now // true if token is expired
}

// get user role
export const getRole = (token: string): string => {
    const decoded = decodeJwt(token)
    if(decoded) 
        return decoded.role
    return ''
}