import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { SearchFilterService } from '../core/search-filter.service';

/**
 * Sets the search filter.
 */
@Component({
  selector: 'app-explore-bottom-sheet',
  templateUrl: './explore-bottom-sheet.component.html',
  styleUrls: ['./explore-bottom-sheet.component.css']
})
export class ExploreBottomSheetComponent {
  filter: String;

  /**
   * Default constructor.
   * @param bottomSheetRef - Instance of MatBottomSheetRef<ExploreBottomSheetComponent>.
   * @param searchFilter - Instance of SearchFilterService.
   */
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ExploreBottomSheetComponent>,
    private searchFilter: SearchFilterService
  ) {
    this.filter = this.searchFilter.getFilter();
  }

  setFilter(filter: string): void {
    this.searchFilter.setFilter(filter);
    this.bottomSheetRef.dismiss();
  }
}
