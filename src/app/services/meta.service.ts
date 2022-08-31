import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  
  constructor(private title:Title, private meta:Meta) { }
  updateMeta(url:any, subIds:any){
    let default_meta = this.meta_seo.filter(d => d.url === '/default')[0];
    if(url=='/'){
      let meta_tags = this.meta_seo.filter(d=> d.url === url)[0];
      this.title.setTitle(meta_tags.mTitle);
      this.meta.updateTag({ name: "keywords", content: meta_tags.mKeywords })
      this.meta.updateTag({ name: "description", content: meta_tags.mDescription })
    } else if (url == '/bz/category' && subIds !== null){   
      let meta_tags = this.meta_seo.filter(d => d.url === url).filter(d => d.ids == subIds)[0];
      if (meta_tags){
        this.title.setTitle(meta_tags.mTitle);
        this.meta.updateTag({ name: "keywords", content: meta_tags.mKeywords })
        this.meta.updateTag({ name: "description", content: meta_tags.mDescription })
      }else{
        this.title.setTitle(default_meta.mTitle);
        this.meta.updateTag({ name: "keywords", content: default_meta.mKeywords })
        this.meta.updateTag({ name: "description", content: default_meta.mDescription })
      }            
    }else{    
      this.title.setTitle(default_meta.mTitle);
      this.meta.updateTag({ name: "keywords", content: default_meta.mKeywords })
      this.meta.updateTag({ name: "description", content: default_meta.mDescription })
    }
  }

meta_seo:any = [
  {url: "/", ids:null, alias:"",   mTitle: " Seeds and Fertilizer Shop Near Me, Indian Vegetable Seeds Online", mKeywords: "fertilizer shop near me,indian vegetable seeds online,seeds and fertilizer shop near me", mDescription:"To buy Indian vegetable seeds online, Behtar Zindagi is a one stop solution for you.If you are looking for seeds and fertilizers shop near me, then just visit our website"},
  { url: "/bz/category", ids: 1, alias: "agro chemical", mTitle: "Buy Insecticides Online India - Behtar Zindagi", mKeywords: "buy insecticides online india", mDescription: "Behtar Zindagi is one of the online platform from where you can buy insecticides online India which is used to prevent crops from insect and doesn't harm the quality of crops." },
  { url: "/bz/category", ids: 4, alias: "Machinary", mTitle: "Agricultural Equipment Manufacturers | Agriculture Fertilizer Shop Near Me", mKeywords: "agricultural equipment manufacturers,agriculture fertilizer shop near me", mDescription: "Behtar Zindagi is one of the leading agricultural equipment manufacturers in India which is widely recommended by farmers for organic farming. For any query you can surf an agriculture fertilizer shop near me on google" },
  { url: "/bz/category", ids: 5, alias: "Seeds", mTitle: "Buy Plant, Vegetable, Cotton Seeds Online, Buy Seeds Online in India", mKeywords: "Buy Plant Seeds Online,Buy Seeds Online in India,Buy vegetable Seeds Online,Cotton Seeds Online", mDescription: "At Behtar Zindagi, you can buy seeds online in India. To buy plant, vegetable, cotton seeds online you can visit our website and can place orders for the same." },
  { url: "/default", ids: null, alias: "", mTitle: "Behtar Zindagi, From Seeds to Market | Online marketplace for agriculture", mKeywords: "Farmer Product,agricultural products, machinery, equipment, poultry, Farmers Stop, insecticide, fungicides, herbicides, bactericides, pesticides, fertilizers", mDescription: "Buy online seeds, agro tools and agro chemicals like vegetables seeds, shade nets, watering spray, nursery items, Cash Crop, Cattle Feed Supplements, Dairy, Drone, Farm Equipments, Field Crop, Fishery Products Flower Bulb Seeds, Flower Seeds, Fodder Seed, Fruit Seeds, Fungicides, Garden Tools, Gardening Equipments, Gardening Kit, Gold Loan, Harvesting Machines, Harvesting Tools, Herbicides, Insecticides, Inverter/Battery, Irrigation Equipments, Kitchen Garden Seeds, Loan Against Old Tractor Loan Against Property, Manures, Mobile Starter, New Tractor Loan, Oil Seed, Old Tractor, Old Tractor Loan, Organics, Personal Loan, Plant Protections, Plants, Pots & Planters, Poultry products, Pulses, Safety Products, Seeds, Sell Tractor, Solar, Sowing Equipments Spray Pumps, Tarpaulins, Tractor, Vegetable Seeds, Water Pumps" },
  ]

}
