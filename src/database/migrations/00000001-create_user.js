'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Tokens", deps: []
 * createTable "Users", deps: [Tokens]
 *
 **/

var info = {
    "revision": 1,
    "name": "create-user",
    "created": "2021-04-06T18:37:22.621Z",
    "comment": ""
};

var migrationCommands = [

    {
        fn: "createTable",
        params: [
            "Tokens",
            {
                "id": {
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false,
                    "type": Sequelize.INTEGER
                },
                "token": {
                    "allowNull": true,
                    "type": Sequelize.TEXT
                },
                "refreshtoken": {
                    "allowNull": true,
                    "type": Sequelize.TEXT
                },
                "verifier": {
                    "allowNull": true,
                    "type": Sequelize.TEXT
                },
                "redirect": {
                    "allowNull": true,
                    "type": Sequelize.TEXT
                },
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    },

    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "primaryKey": true,
                    "allowNull": false,
                    "type": Sequelize.UUID
                },
                "email": {
                    "allowNull": false,
                    "type": Sequelize.STRING
                },
                "pass": {
                    "allowNull": false,
                    "type": Sequelize.TEXT
                },
                "verifCode": {
                    "allowNull": true,
                    "type": Sequelize.STRING
                },
                "VerifAttemptCount": {
                    "allowNull": true,
                    "type": Sequelize.INTEGER
                },
                "tokensId": {
                    "onDelete": "SET NULL",
                    "onUpdate": "CASCADE",
                    "references": {
                        "model": "Tokens",
                        "key": "id"
                    },
                    "allowNull": true,
                    "type": Sequelize.INTEGER
                },
                "createdAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "allowNull": false,
                    "type": Sequelize.DATE
                }
            },
            {}
        ]
    }
];

var rollbackCommands = [{
        fn: "dropTable",
        params: ["Users"]
    },
    {
        fn: "dropTable",
        params: ["Tokens"]
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
