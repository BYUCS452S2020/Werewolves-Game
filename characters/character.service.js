const db = require('_helpers/db');
const Character = db.Character;

module.exports = {
    setup,
    getAll,
    getById,
    updateOne,
    delete: _delete,
    getByPriority
};


async function setup() {
    // console.log('in setup');
    let input = [AlphaWerewolf, Werewolf, Villager, Knight, Hunter, Witch, Seer];
    for (let i = 0; i < input.length; i++) {
        // console.log(input[i]);
        await Character.updateOne(
            { name: input[i].name },
            { $set: { ...input[i] } },
            { upsert: true });
    }
}

async function getAll() {
    return await Character.find();
}

async function getById(id) {
    return await Character.findById(id);
}

async function getByPriority(p) {
    return await Character.findById({priority: p});
}

async function updateOne(param) {

    await Character.updateOne(
        { name: param.name },
        { $set: { ...param } },
        { upsert: true });

}


async function _delete(id) {
    await Character.findByIdAndRemove(id);
}

const AlphaWerewolf = {
    name: "Alpha Werewolf",
    ability: "revenge",
    side: -1,
    priority: -1
}
const Werewolf = {
    name: "Werewolf",
    ability: "kill",
    side: -1,
    priority: -2
}

const Villager = {
    name: "Villager",
    ability: null,
    side: 0
}
const Knight = {
    name: "Knight",
    ability: "challenge",
    side: 1,
    ability_av: true,
    priority: 4
}
const Hunter = {
    name: "Hunter",
    ability: "revenge",
    side: 1,
    ability_av: true,
    priority: 3
}
const Witch = {
    name: "Witch",
    ability: "save_posion",
    side: 1,
    poison_av: true,
    potion_av: true,
    functioned: false,
    priority: 1
}
const Seer = {
    name: "Seer",
    ability: "test",
    side: 1,
    priority: 2
}
