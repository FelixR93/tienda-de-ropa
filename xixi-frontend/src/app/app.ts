import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

import { NavbarComponent } from './shared/navbar-component/navbar-component';
import { LoaderComponent } from './shared/loader-component/loader-component';
import { FooterComponent } from './shared/footer-component/footer-component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [
    CommonModule,      // para *ngIf, *ngFor, etc.
    RouterOutlet,
    RouterModule,
    NavbarComponent,
    LoaderComponent,
    FooterComponent,
  ],
})
export class App {
  loading = false;
}
