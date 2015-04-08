/* database.js
 * Purpose: Database functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with database functions located under lifeStory.db
(function(window, lifeStory, undefined)
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
        /// <summary>
        ///     Displays an alert with the error message and writes the message, error,
        ///     and transaction to console
        /// </summary>
        /// <param name="transaction">The transaction object from the error</param>
        /// <param name="error">The error object</param>

        alert('SQL Error: ' + error.message); // Uses default alert to give it more emphasis
        console.error(error.message, error, transaction);
    }

    function wrapTransactionFailureCallback(callback)
    {
        /// <summary>
        ///     Rolls back the transaction. If provided, the callback is called with the error.
        /// </summary>
        /// <param name="callback" type="function">Optional, Callback to be called with the error</param>
        /// <returns type="function">Wrapped callback which will also rollback the transaction</returns>

        return function (error)
        {
            if (callback)
            {
                callback(error);
            }
            else
            {
                // Uses default alert to give it more emphasis
                alert('SQL Transaction Error: ' + error.message);
                console.error(error.message, error);
            }

            return true; // Roll back the whole transaction
        };
    }

    function createRaceTable(transaction)
    {
        /// <summary>
        ///     Creates the race table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS race ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR(20) NOT NULL UNIQUE' +
            ');');
    }

    function createClassTable(transaction)
    {
        /// <summary>
        ///     Creates the class table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS class ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR(20) NOT NULL UNIQUE' +
            ');');
    }

    function createCharacterTable(transaction)
    {
        /// <summary>
        ///     Creates the character table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

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
            ');');
    }

    function createEventTypeTable(transaction)
    {
        /// <summary>
        ///     Creates the eventType table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS eventType ' +
            '(' +
                'id INTEGER PRIMARY KEY, ' +
                'name VARCHAR(20) NOT NULL UNIQUE' +
            ');');
    }

    function createEventTable(transaction)
    {
        /// <summary>
        ///     Creates the event table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

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
            ');');
    }

    function createEventDetailTable(transaction)
    {
        /// <summary>
        ///     Creates the eventDetail table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS eventDetail ' +
            '(' +
                'id INTEGER NOT NULL, ' +
                'event_id INTEGER NOT NULL, ' +
                'name VARCHAR(30) NOT NULL, ' + 
                'creatureCount INTEGER, ' +
                'PRIMARY KEY (id, event_id), ' +
                'FOREIGN KEY (event_id) REFERENCES event (id)' +
            ');');
    }

    function createCharacterEventTable(transaction)
    {
        /// <summary>
        ///     Creates the characterEvent table
        /// </summary>
        /// <param name="transaction">Transaction to use to create the table</param>

        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS characterEvent ' +
            '(' +
                'character_id INTEGER NOT NULL, ' +
                'event_id INTEGER NOT NULL,' +
                'PRIMARY KEY (character_id, event_id),' +
                'FOREIGN KEY (event_id) REFERENCES event (id),' +
                'FOREIGN KEY (character_id) REFERENCES character (id)' +
            ');');
    }

    function insertDefaultClasses(transaction)
    {
        /// <summary>
        ///     Inserts the default classes into the class table
        /// </summary>
        /// <param name="transaction">Transaction to use to insert the records</param>

        var defaultClasses = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk',
            'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];

        defaultClasses.forEach(function(item)
        {
            transaction.executeSql('INSERT OR IGNORE INTO class (name) VALUES (?);',
                [item]);
        });
    }

    function insertDefaultRaces(transaction)
    {
        /// <summary>
        ///     Inserts the default race into the race table
        /// </summary>
        /// <param name="transaction">Transaction to use to insert the records</param>

        var names = ['Dwarf', 'Human', 'Halfling', 'Elf', 'Half-elf',
            'Half-orc', 'Gnome', 'Dragonborn', 'Tiefling'];

        names.forEach(function(item)
        {
            transaction.executeSql(
                'INSERT OR IGNORE INTO race (name) VALUES (?);',
                [item]);
        });
    }

    function insertEventTypes(transaction)
    {
        /// <summary>
        ///     Inserts the default event types into the eventType table
        /// </summary>
        /// <param name="transaction">Transaction to use to insert the records</param>

        var ids =
        [
            lifeStory.COMBAT_EVENT, lifeStory.NON_COMBAT_EVENT,
            lifeStory.RESURRECT_EVENT, lifeStory.DEATH_EVENT
        ];

        var names = ['Combat', 'An Event', 'Resurrect', 'Death'];

        names.forEach(function (item, index)
        {
            transaction.executeSql(
                'INSERT OR IGNORE INTO eventType (id ,name) VALUES (?, ?);',
                [ids[index], item]);
        });
    }

    // Creates the database tables and inserts default records
    function initializeTables(database)
    {
        /// <summary>
        ///     Creates the database tables and inserts the default records
        /// </summary>
        /// <param name="database">The database to create tables and insert records into</param>

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
        },
        function initializationError(error)
        {
            localStorage.setItem('dbInitialized', 'false');
            console.error(error.message, error);

            // Uses default alert to give it more emphasis
            alert('Database Initialization error: ' + error.message);

            return true; // Roll back the transaction
        },
        function initializationSuccess()
        {
            localStorage.setItem('dbInitialized', 'true');
        });
    }

    function initializeDb()
    {
        /// <summary>
        ///     Initializes the database<br/>
        ///     If WebSQL isn't supported, a dummy DB object is created
        /// </summary>

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
            // Version is left empty because it doesn't matter to us, and any other value throws exception
            db = window.openDatabase('LifeStory', '', 'Life Story Database',
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

    dbLibrary.getDb = function getDb()
    {
        /// <summary>
        ///     Gets the database for the application
        /// </summary>
        /// <returns type="WebSQL Database">The application's database</returns>

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

    dbLibrary.addClass = function addClass(characterClass, successCallback, failureCallback)
    {
        /// <summary>
        ///     Adds the class to the class table
        /// </summary>
        /// <param name="characterClass" type="lifeStory.CharacterClass">The class to add</param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful save
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     Optional, function to be called on failed save
        /// </param>

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

    dbLibrary.addCharacter = function addCharacter(character, successCallback, failureCallback)
    {
        /// <summary>
        ///     Adds the character to the character table
        /// </summary>
        /// <param name="characterClass" type="lifeStory.Character">The character to add</param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful save
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     Optional, function to be called on failed save
        /// </param>

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

    dbLibrary.addEvent = function addEvent(event, eventDetails, characterId, successCallback,
        transactionFailureCallback)
    {
        /// <summary>
        ///     Adds the event and event details to the database.<br/>
        ///     If any of the inserts fail, the database remains as it was before this function was called
        /// </summary>
        /// <param name="event" type="lifeStory.Event">The event to add</param>
        /// <param name="eventDetails" type="Array">Array of lifeStory.EventDetail objects to add</param>
        /// <param name="characterId" type="number">
        ///     The Id of the character that the event belongs to
        /// </param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful save
        /// </param>
        /// <param name="transactionFailureCallback" type="function">
        ///     Optional, function to be called on failed save transaction
        /// </param>

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

        var wrappedFailureCallback = wrapTransactionFailureCallback(transactionFailureCallback);

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

            if (event.eventTypeId === lifeStory.DEATH_EVENT ||
                event.eventTypeId === lifeStory.RESURRECT_EVENT)
            {
                tx.executeSql(
                    'UPDATE character ' +
                    'SET living = ? ' +
                    'WHERE id = ?;',
                    [
                        event.eventTypeId === lifeStory.RESURRECT_EVENT ? lifeStory.ALIVE : lifeStory.DEAD,
                        characterId
                    ]);
            }
        }, wrappedFailureCallback, successCallback);
    };

    dbLibrary.updateCharacter = function updateCharacter(character, successCallback, failureCallback)
    {
        /// <summary>
        ///     Updates a character in the database
        /// </summary>
        /// <param name="character" type="lifeStory.Character">The character to update</param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful update
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     Optional, function to be called on failed update
        /// </param>

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

    dbLibrary.updateEvent = function updateEvent(event, eventDetails, successCallback,
        transactionFailureCallback)
    {
        /// <summary>
        ///     Updates the event and event details in the database.<br/>
        ///     If any of the updates fail, the database remains as it was before this function was called
        /// </summary>
        /// <param name="event" type=""></param>
        /// <param name="eventDetails" type=""></param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful update
        /// </param>
        /// <param name="transactionFailureCallback" type="function">
        ///     Optional, function to be called on failed update transaction
        /// </param>

        if (!(event instanceof lifeStory.Event))
        {
            throw 'event parameter to updateEvent must be an instance of lifestory.Event';
        }
        else if (!Array.isArray(eventDetails))
        {
            throw 'The eventDetails argument for updateEvent must be an array';
        }
        else if (eventDetails.length <= 0)
        {
            throw 'The eventDetails argument for updateEvent must contain at least one item';
        }
        else if (!(eventDetails[0] instanceof lifeStory.EventDetail))
        {
            throw 'The entries in the eventDetails argument for updateEvent must be instances ' +
                'of lifeStory.EventDetail';
        }

        var wrappedFailureCallback = wrapTransactionFailureCallback(transactionFailureCallback);

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql(
                'UPDATE event ' +
                'SET eventType_id = ?, characterCount = ?, xp = ?, description = ? ' +
                'WHERE id = ?;',
                [
                    event.eventTypeId, event.characterCount, event.experience, event.description,
                    event.id
                ]);


            tx.executeSql(
                'DELETE FROM eventDetail ' +
                'WHERE event_id = ?;',
                [event.id]);

            eventDetails.forEach(function (item)
            {
                tx.executeSql(
                    'INSERT INTO eventDetail (id, event_id, name, creatureCount) ' +
                    'VALUES (?, ?, ?, ?);',
                    [
                        item.id, event.id,
                        item.name, item.creatureCount
                    ]);
            });

        }, wrappedFailureCallback, successCallback);
    };

    dbLibrary.deleteRace = function deleteRace(id, successCallback, failureCallback)
    {
        /// <summary>
        ///     Deletes the race from the database
        /// </summary>
        /// <param name="id" type="number">The Id of the race to delete</param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful delete
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     Optional, function to be called on failed delete
        /// </param>

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
        /// <summary>
        ///     Deletes the class from the database
        /// </summary>
        /// <param name="id" type="number">The Id of the class to delete</param>
        /// <param name="successCallback" type="function">
        ///     Optional, function to be called on successful delete
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     Optional, function to be called on failed delete
        /// </param>

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

    dbLibrary.deleteCharacter = function deleteCharacter(id, successCallback, transactionFailureCallback)
    {
        /// <summary>
        ///     Attempts to delete the character specified by id along with all event records for it.<br/>
        ///     If the transaction fails, it is rolled back and no data is deleted.
        /// </summary>
        /// <param name="id" type="number">The id of the character to delete</param>
        /// <param name="successCallback" type="function">Optional callback for deletion success</param>
        /// <param name="transactionFailureCallback" type="function">
        ///     Optional callback for deletion failure
        /// </param>

        var wrappedFailureCallback = wrapTransactionFailureCallback(transactionFailureCallback);

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
                'WHERE character_id = ?;',
                [id]);

            tx.executeSql(
                'DELETE FROM character ' +
                'WHERE id = ?;',
                [id]);

        }, wrappedFailureCallback, successCallback);
    };

    dbLibrary.deleteEvent = function deleteEvent(id, characterId, successCallback,
        transactionFailureCallback)
    {
        /// <summary>
        ///     Attempts to delete the event specified by id along with all detail records for it.<br/>
        ///     If the transaction fails, it is rolled back and no data is deleted.
        /// </summary>
        /// <param name="id" type="number">The id of the event to delete</param>
        /// <param name="characterId" type="number">The id of the character the event belongs to</param>
        /// <param name="successCallback" type="function">Optional callback for deletion success</param>
        /// <param name="transactionFailureCallback" type="function">
        ///     Optional callback for deletion failure
        /// </param>

        var originalAliveValue = lifeStory.values.characterAlive;

        var wrappedFailureCallback = function(error)
        {
            // Reset the value back to its original value before this transaction
            lifeStory.values.characterAlive = originalAliveValue;

            // Call wrapTransactionFailureCallback and immediately invoke the returned function
            wrapTransactionFailureCallback(transactionFailureCallback)(error);
        };

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql(
                'DELETE FROM eventDetail ' +
                'WHERE event_id = ?;',
                [id]);

            tx.executeSql(
                'DELETE FROM event ' +
                'WHERE id = ?;',
                [id]);

            tx.executeSql(
                'DELETE FROM characterEvent ' +
                'WHERE event_id = ?;',
                [id]);

            tx.executeSql(
                'UPDATE character ' +
                'SET living = ' +
                '(' +
                    'SELECT ' +
                        'CASE e.eventType_id ' +
                            'WHEN ? THEN MAX(?) ' +
                            'WHEN ? THEN ? ' +
                            'ELSE ? ' +
                        'END ' +
                    'FROM event e JOIN characterEvent ce ' +
                        'ON e.id = ce.event_id AND ce.character_id = ? ' +
                    'WHERE eventType_id IN(?, ?) ' +
                    'ORDER BY date DESC ' +
                    'LIMIT 1' +
                ') ' +
                'WHERE id = ?;',
                [
                    lifeStory.RESURRECT_EVENT, lifeStory.ALIVE, // First WHEN
                    lifeStory.DEATH_EVENT, lifeStory.DEAD, // Second WHEN
                    lifeStory.ALIVE, // ELSE
                    characterId, // JOIN character_id condition
                    lifeStory.RESURRECT_EVENT, lifeStory.DEATH_EVENT, // IN values
                    characterId // Update WHERE condition
                ]);

            tx.executeSql(
                'SELECT living ' +
                'FROM character ' +
                'WHERE id = ?;',
                [characterId],
                function(transaction, resultSet)
                {
                    if (resultSet.rows.length > 0)
                    {
                        // Update characterAlive to the new status
                        lifeStory.values.characterAlive = resultSet.rows.item(0).living;
                    }
                });

        }, wrappedFailureCallback, successCallback);
    };

    dbLibrary.getCharacterCount = function getCharacterCount(callback)
    {
        /// <summary>
        ///     Gets the character count as passes it as the sole argument to callback
        /// </summary>
        /// <param name="callback" type="function">Callback function to pass the count to</param>

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

    dbLibrary.getClasses = function getClasses(callback)
    {
        /// <summary>
        ///     Gets the classes and passes them as the sole argument to callback
        /// </summary>
        /// <param name="callback" type="function">
        ///     Callback function to pass the class SelectEntry objects to
        /// </param>

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

    dbLibrary.getRaces = function getRaces(callback)
    {
        /// <summary>
        ///     Gets the races and passes them as the sole argument to callback
        /// </summary>
        /// <param name="callback" type="function">
        ///     Callback function to pass the race SelectEntry objects to
        /// </param>

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
        /// <summary>
        ///     Gets the characters and passes them as the sole argument to callback
        /// </summary>
        /// <param name="callback" type="function">
        ///     Callback function to pass the array of Character objects to
        /// </param>

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
        /// <summary>
        ///     Gets the character matching characterId and passes it as the sole argument to callback
        /// </summary>
        /// <param name="characterId" type="number">The Id of the character to retrieve</param>
        /// <param name="callback" type="function">Callback function to pass the Character to</param>

        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT c.id, race_id, class_id, c.name, living, details, ' +
                    'race.name AS raceName, class.name AS className, ' +
                    'SUM(e.xp / e.characterCount) AS experience ' +
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
        /// <summary>
        ///     Gets the character identified by characterId's events and passes them as
        ///     the sole argument to callback
        /// </summary>
        /// <param name="characterId" type="number">The Id of the character to get events for</param>
        /// <param name="callback" type="function">
        ///     Callback function to pass the array of Event objects to
        /// </param>

        var events = [];

        var wrappedCallback = function ()
        {
            callback(events);
        }; 

        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT e.id AS id, eventType_id, characterCount, date, xp, description, ' +
                    'et.name AS eventTypeName ' +
                'FROM event e ' +
                    'JOIN characterEvent ce ' +
                        'ON e.id = ce.event_id ' +
                    'JOIN eventType et ' +
                        'ON e.eventType_id = et.id ' +
                'WHERE ce.character_id = ? ' +
                'ORDER BY date;',
                [characterId],
                function(transaction, resultSet)
                {
                    for (var i = 0; i < resultSet.rows.length; i++)
                    {
                        var row = resultSet.rows.item(i);
                        var event = new lifeStory.Event();

                        event.id = row.id;
                        event.eventTypeId = row.eventType_id;
                        event.characterCount = row.characterCount;
                        event.date = row.date;
                        event.experience = row.xp;
                        event.description = row.description;
                        event.eventTypeName = row.eventTypeName;
                        event.eventDetails = [];

                        tx.executeSql(
                            'SELECT name, creatureCount ' +
                            'FROM eventDetail ' +
                            'WHERE event_id = ? ' +
                            'ORDER BY id;',
                            [event.id],
                            function(localEvent, localTransaction, detailResultSet)
                            {
                                for (var j = 0; j < detailResultSet.rows.length; j++)
                                {
                                    var detailRow = detailResultSet.rows.item(j);
                                    var eventDetail = new lifeStory.EventDetail();

                                    eventDetail.name = detailRow.name;
                                    eventDetail.creatureCount = detailRow.creatureCount;

                                    localEvent.eventDetails[j] = eventDetail;
                                }
                            }.bind(null, event) // Pass in the current event as the first argument
                        ); 

                        events[i] = event;
                    }
                },
                sqlErrorHandler);
        }, null, wrappedCallback);
    };

    dbLibrary.getEvent = function(eventId, callback)
    {
        /// <summary>
        ///     Gets the event matching eventId and passes it as the sole argument to callback
        /// </summary>
        /// <param name="eventId" type="number">The Id of the event to retrieve</param>
        /// <param name="callback" type="function">Callback function to pass the Event to</param>

        var event = new lifeStory.Event();

        var wrappedCallback = function()
        {
            callback(event);
        };

        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT e.id AS id, eventType_id, characterCount, date, xp, description, ' +
                    'et.name AS eventTypeName ' +
                'FROM event e JOIN eventType et ' +
                    'ON e.eventType_id = et.id ' +
                'WHERE e.id = ?;',
                [eventId],
                function(transaction, resultSet)
                {
                    var row = resultSet.rows.item(0);

                    event.id = row.id;
                    event.eventTypeId = row.eventType_id;
                    event.characterCount = row.characterCount;
                    event.date = row.date;
                    event.experience = row.xp;
                    event.description = row.description;
                    event.eventTypeName = row.eventTypeName;
                },
                sqlErrorHandler);

            tx.executeSql(
                'SELECT id, event_id, name, creatureCount ' +
                'FROM eventDetail ' +
                'WHERE event_id = ?;',
                [eventId],
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
                },
                sqlErrorHandler);
        }, null, wrappedCallback);
    };

    dbLibrary.getEventTitles = function(eventTypeIds, callback)
    {
        /// <summary>
        ///     Gets the name value for all events with an eventType Id matching those in eventTypeIds and
        ///     passes them as an array to the callback
        /// </summary>
        /// <param name="eventTypeIds" type="Array">Array of eventTypeIds to get names from</param>
        /// <param name="callback" type="function">
        ///     Callback function to pass the array of titles to <br/>
        ///     The titles for each eventType Id are located in an array at the index matching the Id
        /// </param>

        var inParameterList = '';
        eventTypeIds.forEach(function()
        {
            inParameterList += (inParameterList === '' ? '' : ', ') + '?';
        });

        dbLibrary.getDb().readTransaction(function(tx)
        {
            tx.executeSql(
                'SELECT DISTINCT name, eventType_id ' +
                'FROM eventDetail ed JOIN event e ' +
                    'ON ed.event_id = e.id ' +
                'WHERE eventType_id IN (' + inParameterList + ');',
                eventTypeIds,
                function (transaction, resultSet)
                {
                    var titles = [];

                    eventTypeIds.forEach(function(item)
                    {
                        titles[item] = [];
                    });

                    for (var i = 0; i < resultSet.rows.length; i++)
                    {
                        var row = resultSet.rows.item(i);

                        for (var j = 0; j < eventTypeIds.length; j++)
                        {
                            if (row.eventType_id === eventTypeIds[j])
                            {
                                titles[row.eventType_id].push(row.name);

                                break;
                            }
                        }
                    }

                    callback(titles);
                },
                sqlErrorHandler);
        });
    };

    dbLibrary.clearCharacterData = function clearCharacterData(successCallback, failureCallback)
    {
        /// <summary>
        ///     Deletes all character related data. Use with extreme caution!
        /// </summary>
        /// <param name="successCallback" type="function">
        ///     The callback for character data deletion success
        /// </param>
        /// <param name="failureCallback" type="function">
        ///     The callback for character data deletion failure
        /// </param>

        var wrappedFailureCallback = wrapTransactionFailureCallback(failureCallback);

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('DROP TABLE IF EXISTS character;');
            tx.executeSql('DROP TABLE IF EXISTS characterEvent;');
            tx.executeSql('DROP TABLE IF EXISTS event;');
            tx.executeSql('DROP TABLE IF EXISTS eventDetail;');

            // Need to recreate the tables because the DB wasn't totally wiped out
            createCharacterTable(tx);
            createEventTable(tx);
            createEventDetailTable(tx);
            createCharacterEventTable(tx);
        }, wrappedFailureCallback, successCallback);
    };

    dbLibrary.dropAllTables = function dropAllTables(successCallback, failureCallback)
    {
        /// <summary>
        ///     Drops all tables. Use with extreme caution!
        /// </summary>
        /// <param name="successCallback" type="function">The callback for DB clearing success</param>
        /// <param name="failureCallback" type="function">The callback for DB clearing failure</param>

        var wrappedFailureCallback = function(error)
        {
            // Reset the value back to true as the transaction failed and was rolled back
            localStorage.setItem('dbInitialized', 'true');

            // Call wrapTransactionFailureCallback and immediately invoke the returned function
            wrapTransactionFailureCallback(failureCallback)(error);
        }

        dbLibrary.getDb().transaction(function (tx)
        {
            tx.executeSql('DROP TABLE IF EXISTS character;');
            tx.executeSql('DROP TABLE IF EXISTS characterEvent;');
            tx.executeSql('DROP TABLE IF EXISTS class;');
            tx.executeSql('DROP TABLE IF EXISTS event;');
            tx.executeSql('DROP TABLE IF EXISTS eventType;');
            tx.executeSql('DROP TABLE IF EXISTS eventDetail;');
            tx.executeSql('DROP TABLE IF EXISTS race;');

            // Don't need to recreate the tables because the DB was totally wiped out so
            // the next call to getDb will initialize it
            localStorage.setItem('dbInitialized', 'false');
        }, wrappedFailureCallback, successCallback);
    };

})(window, window.lifeStory);