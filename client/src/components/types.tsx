export interface LoginData {
    email: string;
    password: string;
}

export interface SignUpData {
    name: string;
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
    title: string;
    content: string;
    likes: number;
    user: { id: number; username: string } | null;
    comments: Comment[];
    userId: number | null;
}

export interface PostProps {
    id: number;
    title: string;
    content: string;
    likes: number;
    comments: Comment[];
    userId: number | null; 
}