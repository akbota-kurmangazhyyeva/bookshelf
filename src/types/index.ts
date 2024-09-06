export interface Book {
    id: number;
    title: string;
    author: string;
    online: boolean;
    location: string;
    reviews: Review[];
    rate: number;
    description: string;
    image: string;
    quantity: number;
    genre: string;
  }
  
export interface Review {
    id: number;
    owner: User;
    text: string;
}
export interface User {
    id: number;
    username: string;
    password: string;
    phone: string;
    role: string;
    coins: number;
    finishTime: string;
}

export interface MarketplaceBook {
    id: number;
    title: string;
    author: string;
    owner: User;
    description: string;
    image: string;
}

export interface Question {
    id: string;
    text: string;
    correctAnswer: string;
    answers: string[];
}
export interface Test {
    id: string;
    book: Book;
    questions: Question[];
}

export interface Contest {
    id: string;
    tests: Test[];
    books: Book[];
    genre: string;
    date: string;
    start: string;
    end: string;
    participants: User[];
    finished: boolean;
    closed: boolean;
}

export interface Request {
    id: string;
    owner: User;
    image: string;
    description: string;
    rejected: boolean;
    read: boolean;
}