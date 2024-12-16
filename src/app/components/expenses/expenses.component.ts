import { Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { IExpense, IExpenseSummary } from '../../model/interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from "chart.js"
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver'

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
  toastr = inject(ToastrService)

  expenses: IExpense[] = []
  newExpense: Partial<IExpense> = { title: '', amount: 0, date: '', category: '' };
  chart: any
  token = localStorage.getItem('token') || ''
  summary: IExpenseSummary[] = []

  ngOnInit(): void {
    this.getAllExpenses()
    this.getExpenseSummary()
  }

  getAllExpenses() {
    this.expensesService.getExpenses(this.token).subscribe({
      next: (data: IExpense[]) => {
        this.expenses = data;
        console.log(data)
        this.generateChart();
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
        this.toastr.error('Failed to fetch')
      }
    });
  }

  addExpense() {
    this.expensesService.addExpenses(this.newExpense, this.token).subscribe({
      next: () => {
        this.newExpense = {
          title: '', amount: 0, date: '', category: ''
        };
        this.toastr.success("Added new Expense")
        this.getAllExpenses();
        this.getExpenseSummary()
      },
      error: (err) => {
        console.error('Error adding expense:', err);
        this.toastr.error('Failed to add expense')
      }
    });
  }

  updateExpense(expense: IExpense) {
    this.expensesService.updateExpense(expense, this.token).subscribe({
      next: () => {
        this.getAllExpenses();
      },
      error: (err) => {
        console.error(`Error updating expense with ID ${expense._id}:`, err);
        alert('Failed to update expense. Please try again.');
      }
    });
  }

  deleteExpense(id: string) {
    this.expensesService.deleteExpense(id, this.token).subscribe({
      next: () => {
        this.toastr.success('Deleted Expense')
        this.getAllExpenses();
        this.getExpenseSummary()
      },
      error: (err) => {
        console.error(`Error deleting expense with ID ${id}:`, err);
        this.toastr.error('Failed to delete expense')
      }
    });
  }

  getExpenseSummary() {
    this.expensesService.getExpenseSummary(this.token).subscribe({
      next: (data: IExpenseSummary[]) => {
        this.summary = data
      },
      error: (err) => {
        this.toastr.error('Failed to fetch expense summary')
        console.error(err)
      }
    })
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
            backgroundColor: ['#003f5c', '2f4b7c', '#665191', '#a05195', '#d45087', '#f95d6a', '#ff7c43', '#ffa600'],
          },
        ],
      },
    });
  }

  exportData(format: string) {
    const data = JSON.stringify(this.expenses, null, 2);
    const blob = new Blob([data], { type: 'application/json' });

    if (format === 'pdf') {
      saveAs(blob, 'expenses.pdf');
    } else if (format === 'excel') {
      saveAs(blob, 'expenses.xlsx');
    }
  }

}
