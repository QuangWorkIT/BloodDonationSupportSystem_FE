export type Role = "admin" | "guest" | "member" | "staff" | null 
    
export type User = {
    id: string,
    role: Role
}