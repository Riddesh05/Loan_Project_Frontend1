import { Component } from '@angular/core';
import { CustomerSidebar } from '../../../../core/theme/customer-sidebar/customer-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterOutlet, CustomerSidebar],
  selector: 'app-customer-layout',
  styleUrl: './customer-layout.css',
  templateUrl: './customer-layout.html',
})
export class CustomerLayout {}
