import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.css'],
  
})
export class OrdersDashboardComponent implements OnInit {
  orders = [
    { id: 1, customerName: 'John Doe', status: 'Pending' },
    { id: 2, customerName: 'Jane Smith', status: 'Completed' },
    { id: 3, customerName: 'Alice Johnson', status: 'Shipped' },
  ];

  displayedColumns: string[] = ['id', 'customerName', 'status', 'actions'];

  ngOnInit(): void {}
}
