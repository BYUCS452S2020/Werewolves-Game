module.exports = {
    Werewolves: [
        {
            name: "Alpha Werewolf",
            ability: "kill_revenge",
            ability_time: 2,
            side: -1
        },
        {
            name: "Werewolf",
            ability: "kill",
            ability_time: 0,
            side: -1
        },

    ],
    Villager: {
        name: "Villager",
        ability: null,
        ability_time: 1,
        side: 0
    },
    SpecialCharacters: [
        {
            name: "Witch",
            ability: "save_posion",
            ability_time: 0,
            side: 1
        },
        {
            name: "Seer",
            ability: "test",
            ability_time: 0,
            side: 1
        },
        {
            name: "Hunter",
            ability: "revenge",
            ability_time: 1,
            side: 1
        },
        {
            name: "Knight",
            ability: "challenge",
            ability_time: 1,
            side: 1
        },

    ]
}

