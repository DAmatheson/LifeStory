/* database.js
 * Purpose: Database functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

(function(lifeStory, undefined)
{
    'use strict';

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
                'name VARCHAR(20) NOT NULL' +
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
                'name VARCHAR(20) NOT NULL' +
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
                'living BOOLEAN NOT NULL' +
            ');',
            null,
            null,
            initializationError);
    }

    function createEventNameTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS eventName ' +
            '(' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'name VARCHAR(60) NOT NULL' +
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
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'event_id INTEGER NOT NULL, ' +
                'eventName_id INTEGER, ' +
                'xp INTEGER, ' +
                'numberOfCreatures INTEGER' +
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
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'date DATE NOT NULL, ' +
                'numberOfPCs INTEGER, ' +
                'description TEXT' +
            ');',
            null,
            null,
            initializationError);
    }

    function createCharacterEventTable(transaction)
    {
        transaction.executeSql(
            'CREATE TABLE IF NOT EXISTS eventName ' +
            '(' +
                'character_id INTEGER PRIMARY KEY, ' +
                'event_id INTEGER PRIMARY KEY' +
            ');',
            null,
            null,
            initializationError);
    }

    dbLibrary.insertRace = function insertRace(raceName)
    {
        dbLibrary.getDb().transaction(function (tx)
        {
            var sql = 'INSERT INTO race (name) VALUES (?);';

            tx.executeSql(sql, [raceName], null, sqlErrorHandler);
        });
    }

    dbLibrary.insertClass = function insertClass(className)
    {
        dbLibrary.getDb().transaction(function (tx)
        {
            var sql = 'INSERT INTO class (name) VALUES (?);';

            tx.executeSql(sql, [className], null, sqlErrorHandler);
        });
    }

    function insertDefaultClasses()
    {
        dbLibrary.insertClass('Barbarian');
        dbLibrary.insertClass('Bard');
        dbLibrary.insertClass('Cleric');
        dbLibrary.insertClass('Druid');
        dbLibrary.insertClass('Fighter');
        dbLibrary.insertClass('Monk');
        dbLibrary.insertClass('Paladin');
        dbLibrary.insertClass('Ranger');
        dbLibrary.insertClass('Rogue');
        dbLibrary.insertClass('Sorcerer');
        dbLibrary.insertClass('Warlock');
        dbLibrary.insertClass('Wizard');
    }

    function insertDefaultRaces()
    {
        dbLibrary.insertRace("Dwarf");
        dbLibrary.insertRace("Human");
        dbLibrary.insertRace("Halfling");
        dbLibrary.insertRace("Elf");
        dbLibrary.insertRace("Half-elf");
        dbLibrary.insertRace("Half-orc");
        dbLibrary.insertRace("Gnome");
        dbLibrary.insertRace("Dragonborn");
        dbLibrary.insertRace("Tiefling");
    }

    function initializeTables(database)
    {
        database.transaction(function createTables(tx)
        {
            createRaceTable(tx);
            createClassTable(tx);
            createCharacterTable(tx);
            createEventNameTable(tx);
            createEventTable(tx);
            createEventDetailTable(tx);
            createCharacterEventTable(tx);
            insertDefaultClasses();
            insertDefaultRaces();
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

    dbLibrary.initializeDb = function initializeDb()
    {
        if (window.openDatabase === undefined)
        {
            alert('WebSQL isn\'t supported in this browser.');
        }

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

    // Returns the database for the application
    dbLibrary.getDb = function getDb()
    {
        // Initialize the database if it hasn't been
        if (db === undefined || localStorage.getItem('dbInitialized') !== 'true')
        {
            dbLibrary.initializeDb();
        }

        // return the database
        return db;
    }

})(lifeStory);