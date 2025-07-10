export type Role = "Admin" | "Guest" | "Member" | "Staff" 
    
export type User = {
    id: string,
    unique_name?: string,
    gender?: boolean,
    phone?: string,
    gmail?: string,
    bloodType?: string,
    dob?: Date,
    address?: string,
    role: Role
}