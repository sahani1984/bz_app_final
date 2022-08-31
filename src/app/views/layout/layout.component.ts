import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  private lastRouteUrl: string[] = []
  constructor(private router: Router) {
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('top').scrollTop = 0;
  }

}
