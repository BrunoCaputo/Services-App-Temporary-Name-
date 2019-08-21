export class User {
    constructor(
        public id?: String,
        public name?: String,
        public email?: String,
        public photoURL?: String) {}

    getData(): object {
        const data = {
            id: this.id,
            name: this.name,
            email: this.email,
            photoURL: this.photoURL
        };
        
        return data;
    }
}