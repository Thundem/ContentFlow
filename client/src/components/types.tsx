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
}

export interface Comment {
    id: number;
    text: string;
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