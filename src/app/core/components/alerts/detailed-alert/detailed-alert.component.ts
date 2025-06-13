import { Component, ContentChild, contentChild, input, OnInit } from '@angular/core';
import { AlertDescriptionComponent } from '../components/alert-description/alert-description.component';
import { AlertIconComponent } from '../components/alert-icon/alert-icon.component';
import { AlertTitleComponent } from '../components/alert-title/alert-title.component';
import { AlertActionsComponent } from '../components/alert-actions/alert-actions.component';

@Component({
  selector: 'app-detailed-alert',
  imports: [],
  templateUrl: './detailed-alert.component.html',
  styleUrl: './detailed-alert.component.css'
})
export class DetailedAlertComponent implements OnInit {
  
  @ContentChild(AlertIconComponent) icon?: AlertIconComponent;
  @ContentChild(AlertTitleComponent) title?: AlertTitleComponent;
  @ContentChild(AlertDescriptionComponent) description?: AlertDescriptionComponent;
  @ContentChild(AlertActionsComponent) actions?: AlertActionsComponent;

  ngOnInit(): void {
    
  }
  
  public isVisible = input<boolean>(false);

}
