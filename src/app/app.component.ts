import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SingInComponent } from "./auth/pages/sing-in/sing-in.component";
import { SingUpComponent } from "./auth/pages/sing-up/sing-up.component";

@Component({
  selector: 'app-root',
  imports: [SingInComponent, SingUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  title = 'gestifysolution-panel';

  ngOnInit(): void {
    initFlowbite();
  }
}
