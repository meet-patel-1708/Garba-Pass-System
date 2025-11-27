import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavLink {
  id: string;
  label: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  activeLink = 'home';

  navLinks: NavLink[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'buy', label: 'Buy Pass', href: '/buy-pass' },
    { id: 'mypass', label: 'My Pass', href: '/view-pass' },
    { id: 'verify', label: 'Verify', href: '/verify-pass' },
    { id: 'logout',label:'Logout',href:'/login'}
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  setActiveLink(linkId: string) {
    this.activeLink = linkId;
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}