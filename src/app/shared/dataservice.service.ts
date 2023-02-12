import { Injectable } from '@angular/core';
import { Firestore,collectionData,docData,collection,deleteDoc,addDoc,doc,collectionGroup,updateDoc, CollectionReference, DocumentData, setDoc } from '@angular/fire/firestore';
import { async } from '@firebase/util';
import { Observable } from 'rxjs';
import { Details } from '../interfaces/pocke.inter';






@Injectable({
  providedIn: 'root'
})


export class DataserviceService {
  private pdata:CollectionReference<DocumentData>;
  private userSubCollection = collection(this.firestore, `ticketsystem/trainno1234/coachname(A1)`);
    
  constructor(private firestore: Firestore){ 
    this.pdata = collection(firestore,'hello');
    
    
  //this.pdata = doc(this.firestore, 'pokemon', );
  }
  
  getAll() {
    return collectionData(this.userSubCollection, {
      idField: 'id',
    }) as Observable<Details[]>;
  }

  // get(id: string) {
  //   const pdataref = doc(this.firestore, `pokemon/${id}`);
  //   return docData(pdataref, { idField: 'id' });
  // }

  create(details: Details[]){
    
    return  details.forEach( async(data)=>{await setDoc(doc(this.userSubCollection, `${data.seatNo}`),data)})
    
  }

  booktickets(tickdata:Details[]){
    return tickdata.forEach(async(dd)=>{await setDoc(doc(this.userSubCollection, `${dd.seatNo}`),dd)})
  }

  
  



  // update(pokemon: Pokemon) {
  //   const pdataref = doc(
  //     this.firestore,
  //     `pokemon/${pokemon.id}`
  //   );
  //   return updateDoc(pdataref, { ...pokemon });
  // }

  // delete(id: string) {
  //   const pdataref = doc(this.firestore, `pokemon/${id}`);
  //   return deleteDoc(pdataref);
  // }

  
}
