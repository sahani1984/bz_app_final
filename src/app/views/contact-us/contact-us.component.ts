import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-contactus',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  constructor(private metaService: MetaService) { }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/refund-policy', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

}
