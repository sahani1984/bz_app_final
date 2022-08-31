import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private metaService:MetaService) { }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/privacy-policy', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 

}
