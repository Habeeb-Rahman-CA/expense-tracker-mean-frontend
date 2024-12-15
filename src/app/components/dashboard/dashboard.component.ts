import { Component } from '@angular/core';
import { ExpensesComponent } from "../expenses/expenses.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ExpensesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
