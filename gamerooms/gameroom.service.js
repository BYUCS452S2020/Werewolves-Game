const db = require('_helpers/db');
const Gameroom = db.Gameroom;

module.exports = {
    create,
    getAll,
    getById,
    delete: _delete,
};

async function getAll() {
    return await Gameroom.find();
}

async function getById(id) {
    return await Gameroom.findById(id);
}

async function create(param) {
    console.log("CREATING");
    await Gameroom.updateOne(
        { name: param.name },
        { $set: { ...param } },
        { upsert: true });
}


async function _delete(name) {
    await Gameroom.remove({name: name});
}