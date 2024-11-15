export interface LoginData {
    email: string;
    password: string;
}

export interface SignUpData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    IsAccepted: boolean;
    gender: string;
    dateOfBirth: string;
}

export interface Comment {
    id: number;
    text: string;
    userId: number;
}

export interface PostData {
    id: number;
    mediaUrl: string;
    content: string;
    likes: number;
    user: { id: number; username: string } | null;
    comments: Comment[];
    userId: number | null;
}

export interface PostProps {
    id: number;
    mediaUrl: string;
    content: string;
    likes: number;
    comments: Comment[];
    userId: number | null; 
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: {
        id: number;
        username: string;
        email: string;
    } | null;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

export interface CloudinarySignatureResponse {
    timestamp: number;
    signature: string;
    cloudName: string;
    apiKey: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
}