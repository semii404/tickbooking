import { Component } from '@angular/core';
import { Observable } from 'rxjs'; 

import { DataserviceService } from 'src/app/shared/dataservice.service';
import { Details } from 'src/app/interfaces/pocke.inter';
import { NgModel,NgForm} from '@angular/forms'



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  numberOfTickets: number = 0;
  
  bookedtick: number[]=[];

 items:Observable<Details[]>; 

 public map=new Map();
 listshow:boolean=false;
 public totalavailbale=0;
  genratingseats:Details[] = [];
  sittingrowcount: number[]= [];


  constructor(public ds:DataserviceService){

    //calculating emty seats availble in coach
   const temp = this.ds.getAll();
   this.items=temp;
    temp.forEach((data)=>
    { 
      var ct=0;
      
      data.forEach((item)=> {
        this.map.set(item.seatNo,item.isBooked);
        if(!item.isBooked) { ct++; }
    }); 

    var cttr=0;
    this.totalavailbale=ct;

    this.map = new Map([...this.map.entries()].sort((a, b) => a[0]-b[0])); 


    for(let i=0; i<12; ++i){
      this.sittingrowcount[i]=0;
    }

    //counting available seats in one row
    for(let j=0; j<80; j++){
      if(!this.map.get(j+1)){
      this.sittingrowcount[Math.floor(j/7)]++;
      }
    }
  });

    
   
  //code to genrate 80  seats in DB
   for (let index = 1; index < 81; index++) {
    const data: Details = {
      seatNo:index,
      isBooked:false,};
      this.genratingseats.push(data);
  }
  }
  
  

  onSubmit(form: NgForm) {
  let bookedtickets = [];
  let done= false;

    //this loop for book in one row
    for(let k=0; k<12; k++){
      if(done) {break;}

      if(this.sittingrowcount[k] >= form.value['numberOfTickets']){
        var kcal=k*7;
            
      for(let l=kcal; l<kcal+7; l++){
          if(bookedtickets.length == form.value['numberOfTickets']){
            bookedtickets.forEach((val)=>val.isBooked = true);
            this.ds.booktickets(bookedtickets);        
            done=true; 
            this.bookedtick=bookedtickets.map((val)=> {return val.seatNo});
            this.listshow=true;
            break 
          }


          if(!this.map.get(l+1)) {
            bookedtickets.push(this.genratingseats[l]);  
          }
       }
      }
    }

    //this is for booking nearest seats 

    if(!done)  {
      this.sittingrowcount.sort();
      this.sittingrowcount.reverse();
      for(let i=0; i<12; i++){
        if(done) {break} 
        var kcal2=i*7;
        for(let l=kcal2; l<kcal2+7; l++){
          if(bookedtickets.length == form.value['numberOfTickets']){
           bookedtickets.forEach((val)=>val.isBooked = true);
           this.ds.booktickets(bookedtickets);  
           this.bookedtick=bookedtickets.map((val)=> {return val.seatNo});      
            done=true;
            this.listshow=true;
             break 
          }
          if(!this.map.get(l+1)) { 
            bookedtickets.push(this.genratingseats[l]);
          }
      }
    }
  }

  
  

  }
 



gencoach(){
  for (let index = 1; index < 81; index++) {
    const data: Details = {
      seatNo:index,
      isBooked:false,};
      this.genratingseats.push(data);
  }
  this.ds.create(this.genratingseats);
}


  

}
