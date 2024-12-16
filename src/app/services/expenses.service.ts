import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IExpense, IExpenseSummary } from '../model/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  expensesUrl = 'https://expense-tracker-mean-server.onrender.com/api/expenses'

  constructor(private http: HttpClient) { }

  getExpenses(token: string): Observable<IExpense[]> {
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<IExpense[]>(this.expensesUrl, { headers: header })
  }

  addExpenses(expenses: Partial<IExpense>, token: string): Observable<IExpense> {
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.post<IExpense>(this.expensesUrl, expenses, { headers: header })
  }

  updateExpense(expense: IExpense, token: string): Observable<IExpense> {
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.put<IExpense>(`${this.expensesUrl}/${expense._id}`, expense, { headers: header });
  }

  deleteExpense(id: string, token: string) {
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.delete(`${this.expensesUrl}/${id}`, { headers: header });
  }

  getExpenseSummary(token: string): Observable<IExpenseSummary[]>{
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.get<IExpenseSummary[]>(`${this.expensesUrl}/summary`, {headers: header})
  }
}
