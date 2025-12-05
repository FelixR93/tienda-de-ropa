import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader-component.html',
  styleUrls: ['./loader-component.scss'],
  imports: [CommonModule],
})
export class LoaderComponent {}
