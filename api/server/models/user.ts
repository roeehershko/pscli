export interface Profile {
    name: string;
    phone: string;
}

export interface User {
    email: string;
    password: string;
    Profile: Profile;
}
