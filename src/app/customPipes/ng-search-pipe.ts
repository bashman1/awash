import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
@Injectable()
export class searchFilter{
  private filteredItems: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private arrayToSearch: any[];
  private _onDestroy = new Subject<void>();
  private searchField: FormControl;
  private searchKeyWord: any;
  private obj : any = null;
  private searchResults:any[]=[];
  multiSearch(arrayToSearch:any[],searchFields: any[], searchKeyWord:any){
    this.searchResults=[];
    this.arrayToSearch = arrayToSearch;
    this.searchKeyWord = searchKeyWord;
    for(let i=0;i<searchFields.length;i++){
      let searchResults  = this.singleSearch(arrayToSearch,searchFields[i],searchKeyWord);
      searchResults.forEach(val=>{
        this.searchResults.push(val);
      });
      this.obj = this.searchResults;
    }
    return this.obj;
  }
  singleSearch(arrayToSearch:any[],searchField: any, searchKeyWord:any){
    this.arrayToSearch = arrayToSearch;
    this.searchField = searchField;
    this.searchKeyWord = searchKeyWord;
    this.filteredItems.next(this.arrayToSearch.slice());
    this.filterItems(this.searchField, this.searchKeyWord);
    return this.obj;
  }

  filterItems(searchField: any, searchKeyWord :any): any {
    let controller = this;
    if (!this.arrayToSearch) {
      return;
    }
    // get the search keyword from the search field
    let search = searchKeyWord;
    if (!search) {
      this.filteredItems.next(this.arrayToSearch.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // let field = "productName"
    this.filteredItems.next(
       this.arrayToSearch.filter(_item => _item[searchField].toLowerCase().indexOf(search) > -1)
    );
     this.filteredItems.subscribe((val)=>{
      controller.obj = val;
    })

    }
    //On Destruction of the Component, Also Destroy the Elements of the select
    ngOnDestroy() {
      this._onDestroy.next();
      this._onDestroy.complete();
    }

}
