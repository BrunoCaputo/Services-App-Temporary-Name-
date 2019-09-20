import { Service } from './../utils/service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchFilterService {

  private filter: String = 'tudo:';
  private dataSource = new BehaviorSubject(this.filter);
  filtered = this.dataSource.asObservable();

  constructor() {}

  public setFitler(filter: String) {
    this.filter = filter;
    console.log(this.filter);
  }

  public getFilter(): String {
    return this.filter;
  }
}
