const DB = require(`${global.SRC_DIR}db`);

class MainModel {
    constructor(schemeName, scheme) {

        this.schemeName = schemeName;
        this.scheme = scheme;
        this.Model = DB.model(this.schemeName, this.scheme);
    }

    find(attributes = {}, cb, cbError = () => {/**/}) {
        this.Model.find(attributes)
            .populate('user')
            .then(cb)
            .catch((error) => {
                cbError(error);
                console.lol('red', `DB error: [${this.schemeName}][find]`, error);
            });
    }

    async findOne(attributes = {}, cb, cbError = () => {/**/}) {
        const record = await this.Model.findOne(attributes)
            .populate('usersGames')
            .then(cb)
            .catch((error) => {
                cbError(error);
                console.lol('red', `DB error: [${this.schemeName}][findOne]`, error);
            });

        return record;
    }

    async save(attributes) {
        const newModel = new this.Model(attributes);

        const result = await newModel.save()
            .then((data) => ({
                status: 'success',
                error: null,
                data,
            }))
            .catch((error) => {
                console.lol('red', `DB error: [${this.schemeName}][save]`, error.message);

                return {
                    status: 'error',
                    error,
                    data: null,
                };
            });

        return result;
    }

    dropCollection(cb) {
        DB.connection.db.dropCollection(this.schemeName, cb);

    }
}

module.exports = MainModel;
