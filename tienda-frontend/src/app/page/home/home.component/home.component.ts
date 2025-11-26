import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink], // mantenlo solo si usas [routerLink] en el HTML
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // corregido
})
export class HomeComponent {}
