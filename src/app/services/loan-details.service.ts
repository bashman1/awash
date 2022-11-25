import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoanDetailsService {

  private rows = [
    {
      'id':'1',
      'name':'karanzi',
      'ref_no':'2144',
      'amount_paid':'50',
      'amount_due':'10000',
      'total_amount':'23000'
    },
    {
      'id':'2',
      'name':'John',
      'ref_no':'2144',
      'amount_paid':'50',
      'amount_due':'10000',
      'total_amount':'23000'
    }
  ]

  constructor() { }

    //get all loans
    getAllLoans(){
      return [...this.rows];
    }
  
    
  //get one loan
  getLoan(loanId: string){
    return {
      ...this.rows.find(loan => {
      return loan.id === loanId;
    })
  };
  
  } 
}
