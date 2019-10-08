/**
 * Represents a model for all services.
 */
export class Service {
    constructor(
        public id?: String,
        public name?: String,
        public description?: String,
        public phone?: String,
        public useEmail?: Boolean,
        public providerID?: String) {}

    getData(): object {
        const data = {
            id: this.id,
            name: this.name,
            description: this.description,
            phone: this.phone,
            useEmail: this.useEmail,
            providerID: this.providerID
        };

        return data;
    }
}
