import { Component, OnInit } from '@angular/core';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-deliverypolicy',
  templateUrl: './delivery-policy.component.html',
  styleUrls: ['./delivery-policy.component.css']
})
export class DeliveryPolicyComponent implements OnInit {

  constructor(private metaService: MetaService) { }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/refund-policy', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

}
