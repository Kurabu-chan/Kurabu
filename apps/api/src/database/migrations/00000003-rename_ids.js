"use strict";

var Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn "VerifAttemptCount" from table "Users"
 * addColumn "verifAttemptCount" to table "Users"
 *
 **/

var info = {
    revision: 3,
    name: "rename_ids",
    created: "2022-01-7T00:16:00.530Z",
    comment: "",
};

var migrationCommands = [{
        fn: "renameColumn",
        params: ["Users", "id", "userId"],
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "tokensId",
            {
                "allowNull": true,
                "type": Sequelize.INTEGER,
                "references": undefined
            }
        ]
    },
    {
        fn: "renameColumn",
        params: ["Tokens", "id", "tokensId"],
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "tokensId",
            {
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "Tokens",
                    "key": "tokensId"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    }
];

var rollbackCommands = [{
        fn: "changeColumn",
        params: [
            "Users",
            "tokensId",
            {
                "allowNull": true,
                "type": Sequelize.INTEGER,
                "references": undefined
            }
        ]
    },
    {
        fn: "renameColumn",
        params: ["Tokens", "tokensId", "id"],
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "tokensId",
            {
                "onDelete": "SET NULL",
                "onUpdate": "CASCADE",
                "references": {
                    "model": "Tokens",
                    "key": "id"
                },
                "allowNull": true,
                "type": Sequelize.INTEGER
            }
        ]
    },
    {
        fn: "renameColumn",
        params: ["Users", "userId", "id"],
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize) {
        queryInterface = queryInterface.context;
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length) {
                    let command = migrationCommands[index];
                    console.log("[#" + index + "] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn]
                        .apply(queryInterface, command.params)
                        .then(next, reject);
                } else resolve();
            }
            next();
        });
    },
    down: function(queryInterface, Sequelize) {
        queryInterface = queryInterface.context;
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < rollbackCommands.length) {
                    let command = rollbackCommands[index];
                    console.log("[#" + index + "] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn]
                        .apply(queryInterface, command.params)
                        .then(next, reject);
                } else resolve();
            }
            next();
        });
    },
    info: info,
};