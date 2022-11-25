import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trial',
  templateUrl: './trial.page.html',
  styleUrls: ['./trial.page.scss'],
})
export class TrialPage implements OnInit {
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  budget:any;
  

  constructor() { }

  ngOnInit() {
  }

  format(valString) {
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
};

unFormat(val) {
  if (!val) {
      return '';
  }
  val = val.replace(/^0+/, '');

  if (this.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
  } else {
      return val.replace(/\./g, '');
  }
};

}
