﻿/* database.js
 * Purpose: Database functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with database functions located under lifeStory.db

(function(lifeStory, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by database but is undefined.';
    }

    var dbLibrary = lifeStory.db = {};

    var db;

    function sqlErrorHandler(transaction, error)
    {
        alert('SQL error: ' + error.message);
        console.error(error.message, error, transaction);
    }

    function initializationError(transaction, error)
    {
        localStorage.setItem('dbInitializationError', 'true');
        localStorage.setItem('dbInitialized', 'false');

        sqlErrorHandler(transaction, error);
    }

    function createRaceTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS race ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR(20) NOT NULL UNIQUE' +
            ');',
            null,
            null,
            initializationError);
    }

    function createClassTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS class ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR(20) NOT NULL UNIQUE' +
            ');',
            null,
            null,
            initializationError);
    }

    function createCharacterTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS character ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'race_id INTEGER, ' +
                'class_id INTEGER, ' +
                'name VARCHAR(50) NOT NULL, ' +
                'living BOOLEAN NOT NULL DEFAULT 1,' +
                'details TEXT, ' +
                'FOREIGN KEY (race_id) REFERENCES race (id),' +
                'FOREIGN KEY (class_id) REFERENCES class (id)' +
            ');',
            null,
            null,
            initializationError);
    }

    function createEventTypeTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS eventType ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR(20) NOT NULL UNIQUE' +
            ');',
            null,
            null,
            initializationError);
    }

    function createEventTable(transaction)
    {

        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS event ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
                'eventType_id INTEGER NOT NULL, ' +
                'characterCount INTEGER, ' +
                'date DATE NOT NULL DEFAULT CURRENT_DATE, ' +
                'xp INTEGER, ' +
                'description TEXT,' +
                'FOREIGN KEY (eventType_id) REFERENCES eventType (id)' +
            ');',
            null,
            null,
            initializationError);
    }

    function createEventDetailTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS eventDetail ' +
            '(' +
                'id INTEGER NOT NULL, ' +
                'event_id INTEGER NOT NULL, ' +
                'name VARCHAR(60) NOT NULL, ' +
                'creatureCount INTEGER, ' +
                'PRIMARY KEY (id, event_id), ' +
                'FOREIGN KEY (event_id) REFERENCES event (id)' +
            ');',
            null,
            null,
            initializationError);
    }

    function createCharacterEventTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS characterEvent ' +
            '(' +
                'character_id INTEGER NOT NULL, ' +
                'event_id INTEGER NOT NULL,' +
                'PRIMARY KEY (character_id, event_id),' +
                'FOREIGN KEY (event_id) REFERENCES event (id),' +
                'FOREIGN KEY (character_id) REFERENCES character (id)' +
            ');',
            null,
            null,
            initializationError);
    }

    // Insert default class records
    function insertDefaultClasses(transaction)
    {
        var defaultClasses = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
            'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

        defaultClasses.forEach(function(element)
        {
            transaction.executeSql('INSERT OR IGNORE INTO class (name) VALUES (?);',
                [element],
                null,
                initializationError);
        });
    }

    // Insert default race records
    function insertDefaultRaces(transaction)
    {
        var names = ['Dwarf', 'Human', 'Halfling', 'Elf', 'Half-elf',
            'Half-orc', 'Gnome', 'Dragonborn', 'Tiefling'];

        names.forEach(function(element)
        {
            transaction.executeSql(
                'INSERT OR IGNORE INTO race (name) VALUES (?);',
                [element],
                null,
                initializationError);
        });
    }

    // Insert event type records
    function insertEventTypes(transaction)
    {
        var names = ['Combat', 'Non-Combat', 'Resurrect', 'Death'];

        names.forEach(function (element)
        {
            transaction.executeSql(
                'INSERT OR IGNORE INTO eventType (name) VALUES (?);',
                [element],
                null,
                initializationError);
        });
    }

    // Creates the database tables and inserts default records
    function initializeTables(database)
    {
        database.transaction(function createTables(tx)
        {
            createRaceTable(tx);
            createClassTable(tx);
            createCharacterTable(tx);
            createEventTypeTable(tx);
            createEventTable(tx);
            createEventDetailTable(tx);
            createCharacterEventTable(tx);

            insertDefaultClasses(tx);
            insertDefaultRaces(tx);
            insertEventTypes(tx);
        });

        if (localStorage.getItem('dbInitializationError') !== 'true')
        {
            localStorage.setItem('dbInitialized', 'true');
        }
        else
        {
            // dbInitialized is set to false by initializationError so no need to do that here.
            // Remove this so future runs don't incorrectly believe an error occured
            localStorage.removeItem('dbInitializationError');
        }
    }

    // Initializes the database
    function initializeDb()
    {
        if (window.openDatabase === undefined)
        {
            alert('WebSQL isn\'t supported in this browser.');

            // Dummy database object which prevents errors in browsers without WebSQL support
            db =
            {
                readTransaction: function ()
                {
                    console.error('WebSQL isn\'t supported in this browser.');
                },
                transaction: function ()
                {
                    console.error('WebSQL isn\'t supported in this browser.');
                }
            };
        }
        else
        {
            db = window.openDatabase('LifeStory', '1.0', 'Life Story Database',
                2 * 1024 * 1024, initializeTables);

            // Ensure the database has been initialized as openDatabase will only call
            // initializeDatabase if the database doesn't exist.
            // The database can exist without being initialized if lifeStory.db.dropAllTables is used
            if (localStorage.getItem('dbInitialized') !== 'true')
            {
                initializeTables(db);
            }
        }
    }

    // Returns the database for the application
    dbLibrary.getDb = function getDb()
    {
        // Initialize the database if it hasn't been
        if (db === undefined || localStorage.getItem('dbInitialized') !== 'true')
        {
            initializeDb();
        }

        // return the database
        return db;
    };

    lifeStory.db.addRace = function addRace(race, successCallback, failureCallback, callbackData)
    {
        /// <summary>
        ///     Saves the race to the database and calls the corresponding success or failure callback
        /// </summary>
        /// <param name="race" type="lifeStory.Race">Race to add to the database</param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful save
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     Optional, function to be called on failed save
        /// </param>
        /// <param name="callbackData" type="object">
        ///     Optional, additional data to pass to the success callback
        /// </param>

        if (!(race instanceof lifeStory.Race))
        {
            throw 'race parameter to addRace must be an instance of lifeStory.Race';
        }

        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'INSERT OR IGNORE INTO race (name) VALUES (?);',
                [race.name],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    // Saves the CharacterClass to the database and calls the corresponding success or failure callback
    dbLibrary.addClass = function addClass(characterClass, successCallback, failureCallback, callbackData)
    {
        if (!(characterClass instanceof lifeStory.CharacterClass))
        {
            throw 'characterClass parameter to addClass must be an instance of lifeStory.CharacterClass';
        }

        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql('INSERT OR IGNORE INTO class (name) VALUES (?);',
                [characterClass.name],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    // Saves the Character into the database and calls the corresponding success or failure callback
    dbLibrary.addCharacter = function insertCharacter(character, successCallback, failureCallback)
    {
        if (!(character instanceof lifeStory.Character))
        {
            throw 'character parameter to addCharacter must be an instance of lifeStory.Character';
        }

        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'INSERT INTO character ' +
                    '(name, race_id, class_id, details, living) ' +
                'VALUES (?, ?, ?, ?, ?)',
                [
                    character.name, character.raceId, character.classId,
                    character.details, character.living
                ],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    dbLibrary.updateCharacter = function insertCharacter(character, successCallback, failureCallback)
    {
        if (!(character instanceof lifeStory.Character))
        {
            throw 'character parameter to updateCharacter must be an instance of lifeStory.Character';
        }

        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'UPDATE character' +
                'SET name = ?, race_id = ?, class_id = ?, details = ?, living = ? ' +
                'WHERE id = ?',
                [
                    character.name, character.raceId, character.classId,
                    character.details, character.living, localStorage.getItem('currentCharacter') // TODO: get current character id properly
                ],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    // Gets the character count and passes it as the sole argument to callBack
    dbLibrary.getCharacterCount = function (callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT COUNT() AS count ' +
                'FROM character',
                null,
                function (transaction, resultSet)
                {
                    if (resultSet.rows.length > 0)
                    {
                        callback(resultSet.rows.item(0).count);
                    }
                    else
                    {
                        callback(0);
                    }
                },
                sqlErrorHandler);
        });
    };

    // Gets the classes and passes them as the sole argument to callBack
    dbLibrary.getClasses = function (callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT *' +
                'FROM class',
                null,
                function (transaction, resultSet)
                {
                    lifeStory.util.convertToSelectEntrys(resultSet, 'name', callback);
                },
                sqlErrorHandler);
        });
    };

    // Gets the races and passes them as the sole argument to callBack
    dbLibrary.getRaces = function (callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT *' +
                'FROM race',
                null,
                function(transaction, resultSet)
                {
                    lifeStory.util.convertToSelectEntrys(resultSet, 'name', callback);
                },
                sqlErrorHandler);
        });
    };

    // Clears the character table
    dbLibrary.clearCharacterTable = function ()
    {
        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('DROP TABLE IF EXISTS character', null, null, sqlErrorHandler);

            createCharacterTable(tx);
        });
    };

    // Drops all tables, used for resetting the database
    // Pass 'danger' as an argument to confirm the action
    dbLibrary.dropAllTables = function()
    {
        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('DROP TABLE IF EXISTS character', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS characterEvent', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS class', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS event', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS eventType', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS eventDetail', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS race', null, null, sqlErrorHandler);

            localStorage.setItem('dbInitialized', 'false');
        });
    };

})(window.lifeStory);