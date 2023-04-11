const db = require("../config/db");

class Users {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    save() {
        const query = `INSERT INTO users ( name, email, password ) VALUES ('${this.name}', '${this.email}', '${this.password}');`

        return db.execute(query);
    }

    static findAll() {}
}

module.exports = Users;