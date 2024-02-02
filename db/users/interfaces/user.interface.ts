export interface UserInterface {
    id?: number;
    name: string;
    password: string;
    role: "admin" | "partner";
}
