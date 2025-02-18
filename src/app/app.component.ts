import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { LoginComponent } from "./auth/pages/login/login.component";

@Component({
  selector: 'app-root',
  imports: [LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  title = 'gestifysolution-panel';

  ngOnInit(): void {
    initFlowbite();
  }
}
