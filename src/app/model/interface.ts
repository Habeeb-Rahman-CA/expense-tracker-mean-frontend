export interface IUser {
    name?: string,
    email: string;
    password: string;
}

export interface IExpense {
    id: string;
    user?: string
    title: string;
    amount: number;
    category: string;
    date: string;
}

