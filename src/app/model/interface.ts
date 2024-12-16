export interface IUser {
    name?: string,
    email: string;
    password: string;
}

export interface IExpense {
    _id: string;
    user?: string
    title: string;
    amount: number;
    category: string;
    date: string;
}

export interface IExpenseSummary {
    _id: string;
    total: number;
}
