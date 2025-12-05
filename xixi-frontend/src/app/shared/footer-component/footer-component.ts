// ------------------------------------------------------
// Footer XI-XI
// - Información básica de la tienda
// - Enlaces rápidos
// - Redes sociales
// ------------------------------------------------------
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer-component.html',
  styleUrls: ['./footer-component.scss'],
  imports: [CommonModule, RouterModule],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  contactEmail = 'contacto@xixi-store.com';
  contactPhone = '+593 96 235 589';
}
