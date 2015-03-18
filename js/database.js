/* database.js
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
                'name VARCHAR(50) NOT NULL, ' +
                'race_id INTEGER, ' +
                'class_id INTEGER, ' +
                'details TEXT, ' +
                'living BOOLEAN NOT NULL,' +
                'FOREIGN KEY (race_id) REFERENCES race (id),' +
                'FOREIGN KEY (class_id) REFERENCES class (id)' +
            ');',
            null,
            null,
            initializationError);
    }

    function creatEventTypeTable(transaction)
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
                'date DATE NOT NULL, ' +
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
                'detail_id INTEGER NOT NULL, ' + // TODO: Figure out how to make this auto increment
                'event_id INTEGER NOT NULL, ' +
                'eventName VARCHAR(60) NOT NULL, ' +
                'xp INTEGER, ' +
                'creatureCount INTEGER,' +
                'PRIMARY KEY (detail_id, event_id),' +
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
            creatEventTypeTable(tx);
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
            //alert('WebSQL isn\'t supported in this browser.');
            // TODO: Return dummy object that has all of the db functions?
            // Need to do something to prevent errors when WebSQL isn't supported
        }
        else
        {
            db = window.openDatabase('LifeStory', '1.0', 'Life Story Database',
                2 * 1024 * 1024, initializeTables);

            // Ensure the database has been initialized as openDatabase will only call
            // initializeDatabase if the database doesn't exist.
            // The database can exist without being initialized if dmLibrary.db.cleaDb is used
            if (localStorage.getItem('dbInitialized') !== 'true')
            {
                initializeTables(db);
            }

            return db;
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
    }

    // Saves the Race to the database and calls the corresponding success or failure callback
    dbLibrary.addRace = function addRace(race, successCallback, failureCallback)
    {
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
    }

    // Saves the CharacterClass to the database and calls the corresponding success or failure callback
    dbLibrary.addClass = function addClass(characterClass, successCallback, failureCallback)
    {
        if (!(characterClass instanceof lifeStory.CharacterClass))
        {
            throw 'characterClass parameter to addClass must be an instance of lifeStory.CharacterClass';
        }

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('INSERT OR IGNORE INTO class (name) VALUES (?);',
                [characterClass.name],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    }

    // Saves the Character into the database and calls the corresponding success or failure callback
    dbLibrary.insertCharacter = function insertCharacter(character, successCallback, failureCallback)
    {
        if (!(character instanceof lifeStory.Character))
        {
            throw 'character parameter to insertCharacter must be an instance of lifeStory.Character';
        }

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql(
                'INSERT INTO character ' +
                    '(name, race_id, class_Id, details, living) ' +
                'VALUES (?, ?, ?, ?, ?)',
                [
                    character.name, character.raceId, character.classId,
                    character.details, character.living
                ],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    }

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

    // Converts the values from a resultSet into and array of key value SelectEntrys
    // propertyName: the column name to pull the value from
    // callback: the function to call with the results
    function convertResultSetToSelectEntrys(transaction, resultSet, propertyName, callback)
    {
        var results = [];

        for (var i = 0; i < resultSet.rows.length; i++)
        {
            results[i] = new lifeStory.SelectEntry(resultSet.rows.item(i).id,
                resultSet.rows.item(i)[propertyName]);
        }

        callback(results);
    }

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
                    convertResultSetToSelectEntrys(transaction, resultSet, 'name', callback);
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
                    convertResultSetToSelectEntrys(transaction, resultSet, 'name', callback);
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

            createCharacterTable();
        });
    };

    // TODO: Just for debugging purposes. Pass in danger as the argument for it to work
    dbLibrary.dropAllTables = function(areYouSure)
    {
        if (areYouSure === 'danger')
        {
            dbLibrary.getDb().transaction(function (tx)
            {
                tx.executeSql('DROP TABLE IF EXISTS character', null, null, sqlErrorHandler);
                tx.executeSql('DROP TABLE IF EXISTS characterEvent', null, null, sqlErrorHandler);
                tx.executeSql('DROP TABLE IF EXISTS class', null, null, sqlErrorHandler);
                tx.executeSql('DROP TABLE IF EXISTS event', null, null, sqlErrorHandler);
                tx.executeSql('DROP TABLE IF EXISTS eventDetail', null, null, sqlErrorHandler);
                tx.executeSql('DROP TABLE IF EXISTS race', null, null, sqlErrorHandler);

                localStorage.setItem('dbInitialized', 'false');
            });
        }
    };

})(lifeStory);