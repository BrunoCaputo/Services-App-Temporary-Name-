import { Service } from "./../utils/service";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(value: Service[], filterBy: string): Service[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy
      ? value.filter(
          (service: Service) =>
            service.name.toLocaleLowerCase().indexOf(filterBy) !== -1
        )
      : value;
  }
}
