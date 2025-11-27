import { Component } from '@angular/core';
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-home',
  imports: [FooterComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
