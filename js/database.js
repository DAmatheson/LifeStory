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

    function transactionErrorHandler(error)
    {
        alert(error.message);
        console.error(error.message, error);

        return true; // Rollback the whole transaction
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
                'name VARCHAR(50) NOT NULL, ' + // TODO: Decide on max length, update validation to match
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
                'name VARCHAR(30) NOT NULL, ' + // TODO: Decide on max length, update validation to match
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

        defaultClasses.forEach(function(item)
        {
            transaction.executeSql('INSERT OR IGNORE INTO class (name) VALUES (?);',
                [item],
                null,
                initializationError);
        });
    }

    // Insert default race records
    function insertDefaultRaces(transaction)
    {
        var names = ['Dwarf', 'Human', 'Halfling', 'Elf', 'Half-elf',
            'Half-orc', 'Gnome', 'Dragonborn', 'Tiefling'];

        names.forEach(function(item)
        {
            transaction.executeSql(
                'INSERT OR IGNORE INTO race (name) VALUES (?);',
                [item],
                null,
                initializationError);
        });
    }

    // Insert event type records
    function insertEventTypes(transaction)
    {
        var names = ['Combat', 'Non-Combat', 'Resurrect', 'Death'];

        names.forEach(function (item)
        {
            transaction.executeSql(
                'INSERT OR IGNORE INTO eventType (name) VALUES (?);',
                [item],
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
                5 * 1024 * 1024, initializeTables);

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

    dbLibrary.addRace = function addRace(race, successCallback, failureCallback)
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
    dbLibrary.addClass = function addClass(characterClass, successCallback, failureCallback)
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
    dbLibrary.addCharacter = function addCharacter(character, successCallback, failureCallback)
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
                'VALUES (?, ?, ?, ?, ?);',
                [
                    character.name, character.raceId, character.classId,
                    character.details, character.living
                ],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    dbLibrary.addEvent = function addEvent(event, eventDetails, characterId, successCallback, failureCallback)
    {
        if (!(event instanceof lifeStory.Event))
        {
            throw 'event parameter to addEvent must be an instance of lifestory.Event';
        }
        else if (!Array.isArray(eventDetails))
        {
            throw 'The eventDetails argument for addEvent must be an array';
        }
        else if (eventDetails.length > 0 && !(eventDetails[0] instanceof lifeStory.EventDetail))
        {
            throw 'The entries in the eventDetails argument for addEvent must be instances ' +
                'of lifeStory.EventDetail';
        }

        var wrappedFailureCallback = function(error)
        {
            transactionErrorHandler(error);

            if (failureCallback)
            {
                failureCallback();
            }
        }

        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'INSERT INTO event (eventType_Id, characterCount, xp, description) ' +
                'VALUES (?, ?, ?, ?);',
                [
                    event.eventTypeId, event.characterCount,
                    event.experience, event.description
                ],
                function (transaction, resultSet)
                {
                    tx.executeSql(
                        'INSERT INTO characterEvent (character_id, event_id) VALUES (?, ?);',
                        [
                            characterId, resultSet.insertId
                        ]);

                    eventDetails.forEach(function(item)
                    {
                        tx.executeSql(
                            'INSERT INTO eventDetail (id, event_id, name, creatureCount) ' +
                            'VALUES (?, ?, ?, ?);',
                            [
                                item.id, resultSet.insertId,
                                item.name, item.creatureCount
                            ]);
                    });
                });
        }, wrappedFailureCallback, successCallback);
    };

    dbLibrary.updateCharacter = function updateCharacter(character, successCallback, failureCallback)
    {
        if (!(character instanceof lifeStory.Character))
        {
            throw 'character parameter to updateCharacter must be an instance of lifeStory.Character';
        }

        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'UPDATE character ' +
                'SET name = ?, race_id = ?, class_id = ?, details = ?, living = ? ' +
                'WHERE id = ?;',
                [
                    character.name, character.raceId, character.classId,
                    character.details, character.living, character.id
                ],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    dbLibrary.deleteRace = function deleteRace(id, successCallback, failureCallback)
    {
        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'DELETE FROM race ' +
                'WHERE id = ? AND ' +
                    'NOT EXISTS (' +
                        'SELECT 1 FROM character WHERE race_id = ?' +
                    ');',
                [id, id],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    dbLibrary.deleteClass = function deleteClass(id, successCallback, failureCallback)
    {
        dbLibrary.getDb().transaction(function(tx)
        {
            tx.executeSql(
                'DELETE FROM class ' +
                'WHERE id = ? AND ' +
                    'NOT EXISTS (' +
                        'SELECT 1 FROM character WHERE class_id = ?' +
                    ');',
                [id, id],
                successCallback || null,
                failureCallback || sqlErrorHandler);
        });
    };

    dbLibrary.deleteCharacter = function deleteCharacter(id, successCallback, failureCallback)
    {
        /// <summary>
        ///     Attempts to delete the character specified by id along with all event records for it.<br/>
        ///     If the transaction fails, it is rolled back and no data is deleted.
        /// </summary>
        /// <param name="id" type="number">The id of the character to delete</param>
        /// <param name="successCallback" type="function">The callback for deletion success</param>
        /// <param name="failureCallback" type="function">The callback for deletion failure</param>

        var wrappedFailureCallback = function(error)
        {
            transactionErrorHandler(error);

            if (failureCallback)
            {
                failureCallback();
            }
        }

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql(
                'DELETE FROM eventDetail ' +
                'WHERE event_id IN ' +
                '( ' +
                    'SELECT ed.id ' +
                    'FROM eventDetail ed ' +
                        'JOIN event e ' +
                            'ON ed.event_id = e.id ' +
                        'JOIN characterEvent ce ' +
                            'ON e.id = ce.event_id AND ce.character_id = ? ' +
                ');',
                [id]);

            tx.executeSql(
                'DELETE FROM event ' +
                'WHERE id IN ' +
                '( ' +
                    'SELECT e.id ' +
                    'FROM event e JOIN characterEvent ce ' +
                        'ON e.id = ce.event_id AND ce.character_id = ?' +
                ');',
                [id]);

            tx.executeSql(
                'DELETE FROM characterEvent ' +
                'WHERE character_id = ?',
                [id]);

            tx.executeSql(
                'DELETE FROM character ' +
                'WHERE id = ?;',
                [id]);

        }, wrappedFailureCallback, successCallback);
    };

    // Gets the character count and passes it as the sole argument to callBack
    dbLibrary.getCharacterCount = function getCharacterCount(callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT COUNT() AS count ' +
                'FROM character;',
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
    dbLibrary.getClasses = function getClasses(callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT * ' +
                'FROM class ' +
                'ORDER BY name;',
                null,
                function (transaction, resultSet)
                {
                    lifeStory.util.convertToSelectEntrys(resultSet, 'name', callback);
                },
                sqlErrorHandler);
        });
    };

    // Gets the races and passes them as the sole argument to callBack
    dbLibrary.getRaces = function getRaces(callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT * ' +
                'FROM race ' +
                'ORDER BY name;',
                null,
                function(transaction, resultSet)
                {
                    lifeStory.util.convertToSelectEntrys(resultSet, 'name', callback);
                },
                sqlErrorHandler);
        });
    };

    dbLibrary.getCharacters = function (callback)
    {
        dbLibrary.getDb().readTransaction(function (tx)
        {
            tx.executeSql(
                'SELECT c.id, c.name, living, ' +
                    'race.name AS raceName, class.name AS className ' +
                'FROM character c ' +
                    'JOIN class ' +
                        'ON c.class_id = class.id ' +
                    'JOIN race ' +
                        'ON c.race_id = race.id;',
                null,
                function (transaction, resultSet)
                {
                    var characters = [];

                    for (var i = 0; i < resultSet.rows.length; i++)
                    {
                        var row = resultSet.rows.item(i);
                        var character = new lifeStory.Character();

                        character.id = row.id;
                        character.name = row.name;
                        character.living = row.living;
                        character.className = row.className;
                        character.raceName = row.raceName;

                        characters[i] = character;
                    }

                    callback(characters);
                },
                sqlErrorHandler);
        });
    };

    dbLibrary.getCharacter = function(characterId, callback)
    {
        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT c.id, race_id, class_id, c.name, living, details, ' +
                    'race.name AS raceName, class.name AS className, SUM(e.xp / e.characterCount) AS experience ' +
                'FROM character c ' +
                    'JOIN class ' +
                        'ON c.class_id = class.id ' +
                    'JOIN race ' +
                        'ON c.race_id = race.id ' +
                    'LEFT OUTER JOIN characterEvent ce ' +
                        'ON c.id = ce.character_id ' +
                    'LEFT OUTER JOIN event e ' +
                        'ON ce.event_id = e.id ' +
                'WHERE c.id = ?;',
                [characterId],
                function(transaction, resultSet)
                {
                    var row = resultSet.rows.item(0);

                    var character = new lifeStory.Character();
                    character.id = row.id;
                    character.name = row.name;
                    character.raceId = row.race_id;
                    character.classId = row.class_id;
                    character.living = row.living;
                    character.details = row.details;
                    character.raceName = row.raceName;
                    character.className = row.className;
                    character.experience = row.experience;

                    callback(character);
                },
                sqlErrorHandler);
        });
    };

    dbLibrary.getCharactersEvents = function(characterId, callback)
    {
        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT e.id AS id, eventType_id, characterCount, date, xp, description, ' +
                    'et.name AS eventTypeName, ed.name AS eventDetailName, creatureCount ' +
                'FROM event e ' +
                    'JOIN characterEvent ce ' +
                        'ON e.id = ce.event_id ' +
                    'JOIN eventType et ' +
                        'ON e.eventType_id = et.id ' +
                    'JOIN eventDetail ed ' +
                        'ON e.id = ed.event_id AND ed.id = ' +
                            '(' +
                                'SELECT id ' +
                                'FROM eventDetail ' +
                                'WHERE event_id = e.id ' +
                                'ORDER BY id ' +
                                'LIMIT 1' +
                            ') ' +
                'WHERE ce.character_id = ? ' +
                'ORDER BY date;', // TODO: Decide on sort order
                [characterId],
                function(transaction, resultSet)
                {
                    var events = [];

                    for (var i = 0; i < resultSet.rows.length; i++)
                    {
                        var row = resultSet.rows.item(i);
                        var event = new lifeStory.Event();
                        var eventDetail = new lifeStory.EventDetail();

                        eventDetail.name = row.eventDetailName;
                        eventDetail.creatureCount = row.creatureCount;

                        event.id = row.id;
                        event.eventTypeId = row.eventType_id;
                        event.characterCount = row.characterCount;
                        event.date = row.date;
                        event.experience = row.xp;
                        event.description = row.description;
                        event.eventTypeName = row.eventTypeName;
                        event.eventDetails = [eventDetail];

                        events[i] = event;
                    }

                    callback(events);
                },
                sqlErrorHandler);
        });
    };

    dbLibrary.getEventsDetails = function(event, callback)
    {
        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT id, event_id, name, creatureCount ' +
                'FROM eventDetail ' +
                'WHERE event_id = ?;',
                [event.Id],
                function(transaction, resultSet)
                {
                    var eventDetails = [];

                    for (var i = 0; i < resultSet.rows.length; i++)
                    {
                        var row = resultSet.rows.item(i);
                        var eventDetail = new lifeStory.EventDetail();

                        eventDetail.eventId = row.event_id;
                        eventDetail.id = row.id;
                        eventDetail.name = row.name;
                        eventDetail.creatureCount = row.creatureCount;

                        eventDetails[i] = eventDetail;
                    }

                    event.eventDetails = eventDetails;

                    callback(event);
                },
                sqlErrorHandler);
        });
    };

    dbLibrary.getEvent = function(eventId, callback)
    {
        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT e.id, eventType_id, characterCount, date, xp, description, ' +
                    'eventType.name AS eventTypeName ' +
                'FROM event e JOIN eventType ' +
                    'ON e.eventType_id = eventType.id ' +
                'WHERE id = ?;',
                [eventId],
                function(transaction, resultSet)
                {
                    var row = resultSet.rows.item(0);
                    var event = lifeStory.Event();

                    event.id = row.id;
                    event.eventTypeId = row.eventType_id;
                    event.characterCount = row.characterCount;
                    event.date = row.date;
                    event.experience = row.xp;
                    event.description = row.description;
                    event.eventTypeName = row.eventTypeName;

                    dbLibrary.getEventsDetails(event, callback);
                },
                sqlErrorHandler);
        });
    };

    // Clears the character table
    dbLibrary.clearCharacterTable = function clearCharacterTable()
    {
        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('DROP TABLE IF EXISTS character;', null, null, sqlErrorHandler);

            createCharacterTable(tx);
        });
    };

    // Drops all tables, used for resetting the database
    // Pass 'danger' as an argument to confirm the action
    dbLibrary.dropAllTables = function dropAllTables()
    {
        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('DROP TABLE IF EXISTS character;', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS characterEvent;', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS class;', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS event;', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS eventType;', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS eventDetail;', null, null, sqlErrorHandler);
            tx.executeSql('DROP TABLE IF EXISTS race;', null, null, sqlErrorHandler);

            localStorage.setItem('dbInitialized', 'false');
        });
    };

})(window.lifeStory);