/**
 * Formats the phone number to save in the database.
 * @param phone - The phone number that will be formatted.
 */
export function formatPhone(phone: String) {
    return `(${ phone.substr(0, 2) }) ${ phone.substr(2, 5) }-${ phone.substr(7, 4) }`;
}

/**
 * Removes the format from the phone number as in formatPhone.
 * @param phone - The phone number to have its formatation removed.
 */
export function unformatPhone(phone: String) {
    return phone.replace(/[^0-9]/g, '');
}
