export type Role = "Admin" | "Guest" | "Member" | "Staff" 
    
export type User = {
    id: string,
    name?: string,
    gender?: boolean,
    phone?: string,
    gmail?: string,
    bloodType?: string,
    dob?: Date,
    role: Role
}