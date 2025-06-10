export type Role = "admin" | "guest" | "member" | "staff" 
    
export type User = {
    id: string,
    role: Role
}