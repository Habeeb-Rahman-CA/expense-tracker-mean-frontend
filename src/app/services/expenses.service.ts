import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IExpense } from '../model/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  expensesUrl = 'http://localhost:5001/api/expenses'

  constructor(private http: HttpClient) { }

  getExpenses(): Observable<IExpense[]>{
    return this.http.get<IExpense[]>(this.expensesUrl)
  }

  addExpenses(expenses: IExpense): Observable<IExpense>{
    return this.http.post<IExpense>(this.expensesUrl, expenses)
  }

  updateExpense(expense: IExpense): Observable<IExpense> {
    return this.http.put<IExpense>(`${this.expensesUrl}/${expense.id}`, expense);
  }

  deleteExpense(id: string) {
    return this.http.delete(`${this.expensesUrl}/${id}`);
  }
}
