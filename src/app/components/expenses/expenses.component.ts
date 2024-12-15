import { Component, inject, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { IExpense } from '../../model/interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from "chart.js"

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {

  expensesService = inject(ExpensesService)

  expenses: IExpense[] = []
  newExpense: IExpense = { id: '', title: '', amount: 0, date: '', category: '' };
  chart: any

  ngOnInit(): void {
    this.getAllExpenses()
  }

  getAllExpenses() {
    this.expensesService.getExpenses().subscribe((data: IExpense[]) => {
      this.expenses = data
      this.generateChart()
    })
  }

  addExpense() {
    this.expensesService.addExpenses(this.newExpense).subscribe((data: IExpense) => {
      this.expenses.push(data)
      this.newExpense = {
        id: '', title: '', amount: 0, date: '', category: ''
      }
    })
  }

  updateExpense(expense: IExpense) {
    this.expensesService.updateExpense(expense).subscribe(() => {
      this.getAllExpenses()
    })
  }

  deleteExpense(id: string) {
    this.expensesService.deleteExpense(id).subscribe(() => {
      this.expenses = this.expenses.filter((expense) => expense.id !== id)
    })
  }

  generateChart() {
    const categories = this.expenses.reduce((acc: {[key: string]: number}, expense: IExpense) => {
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
