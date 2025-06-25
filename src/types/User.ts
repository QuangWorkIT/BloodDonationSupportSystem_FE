export type Role = "Admin" | "Guest" | "Member" | "Staff" 
    
export type User = {
    id: string,
    role: Role
}