'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "VerifAttemptCount" from table "Users"
 * addColumn "verifAttemptCount" to table "Users"
 *
 **/

var info = {
    "revision": 2,
    "name": "rename_verif_attempt_count",
    "created": "2021-07-24T21:33:41.530Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["Users", "VerifAttemptCount"]
    },
    {
        fn: "addColumn",
        params: [
            "Users",
            "verifAttemptCount",
            {
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    }
];

var rollbackCommands = [{
        fn: "removeColumn",
        params: ["Users", "verifAttemptCount"]
    },
    {
        fn: "addColumn",
        params: [
            "Users",
            "VerifAttemptCount",
            {
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    down: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < rollbackCommands.length)
                {
                    let command = rollbackCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
