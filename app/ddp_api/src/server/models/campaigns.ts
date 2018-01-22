export interface Pixel {
    target: string;
}

export interface Source {
    id?: string;
    title: string;
}

export interface Event {
    title: string;
    type: number;
    revenue: number;
    is_default: boolean;
}

export interface RoleOptions {
    $eq?: string;
    $contains?: string;
    $gt?: number;
    $lt?: number;
    $in?: string[];
}

export interface Role {
    [key: string]: RoleOptions
}

export interface EndPoint {
    lander: { title: string; url: string; };
    roles?: Role
    weight: number;
}

export interface Campaign {
    title: string;
    endpoints: EndPoint[]
    pixels?: Pixel[];
}
