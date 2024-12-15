import { Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { IExpense } from '../../model/interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from "chart.js"
import { MatInputModule } from '@angular/material/input';

Chart.register(...registerables);

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {

  expensesService = inject(ExpensesService)

  expenses: IExpense[] = []
  newExpense: IExpense = { id: '', title: '', amount: 0, date: '', category: '' };
  chart: any
  token = localStorage.getItem('token') || ''

  ngOnInit(): void {
    this.getAllExpenses()
  }

  getAllExpenses() {
    this.expensesService.getExpenses(this.token).subscribe({
      next: (data: IExpense[]) => {
        this.expenses = data;
        this.generateChart();
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
        alert('Failed to fetch expenses. Please try again later.');
      }
    });
  }

  addExpense() {
    this.expensesService.addExpenses(this.newExpense, this.token).subscribe({
      next: () => {
        this.newExpense = {
          id: '', title: '', amount: 0, date: '', category: ''
        };
        this.getAllExpenses();
      },
      error: (err) => {
        console.error('Error adding expense:', err);
        alert('Failed to add expense. Please check your input and try again.');
      }
    });
  }

  updateExpense(expense: IExpense) {
    this.expensesService.updateExpense(expense, this.token).subscribe({
      next: () => {
        this.getAllExpenses();
      },
      error: (err) => {
        console.error(`Error updating expense with ID ${expense.id}:`, err);
        alert('Failed to update expense. Please try again.');
      }
    });
  }

  deleteExpense(id: string) {
    this.expensesService.deleteExpense(id, this.token).subscribe({
      next: () => {
        this.getAllExpenses();
      },
      error: (err) => {
        console.error(`Error deleting expense with ID ${id}:`, err);
        alert('Failed to delete expense. Please try again.');
      }
    });
  }

  generateChart() {
    const categories = this.expenses.reduce((acc: { [key: string]: number }, expense: IExpense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = (document.getElementById('expenseChart') as any)
      .getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
    });
  }

}
