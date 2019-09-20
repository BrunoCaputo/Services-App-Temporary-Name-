import { Pipe, PipeTransform } from '@angular/core';

import { User } from '../utils/user';
import { Service } from '../utils/service';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(value: Service[], content: [Map<String, User>, String]): Service[] {
    const users = content[0];
    const query = content[1] ? content[1].toLocaleLowerCase().trim() : '';

    if (query.length === 0) {
      return value;
    }

    const index = query.indexOf(':');

    const filter = index > 0 ? query.substr(0, index).trim() : '';
    let text = index > 0 ? query.substr(index + 1).trim() : query;

    switch (filter) {
      case 'nome':
        return value.filter((service) => service.name.toLocaleLowerCase().includes(text));
      case 'descrição':
        return value.filter((service) => service.description.toLocaleLowerCase().includes(text));
      case 'servidor':
        return value.filter((service) => {
          const provider = users.get(service.providerID);
          return provider.name.toLocaleLowerCase().includes(text);
        });
      default:
        if (filter !== 'tudo') {
          text = query;
        }

        return value.filter((service) => {
          const provider = users.get(service.providerID);

          return service.name.toLocaleLowerCase().includes(text)
            || service.description.toLocaleLowerCase().includes(text)
            || provider.name.toLocaleLowerCase().includes(text);
        });
    }
  }
}
