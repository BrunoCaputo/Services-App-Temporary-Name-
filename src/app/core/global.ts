export function formatPhone(phone: String) {
    return `(${ phone.substr(0, 2) }) ${ phone.substr(2, 5) }-${ phone.substr(7, 4) }`;
}

export function unformatPhone(phone: String) {
    return phone.replace(/[^0-9]/g, '');
}