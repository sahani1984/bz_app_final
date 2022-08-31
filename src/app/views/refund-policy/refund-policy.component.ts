import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-refundpolicy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.css']
})
export class RefundPolicyComponent implements OnInit {

  constructor(private metaService:MetaService) { }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/refund-policy', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

}
