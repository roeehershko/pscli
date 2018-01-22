export interface Profile {
    name: string;
    phone: string;
    primary_email: string;
}

export interface User {
    email: string;
    password: string;
    profile: Profile;
}
