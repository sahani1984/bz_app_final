import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private metaService:MetaService) { }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/about', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

}
