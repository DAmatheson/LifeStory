///#source 1 1 /js/init.js
/* init.js
 * Purpose: Initialization scripts for LifeStory
 *
 * Revision History:
 *      Isaac West, 2015.03.05: Created
 */

// Initialize cordova related things
$(document).on('deviceready', function()
{
    // Handle android backbutton
    $(this).on('backbutton', lifeStory.util.handleAndroidBackButton);
});

// Initialize things which are application wide 
$(function docReady()
{
    // Initialize the popups
    $('#successDialog').popup();
    $('#errorDialog').popup();
    $('#confirmDialog').popup();

    // Remove focus from buttons after tap
    $(document).on('tap', function()
    {
        $('.ui-btn-active:not(.ui-state-persist)').removeClass('ui-btn-active ui-focus');
    });

    $.mobile.defaultPageTransition = 'none';
});

// Initialize the home page
$('#home').one('pageinit', function homePageInit()
{
    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateCharacterList('characterList', 'li');
    });

    if (!lifeStory.values.showDeceased)
    {
        $('#showDeceased').prop('checked', false).change().checkboxradio('refresh');
    }

    // Hook this up after the initial change since it won't result in a filtered list anyways
    $('#showDeceased').change(lifeStory.ui.filterCharacterList);
});

// Initialize the event log page
$('#eventLog').one('pageinit', function eventLogPageInit()
{
    $(this).on('pagebeforeshow', function ()
    {
        lifeStory.ui.populateEventLog('eventList', 'li');
    });
});

// Initialize the character details page
$('#characterDetails').one('pageinit', function characterDetailsPageInit()
{
    $(this).on('pagebeforeshow', lifeStory.ui.populateCharacterDetail);

    $('#deleteCharacter').on('tap', function()
    {
        lifeStory.ui.confirmDeleteCharacter();
    });
});

// Initialize the event details page
$('#eventDetails').one('pageinit', function eventDetailsPageInit()
{
    $(this).on('pagebeforeshow', lifeStory.ui.populateEventDetail);
    $('#deleteEvent').on('tap', lifeStory.ui.confirmDeleteEvent);
});

// Initialize the create character page
$('#createCharacter').one('pageinit', function createCharacterPageInit()
{
    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('raceSelect', 'classSelect');
    });

    $('#createAddClass, #createAddRace').on('tap', function()
    {
        lifeStory.values.goBackToPageId = '#createCharacter';
    });
    
    lifeStory.validation.handleCharacterForm('createCharacterForm', true);
});

// Initialize the add class page
$('#addClass').one('pageinit', function addClassPageInit()
{
    lifeStory.validation.handleClassForm('addClassForm');
});

// Initialize the add race page
$('#addRace').one('pageinit', function addRacePageInit()
{
    lifeStory.validation.handleRaceForm('addRaceForm');
});

// Initialize the edit character page
$('#editCharacter').one('pageinit', function customizePageInit() {
    lifeStory.validation.handleCharacterForm('editCharacterForm');

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('editCharacterRaceSelect', 'editCharacterClassSelect');
        lifeStory.ui.populateCharacterEdit();
    });

    $('#editAddClass, #editAddRace').on('tap', function ()
    {
        lifeStory.values.goBackToPageId = '#editCharacter';
    });
});

// Initialize the create event page
$('#createEvent').one('pageinit', function createEventPageInit()
{
    lifeStory.validation.handleEventForm('createEventForm', true);
    $('#removeEnemy').closest('.ui-btn').hide();

    $(this).on('pagebeforeshow', function () {
        lifeStory.ui.populateCreateEventAutocomplete();
    });

    $('#createEventForm').on('reset', function()
    {
        lifeStory.ui.showCombatDetailInputs();
    });

    $('#eventType').on('change', function ()
    {
        if (lifeStory.util.isCombatEvent())
        {
            lifeStory.ui.showCombatDetailInputs();
        }
        else
        {
            lifeStory.ui.showEventDetailInputs();
        }
    });

    var removeButtonSelector = '#removeEnemy';

    $('#addEnemy').on('tap', function ()
    {
        var appendToSelector = '#combatDetailInputs fieldset:last';
        var templateElementId = 'enemyInputsTemplate';

        lifeStory.ui.duplicateInputSet(appendToSelector, templateElementId, removeButtonSelector);
    });

    $('#removeEnemy').on('tap', function ()
    {
        var removeElementSelector = '#combatDetailInputs fieldset:last:not(#enemyInputsTemplate)';

        lifeStory.ui.removeInputSet(removeElementSelector, removeButtonSelector);
    });

    $('#createEventForm').on('reset', function()
    {
        var extraInputsSelector = '#combatDetailInputs fieldset:not(#enemyInputsTemplate)';

        lifeStory.ui.removeInputSet(extraInputsSelector, removeButtonSelector);
    });
});

// Initialize the edit event page
$('#editEvent').one('pageinit', function createEventPageInit()
{
    lifeStory.validation.handleEventForm('editEventForm');
    lifeStory.validation.handleOtherEventForm('editResurrectEventForm', true);
    lifeStory.validation.handleOtherEventForm('editDeathEventForm');

    var removeButtonSelector = '#editRemoveEnemy';
    var extraInputsSelector = '#editCombatDetailInputs fieldset:not(#editEnemyInputsTemplate)';
    var appendToSelector = '#editCombatDetailInputs fieldset:last';
    var templateElementId = 'editEnemyInputsTemplate';

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.removeInputSet(extraInputsSelector, removeButtonSelector);
        lifeStory.ui.populateEventEdit(appendToSelector, templateElementId, removeButtonSelector);
    });

    $('#editAddEnemy').on('tap', function ()
    {
        lifeStory.ui.duplicateInputSet(appendToSelector, templateElementId, removeButtonSelector);
    });

    $('#editRemoveEnemy').on('tap', function ()
    {
        var removeElementSelector = '#editCombatDetailInputs fieldset:last:not(#editEnemyInputsTemplate)';

        lifeStory.ui.removeInputSet(removeElementSelector, removeButtonSelector);
    });

    $('#editEventForm').on('reset', function ()
    {
        lifeStory.ui.removeInputSet(extraInputsSelector, removeButtonSelector);
    });
});

// Initialize the create resurrect event page
$('#resurrectEvent').one('pageinit', function resurrectEventPageInit()
{
    lifeStory.validation.handleOtherEventForm('resurrectEventForm', true, true);

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateResurrectAutocomplete();
        $('#resurrectEventForm span[data-property=characterName]').text(lifeStory.values.characterName);
    });
});

// Initialize the create death event page
$('#deathEvent').one('pageinit', function deathEventPageInit()
{
    lifeStory.validation.handleOtherEventForm('deathEventForm', false, true);

    $(this).on('pagebeforeshow', lifeStory.ui.populateDeathAutocomplete);
});

// Initialize the customize page
$('#customize').one('pageinit', function customizePageInit()
{
    lifeStory.validation.handleRaceForm('createRaceForm', true);
    lifeStory.validation.handleClassForm('createClassForm', true);

    $(this).on('pagebeforeshow', function ()
    {
        lifeStory.ui.populateRaceAndClassList('deleteRaceSelect', 'deleteClassSelect', true);
    });

    $('#deleteRace').on('tap', function ()
    {
        lifeStory.dataAccess.deleteRace($('#deleteRaceSelect').val());
    });

    $('#deleteClass').on('tap', function ()
    {
        lifeStory.dataAccess.deleteClass($('#deleteClassSelect').val());
    });
});

// Initialize the settings page
$('#settings').one('pageinit', function settingsPageInit()
{
    $('#clearCharacters').on('tap', lifeStory.ui.confirmClearCharacterData);
    $('#resetDatabase').on('tap', lifeStory.ui.confirmClearDatabase);
});

// Setup lifeStory for later use to minimize global variables and encapsulate functions and variables
(function (window, undefined)
{
    'use strict';

    var lifeStory =
    {
        get COMBAT_EVENT()
        {
            /// <summary>Constant for Combat eventType id</summary>
            return 1;
        },
        get NON_COMBAT_EVENT()
        {
            /// <summary>Constant for Non Combat eventType id</summary>
            return 2;
        },
        get RESURRECT_EVENT()
        {
            /// <summary>Constant for Resurrect eventType id</summary>
            return 3;
        },
        get DEATH_EVENT()
        {
            /// <summary>Constant for Death eventType id</summary>
            return 4;
        },
        get ALIVE()
        {
            /// <summary>Constant for Alive character living status</summary>
            return 1;
        },
        get DEAD()
        {
            /// <summary>Constant for Dead character living status</summary>
            return 0;
        },
        get LEVEL_VALUES()
        {
            /// <summary>Array of experience required to be a certain level</summary>
            return [0, 300, 900, 2700, 6500,
                14000, 23000, 34000, 48000, 64000,
                85000, 100000, 120000, 140000, 165000,
                195000, 225000, 265000, 305000, 355000];
        }
    };

    lifeStory.values =
    {
        get characterId()
        {
            /// <summary>Gets the character Id for the current context of the app</summary>
            return parseInt(localStorage.getItem('characterId'), 10);
        },
        set characterId(value)
        {
            /// <summary>Sets the character Id for the current context of the app</summary>
            /// <param name="value" type="any">
            ///     The value to set. If null, the current character Id is removed
            /// </param>

            if (value !== undefined && value !== null)
            {
                localStorage.setItem('characterId', value);
            }
            else if (value === null)
            {
                localStorage.removeItem('characterId');
            }
        },

        get characterName()
        {
            /// <summary>Gets the character name for the current context of the app</summary>
            return localStorage.getItem('characterName');
        },
        set characterName(value)
        {
            /// <summary>Sets the character name for the current context of the app</summary>
            /// <param name="value" type="any">
            ///     The value to set. If null, the current character name is removed
            /// </param>

            if (value !== undefined && value !== null)
            {
                localStorage.setItem('characterName', value);
            }
            else if (value === null)
            {
                localStorage.removeItem('characterName');
            }
        },

        get characterAlive()
        {
            /// <summary>Gets the character living status for the current context of the app</summary>
            return parseInt(localStorage.getItem('characterAlive'), 10);
        },
        set characterAlive(value)
        {
            /// <summary>Sets the character living status for the current context of the app</summary>
            /// <param name="value" type="any">
            ///     The value to set. If null, the current living status is removed
            /// </param>

            if (value !== undefined && value !== null)
            {
                localStorage.setItem('characterAlive', value);
            }
            else if (value === null)
            {
                localStorage.removeItem('characterAlive');
            }
        },

        get eventId()
        {
            /// <summary>Gets the current event id for the current context of the app</summary>
            return parseInt(localStorage.getItem('eventId'), 10);
        },
        set eventId(value)
        {
            /// <summary>Sets the event id for the current context of the app</summary>
            /// <param name="value" type="any">
            ///     The value to set. If null, the current event id is removed
            /// </param>

            if (value !== undefined && value !== null)
            {
                localStorage.setItem('eventId', value);
            }
            else if (value === null)
            {
                localStorage.removeItem('eventId');
            }
        },

        get showDeceased()
        {
            /// <summary>Gets the current showDeceased filter status for the app</summary>
            return localStorage.getItem('showDeceased') === 'true';
        },
        set showDeceased(value)
        {
            /// <summary>Sets the showDeceased filter status for the app</summary>
            /// <param name="value" type="any">
            ///     The value to set. If null, the current value is removed
            /// </param>

            if (value !== undefined && value !== null)
            {
                localStorage.setItem('showDeceased', value);
            }
            else if (value === null)
            {
                localStorage.removeItem('showDeceased');
            }
        },

        get goBackToPageId()
        {
            /// <summary>
            ///     Gets the Id of the page to redirect to after success on
            ///     the addClass and addRace pages <br/>
            ///     Once this value has been retrieved, it is removed.
            /// </summary>

            var id = localStorage.getItem('goBackToPageId');
            localStorage.removeItem('goBackToPageId');

            return id;
        },
        set goBackToPageId(value)
        {
            /// <summary>
            ///     Sets the Id of the page to redirect to after success on the addClass and addRace pages
            /// </summary>

            localStorage.setItem('goBackToPageId', value);
        }
    };

    // Makes lifeStory available to the global object
    window.lifeStory = lifeStory;

})(window);
///#source 1 1 /js/dataClasses.js
/* dataClasses.js
 * Purpose: Data classes for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with model classes located under lifeStory
(function (lifeStory, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by dataClasses but is undefined.';
    }

    lifeStory.Race = function race(name)
    {
        /// <summary>
        ///     Model class for character races
        /// </summary>
        /// <param name="name" type="string">Name for the race</param>

        this.id = null;
        this.name = name || null;
    };

    lifeStory.CharacterClass = function characterClass(name)
    {
        /// <summary>
        ///     Model class for character classes
        /// </summary>
        /// <param name="name" type="string">Name for the class</param>

        this.id = null;
        this.name = name || null;
    };

    lifeStory.Character = function character(name, raceId, classId, details, living)
    {
        /// <summary>
        ///     Model class for characters
        /// </summary>
        /// <param name="name" type="string">Character name</param>
        /// <param name="raceId" type="number">Id of the character's race</param>
        /// <param name="classId" type="number">Id of the character's class</param>
        /// <param name="details" type="string">Details for the character</param>
        /// <param name="living" type="number">
        ///     Living status for the character
        ///     1 for alive, 0 for dead
        /// </param>

        this.id = null;
        this.raceId = parseInt(raceId, 10) || null;
        this.classId = parseInt(classId, 10) || null;
        this.name = name || null;
        this.living = parseInt(living, 10) || null;
        this.details = details || null;

        this.raceName = null;
        this.className = null;
        this.experience = null;
    };

    lifeStory.EventType = function eventType(name)
    {
        /// <summary>
        ///     Model class for event types
        /// </summary>
        /// <param name="name" type="string">Name for the event type</param>

        this.id = null;
        this.name = name || null;
    };

    lifeStory.EventDetail = function eventDetail(detailId, eventName, creatureCount, eventId)
    {
        /// <summary>
        ///     Model class for event details
        /// </summary>
        /// <param name="detailId" type="number">The sequential number for the detail</param>
        /// <param name="eventName" type="string">The name for the detail</param>
        /// <param name="creatureCount" type="number">The creature count for the detail</param>
        /// <param name="eventId" type="number">The Id of the event the detail belongs to</param>

        this.id = detailId || null;
        this.eventId = parseInt(eventId, 10) || null;
        this.name = eventName || null;
        this.creatureCount = parseInt(creatureCount, 10) || null;
    };

    lifeStory.Event = function event(eventTypeId, characterCount, experience, description, date)
    {
        /// <summary>
        ///     Model class for events
        /// </summary>
        /// <param name="eventTypeId" type="number">The Id for the event's type</param>
        /// <param name="characterCount" type="number">The number of characters present</param>
        /// <param name="experience" type="number">The amount of experience from the event</param>
        /// <param name="description" type="string">A description of the event</param>
        /// <param name="date" type="date">
        ///     The date of the event. Set by default to today's date when saving
        /// </param>

        this.id = null;
        this.eventTypeId = parseInt(eventTypeId, 10) || null;
        this.characterCount = parseInt(characterCount, 10) || null;

        this.experience = parseInt(experience, 10);

        if (isNaN(this.experience) || this.experience < 0)
        {
            this.experience = null;
        }

        this.description = description || null;

        this.date = date || null;
        this.eventTypeName = null;
        this.eventDetails = null;
    };

    lifeStory.SelectEntry = function selectEntry(key, value)
    {
        /// <summary>
        ///     Key value pair for select list options
        /// </summary>
        /// <param name="key" type="any">The value for the option</param>
        /// <param name="value" type="any">The text for the option</param>

        this.key = key;
        this.value = value;
    };

    lifeStory.CallbackData = function callbackData(formIdToReset, redirectToPageId,
        successMessage, failureMessage)
    {
        /// <summary>
        ///     Class for additional function callback data
        /// </summary>
        /// <param name="formIdToReset" type="string">Id of the form to reset</param>
        /// <param name="redirectToPageId" type="string">Id of the page to redirect to</param>
        /// <param name="successMessage" type="string">Success message to display on success</param>
        /// <param name="failureMessage" type="string">Error message to display on errors</param>

        this.formIdToReset = formIdToReset || null;
        this.redirectToPageId = redirectToPageId || null;

        this.successMessage = successMessage || '';
        this.failureMessage = failureMessage || '';
    };

})(window.lifeStory);
///#source 1 1 /js/database.js
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
///#source 1 1 /js/util.js
/* util.js
 * Purpose: Utility functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with utility functions located under lifeStory.util
(function (lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var utilLibrary = lifeStory.util = {};

    function reduceToOnlyInputs(element)
    {
        /// <summary>
        ///     Reduces the element down to only input elements
        /// </summary>
        /// <param name="element" type="DOMElement">The element to filter on</param>
        /// <returns type="jQuery">jQuery object of the input elements</returns>

        return $(':input:not(button)', element);
    }

    utilLibrary.createEventFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.Event with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.CharacterClass">The event created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var id = parseInt($inputs.filter('[name=id]').val(), 10) || null;
        var eventTypeId = $inputs.filter('[name=eventType]').val();
        var characterCount = $inputs.filter('[name=characterCount]').val();
        var experience = $inputs.filter('[name=experience]').val();
        var description = $inputs.filter('[name=description]').val();

        var event = new lifeStory.Event(eventTypeId, characterCount, experience, description);
        event.id = id;

        return event;
    };

    utilLibrary.createEventDetailsFromInput = function(form, eventTypeId)
    {
        /// <summary>
        ///     Pulls input from a form and returns an array of lifeStory.EventDetail with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="[lifeStory.EventDetail]">The event details created from the form input</returns>

        var $form = $(form);

        var eventDetailItems = [];

        if (eventTypeId === lifeStory.NON_COMBAT_EVENT ||
            eventTypeId === lifeStory.RESURRECT_EVENT ||
            eventTypeId === lifeStory.DEATH_EVENT)
        {
            var eventName = $form.find('[name=eventName]').val().trim();
            var creatureCount = null;

            eventDetailItems.push(new lifeStory.EventDetail(1, eventName, creatureCount));
        }
        else
        {
            var detailCounter = 0;

            $('fieldset', $form).each(function ()
            {
                var $inputs = reduceToOnlyInputs(this);

                var detailId = detailCounter + 1;
                var enemyName = $inputs.filter('[name=enemyName]').val().trim();

                var creatureCount = $inputs.filter('[name=creatureCount]').val() || null;

                if (enemyName && creatureCount)
                {
                    eventDetailItems.push(new lifeStory.EventDetail(detailId, enemyName, creatureCount));

                    detailCounter++;
                }
            });
        }

        return eventDetailItems;
    };

    utilLibrary.createCharacterFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.Character with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.Character">The character created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var character = new lifeStory.Character();

        character.id = $inputs.filter('[name=id]').val() || null;
        character.name = $inputs.filter('[name=name]').val().trim();
        character.raceId = $inputs.filter('[name=raceId]').val();
        character.classId = $inputs.filter('[name=classId]').val();
        character.living = $inputs.filter('[name=living]').val() || lifeStory.ALIVE;
        character.details = $inputs.filter('[name=details]').val().trim() || null;

        return character;
    };

    utilLibrary.createRaceFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.Race with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.Race">The race created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var raceName = $inputs.filter('[name=raceName]').val().trim();

        return new lifeStory.Race(raceName);
    };

    utilLibrary.createClassFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.CharacterClass with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.CharacterClass">The class created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var className = $inputs.filter('[name=className]').val().trim();

        return new lifeStory.CharacterClass(className);
    };

    utilLibrary.isCombatEvent = function()
    {
        /// <summary>
        ///     Checks if the current form is for a combat event
        /// </summary>
        /// <returns type="bool">True if the form is for a combat event, false otherwise</returns>

        var eventTypeId = $('#eventType option:selected, #editEventForm input[name=eventType]',
            $.mobile.activePage).val();

        return parseInt(eventTypeId, 10) === lifeStory.COMBAT_EVENT;
    };

    utilLibrary.triggerReset = function(formIdToReset)
    {
        /// <summary>
        ///     Triggers a reset on the form with the matching id
        /// </summary>
        /// <param name="formIdToReset" type="string">The id of the form to reset</param>

        $('#' + formIdToReset).trigger('reset');
    };

    utilLibrary.redirectToPage = function (pageId)
    {
        /// <summary>
        ///     Changes page to the page with the id matching pageId
        /// </summary>
        /// <param name="pageId" type="string">The id of the page to switch to</param>

        $.mobile.changePage('#' + pageId);
    };

    utilLibrary.redirectOnSuccessDialogClose = function(redirectToPageId)
    {
        /// <summary>
        ///     Redirects to the page identified by redirectToPageId when the success dialog is closed
        /// </summary>
        /// <param name="redirectToPageId" type="string">Id of the page to redirect to</param>

        // Unbind any previous events and bind the new one
        $('#successBtn').off('tap').one('tap', function(event)
        {
            event.stopImmediatePropagation();
            event.preventDefault();

            utilLibrary.redirectToPage(redirectToPageId);
        });
    };

    utilLibrary.convertToSelectEntrys = function(resultSet, valueName, callback)
    {
        /// <summary>
        ///     Converts the values from a resultSet into an array of key value lifeStory.SelectEntrys
        /// </summary>
        /// <param name="resultSet">The result set</param>
        /// <param name="valueName" type="string">The column name to pull the value from</param>
        /// <param name="callback" type="function">The function to call with the converted results</param>

        var results = [];

        for (var i = 0; i < resultSet.rows.length; i++)
        {
            results[i] = new lifeStory.SelectEntry(resultSet.rows.item(i).id,
                resultSet.rows.item(i)[valueName]);
        }

        callback(results);
    };

    utilLibrary.getLevel = function(xpTotal)
    {
        /// <summary>
        ///     Calculates a character's level based on their total XP
        /// </summary>
        /// <param name="xpTotal" type="number">The amount of XP the character has accrued</param>
        /// <returns type="number">The character's current level</returns>

        xpTotal = xpTotal || 0;

        // you are level n if your xp is between index n-1 and n
        for (var i = 1; i < lifeStory.LEVEL_VALUES.length - 1; i++)
        {
            if (xpTotal < lifeStory.LEVEL_VALUES[i])
            {
                return i;
            }
        }

        // return highest level if above the highest xp requirement
        return lifeStory.LEVEL_VALUES.length;
    };

    utilLibrary.experienceToNextLevel = function(xpTotal)
    {
        /// <summary>
        ///     Calculates the amount of experience until the next level based on total XP
        /// </summary>
        /// <param name="xpTotal" type="number">The total amount of XP the character has accrued</param>
        /// <returns type="number">The amount of experience until the character's next level</returns>

        var level = utilLibrary.getLevel(xpTotal);

        return lifeStory.LEVEL_VALUES[level] - xpTotal;
    };

    utilLibrary.handleAndroidBackButton = function(event)
    {
        /// <summary>
        ///     Handles the Android backbutton so that it does what you would expect it to
        ///     given the current context
        /// </summary>
        /// <param name="event" type="jQuery Event">The enhanced backbutton event</param>

        var activePage = $.mobile.activePage.attr('id');

        switch (activePage)
        {
            case 'home':
                event.preventDefault();
                break;
            case 'eventLog':
                lifeStory.util.redirectToPage('home');
                break;
            case 'characterDetails':
                lifeStory.util.redirectToPage('eventLog');
                break;
            case 'eventDetails':
                lifeStory.util.redirectToPage('eventLog');
                break;
            case 'createCharacter':
                lifeStory.util.redirectToPage('home');
                break;
            case 'addClass':
            case 'addRace':
                lifeStory.util.redirectToPage(lifeStory.values.goBackToPageId);
                break;
            case 'editCharacter':
                lifeStory.util.redirectToPage('characterDetails');
                break;
            case 'createEvent':
                lifeStory.util.redirectToPage('eventLog');
                break;
            case 'editEvent':
                lifeStory.util.redirectToPage('eventDetails');
                break;
            case 'resurrectEvent':
                lifeStory.util.redirectToPage('eventLog');
                break;
            case 'deathEvent':
                lifeStory.util.redirectToPage('eventLog');
                break;
            case 'customize':
                event.preventDefault();
                break;
            case 'settings':
                event.preventDefault();
                break;
            default:
                event.preventDefault();
        }
    };

})(window.lifeStory, jQuery);
///#source 1 1 /js/dataAccess.js
/* dataAccess.js
 * Purpose: Data access methods for lifeStory
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.19: Created
 */

// Extend lifeStory with data access functions located under lifeStory.dataAccess
(function(window, lifeStory, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var dataAccessLibrary = lifeStory.dataAccess = {};

    function dbFailure(errorMessage, transaction, error)
    {
        /// <summary>
        ///     Displays the passed in message. Logs the error.
        /// </summary>

        lifeStory.ui.displayErrorMessage(errorMessage);

        if (error === undefined || error === null)
        {
            // This is a transaction error so error is passed in as the transaction argument
            console.error(transaction.message, transaction);
        }
        else
        {
            console.error(error.message, error, transaction);
        }
    }

    function genericSuccessCallback(callbackData)
    {
        /// <summary>
        ///     A generic success callback which displays a success message and
        ///     optionally resets a form and redirects to a page
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">
        ///     Callback data containing form Id to reset, success message, and redirect page
        /// </param>

        if (callbackData.formIdToReset)
        {
            lifeStory.util.triggerReset(callbackData.formIdToReset);
        }

        lifeStory.ui.displaySuccessMessage(callbackData.successMessage);

        if (callbackData.redirectToPageId)
        {
            lifeStory.util.redirectOnSuccessDialogClose(callbackData.redirectToPageId);
        }
    }

    function refreshDeleteRaceUI()
    {
        /// <summary>
        ///     Refreshes the race delete select list UI
        /// </summary>

        lifeStory.ui.populateRaceList('deleteRaceSelect', lifeStory.ui.refreshDeleteRaceUIState);
    }

    function saveRaceSuccess(callbackData)
    {
        /// <summary>
        ///     Success callback for saving a race
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        genericSuccessCallback(callbackData);        

        if (callbackData.isCustomizePage)
        {
            refreshDeleteRaceUI();
        }
    }

    dataAccessLibrary.saveRaceToDb = function (callbackData, form)
    {
        /// <summary>
        ///     Saves the race to the database and displays a message of the outcome
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">The form to get data from</param>

        if (!callbackData.isCustomizePage)
        {
            callbackData.redirectToPageId = lifeStory.values.goBackToPageId;
        }

        var saveSuccess = saveRaceSuccess.bind(null, callbackData);
        var saveFailure = dbFailure.bind(null, callbackData.failureMessage);

        lifeStory.db.addRace(lifeStory.util.createRaceFromInput(form), saveSuccess, saveFailure);
    };

    function deleteRaceSuccess(transaction, resultSet)
    {
        /// <summary>
        ///     Success callback for deleting a race
        /// </summary>
        /// <param name="transaction">The transaction</param>
        /// <param name="resultSet">ResultSet from the transaction</param>

        if (resultSet.rowsAffected >= 1)
        {
            refreshDeleteRaceUI();
            lifeStory.ui.displaySuccessMessage('The race was deleted successfully.');
        }
        else
        {
            lifeStory.ui.displayErrorMessage('Sorry, you can\'t delete that race because it is in' +
                ' use by a character.');
        }
    }

    dataAccessLibrary.deleteRace = function(raceId)
    {
        /// <summary>
        ///     Attempts to delete the race identified by raceId and displays a message of the outcome
        /// </summary>
        /// <param name="raceId" type="number">The Id of the race to delete</param>

        var deleteFailure = dbFailure.bind(null, 'Failed to delete the race.');

        lifeStory.db.deleteRace(raceId, deleteRaceSuccess, deleteFailure);
    };

    function refreshDeleteClassUI()
    {
        /// <summary>
        ///     Refreshes the class delete select list UI
        /// </summary>

        lifeStory.ui.populateClassList('deleteClassSelect', lifeStory.ui.refreshDeleteClassUIState);
    }

    function saveClassSuccess(callbackData)
    {
        /// <summary>
        ///     Success callback for saving a class
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        genericSuccessCallback(callbackData);

        if (callbackData.isCustomizePage)
        {
            refreshDeleteClassUI();
        }
    }

    dataAccessLibrary.saveClassToDb = function (callbackData, form)
    {
        /// <summary>
        ///     Saves a new class to the database
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">The form to get data from</param>

        if (!callbackData.isCustomizePage)
        {
            callbackData.redirectToPageId = lifeStory.values.goBackToPageId;
        }

        var saveSuccess = saveClassSuccess.bind(null, callbackData);
        var saveFailure = dbFailure.bind(null, callbackData.failureMessage);

        lifeStory.db.addClass(lifeStory.util.createClassFromInput(form), saveSuccess, saveFailure);
    };

    function deleteClassSuccess(transaction, resultSet)
    {
        /// <summary>
        ///     Success callback for deleting a class
        /// </summary>
        /// <param name="transaction">The transaction</param>
        /// <param name="resultSet">ResultSet from the transaction</param>

        if (resultSet.rowsAffected >= 1)
        {
            refreshDeleteClassUI();
            lifeStory.ui.displaySuccessMessage('The class was deleted successfully.');
        }
        else
        {
            lifeStory.ui.displayErrorMessage('Sorry, you can\'t delete that class because it is ' +
                'in use by a character.');
        }
    }

    dataAccessLibrary.deleteClass = function(classId)
    {
        /// <summary>
        ///     Attempts to delete the class identified by classId and displays a message of the outcome
        /// </summary>
        /// <param name="classId" type="number">The Id of the class to delete</param>

        var deleteFailure = dbFailure.bind(null, 'Failed to delete the class.');

        lifeStory.db.deleteClass(classId, deleteClassSuccess, deleteFailure);
    };

    function saveCharacterSuccess(callbackData, transaction, resultSet)
    {
        /// <summary>
        ///     Success callback for saving a character
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="transaction">The transaction</param>
        /// <param name="resultSet">ResultSet from the insert transaction</param>

        lifeStory.values.characterId = resultSet.insertId;

        genericSuccessCallback(callbackData);
    }

    dataAccessLibrary.saveCharacterToDb = function (callbackData, form)
    {
        /// <summary>
        ///     Saves a new character to the database
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">The form to get data from</param>

        var saveSuccess = saveCharacterSuccess.bind(null, callbackData);
        var saveFailure = dbFailure.bind(null, callbackData.failureMessage);

        var newCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = newCharacter.name;
        lifeStory.values.characterAlive = newCharacter.living;

        lifeStory.db.addCharacter(newCharacter, saveSuccess, saveFailure);
    };

    dataAccessLibrary.updateCharacterInDb = function (callbackData, form)
    {
        /// <summary>
        ///     Updates a character in the database
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">The form to get data from</param>

        var updateSuccess = genericSuccessCallback.bind(null, callbackData);
        var updateFailure = dbFailure.bind(null, callbackData.failureMessage);

        var updatedCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = updatedCharacter.name;
        lifeStory.values.characterAlive = updatedCharacter.living;

        lifeStory.db.updateCharacter(updatedCharacter, updateSuccess, updateFailure);
    };

    function deleteCharacterSuccess(callbackData)
    {
        /// <summary>
        ///     Success callback for deleting a character
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        lifeStory.values.characterId = null;
        lifeStory.values.characterName = null;
        lifeStory.values.characterAlive = null;

        genericSuccessCallback(callbackData);
    }

    dataAccessLibrary.deleteCharacter = function(characterId, callbackData)
    {
        /// <summary>
        ///     Attempts to delete the character identified by characterId and 
        ///     displays a message of the outcome
        /// </summary>
        /// <param name="characterId" type="number">The Id of the character to delete</param>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        var deleteSuccess = deleteCharacterSuccess.bind(null, callbackData);
        var deleteFailure = dbFailure.bind(null, 'Failed to delete the character.');

        lifeStory.db.deleteCharacter(characterId, deleteSuccess, deleteFailure);
    };

    dataAccessLibrary.saveEventToDb = function(callbackData, form)
    {
        /// <summary>
        ///     Saves a new event to the database
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">The form to get data from</param>

        var saveSuccess = genericSuccessCallback.bind(null, callbackData);
        var saveFailure = dbFailure.bind(null, callbackData.failureMessage);

        var newEvent = lifeStory.util.createEventFromInput(form);
        var newEventDetails = lifeStory.util.createEventDetailsFromInput(form, newEvent.eventTypeId);
        var characterId = lifeStory.values.characterId;

        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, saveSuccess, saveFailure);
    };

    dataAccessLibrary.updateEventInDb = function(callbackData, form)
    {
        /// <summary>
        ///     Updates an event in the database
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">The form to get data from</param>

        var saveSuccess = genericSuccessCallback.bind(null, callbackData);
        var saveFailure = dbFailure.bind(null, callbackData.failureMessage);

        var event = lifeStory.util.createEventFromInput(form);
        var eventDetails = lifeStory.util.createEventDetailsFromInput(form, event.eventTypeId);

        lifeStory.db.updateEvent(event, eventDetails, saveSuccess, saveFailure);
    };

    function deleteEventSuccess(callbackData)
    {
        /// <summary>
        ///     Success callback for deleting an event
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        lifeStory.values.eventId = null;

        genericSuccessCallback(callbackData);
    }

    dataAccessLibrary.deleteEvent = function(eventId, callbackData)
    {
        /// <summary>
        ///     Deletes the event identified by eventId and displays a message of the outcome
        /// </summary>
        /// <param name="eventId" type="number">The Id of the event to delete</param>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        var deleteSuccess = deleteEventSuccess.bind(null, callbackData);
        var deleteFailure = dbFailure.bind(null, 'Failed to delete the event.');
        var characterId = lifeStory.values.characterId;

        lifeStory.db.deleteEvent(eventId, characterId, deleteSuccess, deleteFailure);
    };

    function otherEventSuccess(callbackData, newAliveStatus)
    {
        /// <summary>
        ///     Success callback for resurrection and death event database functions
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Addition callback data</param>
        /// <param name="newAliveStatus" type="number">
        ///     The new living status value for the character
        /// </param>

        lifeStory.values.characterAlive = newAliveStatus;

        genericSuccessCallback(callbackData);
    }

    function prepareOtherEventData(callbackData, form)
    {
        /// <summary>
        ///     Setup data for resurrection and death events
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>
        /// <param name="form" type="DOMElement">Form to get data from</param>
        /// <returns type="object">
        ///     Object containing successCallback, failureCallback, the event, and the events details
        /// </returns>

        var successCallback = otherEventSuccess.bind(null, callbackData);
        var saveFailure = dbFailure.bind(null, callbackData.failureMessage);

        var event = lifeStory.util.createEventFromInput(form);

        if (callbackData.isResurrection)
        {
            event.eventTypeId = lifeStory.RESURRECT_EVENT;
        }
        else
        {
            event.eventTypeId = lifeStory.DEATH_EVENT;
        }

        var eventDetails = lifeStory.util.createEventDetailsFromInput(form, event.eventTypeId);

        event.experience = null;
        event.characterCount = 1;

        return {
            successCallback: successCallback,
            failureCallback: saveFailure,
            event: event,
            eventDetails: eventDetails
        };
    }

    dataAccessLibrary.saveOtherEventToDb = function(callbackData, form)
    {
        /// <summary>
        ///     Saves a resurrection or death event to the DB.
        /// </summary>
        /// <param name="callbackData" type="object">
        ///     Additional callback data to pass to the success callback
        /// </param>
        /// <param name="form" type="DOM Element">The form to get data from</param>

        var data = prepareOtherEventData(callbackData, form);

        var newAliveStatus = data.event.eventTypeId === lifeStory.RESURRECT_EVENT
            ? lifeStory.ALIVE
            : lifeStory.DEAD;

        var saveSuccess = data.successCallback.bind(null, newAliveStatus);
        var saveFailure = data.failureCallback;

        var newEvent = data.event;

        var newEventDetails = data.eventDetails;
        var characterId = lifeStory.values.characterId;

        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, saveSuccess, saveFailure);
    };

    dataAccessLibrary.updateOtherEventInDb = function (callbackData, form)
    {
        /// <summary>
        ///     Updates a resurrection or death event in the DB.
        /// </summary>
        /// <param name="callbackData" type="object">
        ///     Additional callback data to pass to the success callback
        /// </param>
        /// <param name="form" type="DOM Element">The form to get data from</param>

        var data = prepareOtherEventData(callbackData, form);

        var updateSuccess = data.successCallback;
        var updateFailure = data.failureCallback;

        var updatedEvent = data.event;
        var updatedEventDetails = data.eventDetails;

        lifeStory.db.updateEvent(updatedEvent, updatedEventDetails, updateSuccess, updateFailure);
    };

    function clearDataSuccess(successMessage)
    {
        /// <summary>
        ///     Callback function for functions which clear character data or the whole database
        /// </summary>
        /// <param name="successMessage" type="string">The success message to display</param>

        lifeStory.values.characterId = null;
        lifeStory.values.characterAlive = null;
        lifeStory.values.characterName = null;
        lifeStory.values.eventId = null;

        lifeStory.ui.displaySuccessMessage(successMessage);
    }

    dataAccessLibrary.clearCharacterData = function ()
    {
        /// <summary>
        ///     Clears all character data from the database and displays a success or failure message
        /// </summary>

        var clearSuccess = clearDataSuccess.bind(null, 'All characters deleted successfully.');
        var clearFailure = dbFailure.bind(null, 'Failed to delete all characters. All character data is still intact.');

        lifeStory.db.clearCharacterData(clearSuccess, clearFailure);
    };

    dataAccessLibrary.clearDatabase = function()
    {
        /// <summary>
        ///     Clears all data from the database and displays a success or failure message
        /// </summary>

        var clearSuccess = clearDataSuccess.bind(null, 'All data deleted successfully.');
        var clearFailure = dbFailure.bind(null, 'Failed to delete all data. All data is still intact.');

        lifeStory.db.dropAllTables(clearSuccess, clearFailure);
    };

})(window, window.lifeStory);
///#source 1 1 /js/ui.js
/* ui.js
 * Purpose: UI functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with ui functions located under lifeStory.ui
(function (lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by ui but is undefined.';
    }

    var uiLibrary = lifeStory.ui = {};

    // Displays a confirmation dialog and returns the users choice
    uiLibrary.displayConfirmation = function(title, message, acceptCallback, denyCallback)
    {
        /// <summary>
        ///     Displays a confirmation popup to the user<br/>
        ///     #confirmAccept is the accept button<br/>
        ///     #confirmDeny is the decline button
        /// </summary>
        /// <param name="title" type="string">Title to display</param>
        /// <param name="message" type="string">Message to display</param>
        /// <param name="acceptCallback" type="function">
        ///     Optional. Callback to call if the user accepts
        /// </param>
        /// <param name="denyCallback" type="function">
        ///     Optional. Callback to call if the user declines
        /// </param>

        $('#confirmTitle').text(title);
        $('#confirmMessage').text(message);
        $('#confirmDialog').popup('open');

        if (acceptCallback)
        {
            $('#confirmAccept').one('tap', function()
            {
                // Make this run after all of the event handlers so the dialog is closed first
                setTimeout(acceptCallback, 50);

                $('#confirmDeny').off('tap');
            });
        }

        if (denyCallback)
        {
            $('#confirmDeny').one('tap', function()
            {
                // Make this run after all of the event handlers
                setTimeout(denyCallback, 50);
                $('#confirmAccept').off('tap');
            });
        }
    };

    uiLibrary.displaySuccessMessage = function(message)
    {
        /// <summary>
        ///     Displays the passed in success message to the user
        /// </summary>
        /// <param name="message" type="string">Success message to display</param>

        $('#successMessage').text(message);
        $('#successDialog').popup('open');
    };

    uiLibrary.displayErrorMessage = function(message)
    {
        /// <summary>
        ///     Displays the passed in error message to the user
        /// </summary>
        /// <param name="message" type="string">Error message to display</param>

        $('#errorMessage').text(message);
        $('#errorDialog').popup('open');
    };

    uiLibrary.filterCharacterList = function()
    {
        /// <summary>
        ///     Filters the character list to remove deceased characters if the source checkbox is
        ///     unchecked
        /// </summary>

        lifeStory.values.showDeceased = this.checked;

        var hideDead = !this.checked; // We show when checked, so flip the value

        // Add class if hideDead is true, otherwise remove it
        $('#characterList li[data-theme=f]').toggleClass('ui-screen-hidden', hideDead);
    };

    uiLibrary.refreshDeleteRaceUIState = function ()
    {
        /// <summary>
        ///     Updates the state of the delete race select list to match its current options
        /// </summary>

        if ($('#deleteRaceSelect option:first').is(':disabled'))
        {
            $('#deleteRace').button('disable');
            $('#deleteRaceSelect').selectmenu('disable');
        }
        else
        {
            $('#deleteRace').button('enable');
            $('#deleteRaceSelect').selectmenu('enable');
        }
    };

    uiLibrary.refreshDeleteClassUIState = function ()
    {
        /// <summary>
        ///     Updates the state of the delete class select list to match its current options
        /// </summary>

        if ($('#deleteClassSelect option:first').is(':disabled'))
        {
            $('#deleteClass').button('disable');
            $('#deleteClassSelect').selectmenu('disable');
        }
        else
        {
            $('#deleteClass').button('enable');
            $('#deleteClassSelect').selectmenu('enable');
        }
    };

    uiLibrary.showCombatDetailInputs = function(isEdit)
    {
        /// <summary>
        ///     Shows the combat detail inputs
        /// </summary>
        /// <param name="isEdit" type="boolean">
        ///     If true, shows the inputs on the edit page. Otherwise, shows the inputs on the create page
        /// </param>

        if (isEdit)
        {
            $('#editEventDetailInputs').hide();
            $('#editCombatDetailInputs').show();
        }
        else
        {
            $('#eventDetailInputs').hide();
            $('#combatDetailInputs').show();
        }
    };

    uiLibrary.showEventDetailInputs = function(isEdit)
    {
        /// <summary>
        ///     Shows the event detail inputs
        /// </summary>
        /// <param name="isEdit" type="boolean">
        ///     If true, shows the inputs on the edit page. Otherwise, shows the inputs on the create page
        /// </param>

        if (isEdit)
        {
            $('#editCombatDetailInputs').hide();
            $('#editEventDetailInputs').show();
        }
        else
        {
            $('#combatDetailInputs').hide();
            $('#eventDetailInputs').show();
        }
    };

    uiLibrary.populateSelectList = function (selectElementId, data)
    {
        /// <summary>
        ///     Populate the select element matching selectElementId with key and values from data
        /// </summary>
        /// <param name="selectElementId" type="string">Id of the select element to add options to</param>
        /// <param name="data" type="Array">
        ///     An array containing the data as lifeStory.SelectEntry objects
        /// </param>

        if (!Array.isArray(data))
        {
            throw 'The data argument for populateSelectList must be an array';
        }
        else if (data.length > 0 && !(data[0] instanceof lifeStory.SelectEntry))
        {
            throw 'The entries in the data argument for populateSelectList must be instances ' +
                'of lifeStory.SelectEntry';
        }

        var previousValue = parseInt($('#' + selectElementId).val(), 10);

        $('#' + selectElementId).children().remove().end();

        var $option = $('<option></option>');

        for (var i = 0; i < data.length; i++)
        {
            var currentOption = $option.clone();
            currentOption.val(data[i].key).text(data[i].value);

            if (data[i].key === previousValue)
            {
                currentOption.prop('selected', 'selected');
            }

            $('#' + selectElementId).append(currentOption);
        }

        if (data.length === 0)
        {
            $('#' + selectElementId).append('<option disabled>-- No Races Created --</option>');
        }

        $('#' + selectElementId).selectmenu('refresh');
    };

    uiLibrary.populateClassList = function(classListId, populationCompleteCallback)
    {
        /// <summary>
        ///     Populates the class lists with the data in the database
        /// </summary>
        /// <param name="classListId" type="string">Id of the class list to populate</param>
        /// <param name="refreshDeleteUI" type="string">
        ///     Callback to call when the list has been populated
        /// </param>

        lifeStory.db.getClasses(function(selectEntries)
        {
            uiLibrary.populateSelectList(classListId, selectEntries);

            if (typeof populationCompleteCallback === 'function')
            {
                populationCompleteCallback();
            }
        });
    };

    uiLibrary.populateRaceList = function(raceListId, populationCompleteCallback)
    {
        /// <summary>
        ///     Populates the race lists with the data in the database
        /// </summary>
        /// <param name="raceListId" type="string">Id of the race list to populate</param>
        /// <param name="refreshDeleteUI" type="string">
        ///     Callback to call when the list has been populated
        /// </param>

        lifeStory.db.getRaces(function(selectEntries)
        {
            uiLibrary.populateSelectList(raceListId, selectEntries);

            if (typeof populationCompleteCallback === 'function')
            {
                populationCompleteCallback();
            }
        });
    };

    uiLibrary.populateRaceAndClassList = function (raceListId, classListId, refreshDeleteUI)
    {
        /// <summary>
        ///     Populates the race and class lists with the data in the database
        /// </summary>
        /// <param name="raceListId" type="string">Id of the race list to populate</param>
        /// <param name="classListId" type="string">Id of the class list to populate</param>
        /// <param name="refreshDeleteUI" type="boolean">
        ///     True if the delete UI on customize page should be refreshed
        /// </param>

        uiLibrary.populateRaceList(raceListId,
            refreshDeleteUI ? uiLibrary.refreshDeleteRaceUIState : undefined);

        uiLibrary.populateClassList(classListId,
            refreshDeleteUI ? uiLibrary.refreshDeleteClassUIState : undefined);
    };

    uiLibrary.duplicateInputSet = function(insertAfterSelector, templateElementId, removeButtonSelector)
    {
        /// <summary>
        ///     Duplicates combat event the input set identified by templateElementId and inserts
        ///     it after insertAfterSelector. Shows removeButtonSelector
        /// </summary>
        /// <param name="insertAfterSelector" type="string">
        ///     jQuery selector string for the element to place the duplicated input set after
        /// </param>
        /// <param name="templateElementId" type="string">Id of the templateElement to duplicate</param>
        /// <param name="removeButtonSelector" type="string">
        ///     jQuery selector for the remove button to show if the element to append to contains only
        ///     the templateElementId element
        /// </param>

        if ($(insertAfterSelector + ':not(#' + templateElementId + ')').length === 0)
        {
            $(removeButtonSelector).closest('.ui-btn').show();
        }

        // Use the autocomplete source already on the first input to avoid accessing the db again
        var autocompleteTitles = $('#' + templateElementId + 
            ' input[name=enemyName]:first-child').autocomplete('option', 'source');

        $(insertAfterSelector).after(
            $('#' + templateElementId).
                clone().
                removeAttr('id'). // Remove id from the clone
                find('label').remove(). // Find and remove the labels
                end(). // Collapse the jQuery object down to keep only the remaining elements
                find('input').removeAttr('id').val(''). // Find the inputs and remove their ids and values
                end(). // Collapse the jQuery object down again
                find('input[name=enemyName]'). // Find the new enemy name input
                autocomplete(
                {
                    source: autocompleteTitles // Give the new input the same autocomplete as the first one
                }).
                end() // Collapse the new input fields down
        );
    };

    uiLibrary.removeInputSet = function(toRemoveSelector, removeButtonSelector)
    {
        /// <summary>
        ///     Removes combat event input sets which match toRemoveSelector and hides the remove button
        ///     if no extra input sets remain
        /// </summary>
        /// <param name="toRemoveSelector" type="string">
        ///     jQuery selector string for the input sets to remove
        /// </param>
        /// <param name="removeButtonSelector" type="string">
        ///     jQuery selector for the remove button to hide if no elements matching 
        ///     toRemoveSelector remain
        /// </param>

        $(toRemoveSelector).remove();

        if ($(toRemoveSelector).length === 0)
        {
            $(removeButtonSelector).closest('.ui-btn').hide();
        }
    };

    function characterLinkClicked(event)
    {
        /// <summary>
        ///     Sets the values of lifeStory.values to the values for the clicked character
        /// </summary>
        /// <param name="event" type="jQuery.Event">
        ///     Event containing the character information for the clicked character
        /// </param>

        lifeStory.values.characterId = event.data.id;
        lifeStory.values.characterName = event.data.name;
        lifeStory.values.characterAlive = event.data.alive;
    }

    uiLibrary.populateCharacterList = function(listViewId, itemElementType)
    {
        /// <summary>
        ///     Populates the character list with all of the user's characters
        /// </summary>

        lifeStory.db.getCharacters(function (characters)
        {
            var $listContainer = $('#' + listViewId);
            var $reviewItem = $(':first(' + itemElementType + ')', $listContainer).
                clone().
                removeClass('ui-screen-hidden');

            // Remove everything except the first item. First item is hidden and used as a template
            $(':first(' + itemElementType + ')', $listContainer).siblings().remove();

            for (var i = 0; i < characters.length; i++)
            {
                var $currentItem = $reviewItem.clone();
                var character = characters[i];

                $('[data-property=name]', $currentItem).text(character.name);
                $('[data-property=raceName]', $currentItem).text(character.raceName);
                $('[data-property=className]', $currentItem).text(character.className);

                if (character.living === lifeStory.DEAD)
                {
                    $currentItem.attr('data-theme', 'f').
                        removeClass('ui-btn-up-c').addClass('ui-btn-up-f');
                }

                $('a', $currentItem).on('tap',
                    { id: character.id, name: character.name, alive: character.living },
                    characterLinkClicked
                );

                $listContainer.append($currentItem);
            }

            if (characters.length === 0)
            {
                $reviewItem.
                    find('a').
                    attr('href', '#createCharacter').
                    find('h1').
                    text('Add a Character').
                    siblings().
                    remove();

                // Change icon to a plus
                $reviewItem.find('span').removeClass('ui-icon-arrow-r').addClass('ui-icon-plus');

                $listContainer.append($reviewItem);
            }

            $listContainer.listview('refresh');

            // Manually invoke filterCharacterList with 'this' set to the showDeceased checkbox
            uiLibrary.filterCharacterList.call($('#showDeceased')[0]);
        });
    };

    function eventLogItemClicked(event)
    {
        /// <summary>
        ///     Sets the value of lifeStory.values.eventId to the Id of the clicked event
        /// </summary>
        /// <param name="event" type="jQuery.Event">
        ///     Event containing the eventId for the clicked event
        /// </param>

        lifeStory.values.eventId = event.data.eventId;
    }

    uiLibrary.populateEventLog = function (listViewId, itemElementType)
    {
        /// <summary>
        ///     Populates the event log page with the events for the selected character
        /// </summary>

        $('#eventLog h2[data-property=characterName]').text(lifeStory.values.characterName);

        lifeStory.db.getCharactersEvents(lifeStory.values.characterId, function (events)
        {
            var $listContainer = $('#' + listViewId);
            var $reviewItem = $(':first(' + itemElementType + ')', $listContainer).
                clone().
                removeClass('ui-screen-hidden');

            // Remove everything except the first item. First item is hidden and used as a template
            $(':first(' + itemElementType + ')', $listContainer).siblings().remove();

            for (var i = 0; i < events.length; i++)
            {
                var $currentItem = $reviewItem.clone();
                var event = events[i];

                var title = '';
                
                if (event.eventTypeId === lifeStory.COMBAT_EVENT)
                {
                    title = 'Defeated: ';

                    event.eventDetails.forEach(function(item)
                    {
                        title += item.creatureCount + ' ' + item.name + ', ';
                    });

                    title = title.slice(0, -2);
                }
                else if (event.eventTypeId === lifeStory.NON_COMBAT_EVENT)
                {
                    title = event.eventDetails[0].name;
                }
                else if (event.eventTypeId === lifeStory.RESURRECT_EVENT)
                {
                    title = 'Resurrected by: ' + event.eventDetails[0].name;
                }
                else if (event.eventTypeId === lifeStory.DEATH_EVENT)
                {
                    title = 'Died to: ' + event.eventDetails[0].name;
                }
                else
                {
                    title = event.eventTypeName;
                }

                $('[data-property=title]', $currentItem).text(title);

                if (event.eventTypeId === lifeStory.COMBAT_EVENT ||
                    event.eventTypeId === lifeStory.NON_COMBAT_EVENT)
                {
                    var characterExperience = Math.floor(event.experience / event.characterCount);

                    if (characterExperience > 0)
                    {
                        $('[data-property=experience]', $currentItem).text(characterExperience + ' XP');
                    }
                }

                if (event.eventTypeId === lifeStory.DEATH_EVENT)
                {
                    $currentItem.attr('data-theme', 'f').
                        removeClass('ui-btn-up-c').addClass('ui-btn-up-f');
                }
                else if (event.eventTypeId === lifeStory.RESURRECT_EVENT)
                {
                    $currentItem.attr('data-theme', 'g').
                        removeClass('ui-btn-up-c').addClass('ui-btn-up-g');
                }

                $('a', $currentItem).on('tap', { eventId: event.id }, eventLogItemClicked);

                $listContainer.append($currentItem);
            }

            if (events.length === 0)
            {
                $reviewItem.
                    find('a').
                    attr('href', '#createEvent').
                    find('h1').
                    text('Add a character event').
                    siblings().
                    remove();

                // Change icon to a plus
                $reviewItem.find('span').removeClass('ui-icon-arrow-r').addClass('ui-icon-plus');

                $listContainer.append($reviewItem);
            }

            if (lifeStory.values.characterAlive === lifeStory.ALIVE)
            {
                $('#diedButton').removeClass('ui-screen-hidden');
                $('#resurrectButton').addClass('ui-screen-hidden');
            }
            else
            {
                $('#resurrectButton').removeClass('ui-screen-hidden');
                $('#diedButton').addClass('ui-screen-hidden');
            }

            $listContainer.listview('refresh');
        });
    };

    uiLibrary.populateEventDetail = function()
    {
        /// <summary>
        ///     Populates the event details page with the data for the selected event
        /// </summary>

        var characterName = lifeStory.values.characterName;
        var eventId = lifeStory.values.eventId;

        $('#eventDetails h2[data-property=characterName]').text(characterName);

        lifeStory.db.getEvent(eventId, function(event)
        {
            var $detailsTable = $('#eventDetailsTable');

            var typeLabel = '';

            switch (event.eventTypeId)
            {
                case (lifeStory.COMBAT_EVENT):
                    typeLabel = 'Defeated:';
                    break;
                case (lifeStory.NON_COMBAT_EVENT):
                    typeLabel = 'Event Title:';
                    break;
                case (lifeStory.RESURRECT_EVENT):
                    typeLabel = 'Resurrected By:';
                    break;
                case (lifeStory.DEATH_EVENT):
                    typeLabel = 'Killed By:';
                    break;
            }

            $detailsTable.find('[data-property=typeLabel').text(typeLabel);
            $detailsTable.find('[data-property=eventType]').text(event.eventTypeName);
            $detailsTable.find('[data-property=date]').text(event.date);

            var names = '';

            event.eventDetails.forEach(function(item)
            {
                names += (item.creatureCount || '') + ' ' + item.name + ', ';
            });

            names = names.substring(0, names.length - 2).trim();

            $detailsTable.find('[data-property=names]').text(names);

            if (event.eventTypeId === lifeStory.RESURRECT_EVENT ||
                event.eventTypeId === lifeStory.DEATH_EVENT)
            {
                $('#experienceRow').addClass('ui-screen-hidden');
                $('#characterCountRow').addClass('ui-screen-hidden');
            }
            else
            {
                $('#experienceRow').removeClass('ui-screen-hidden');
                $('#characterCountRow').removeClass('ui-screen-hidden');

                $detailsTable.find('[data-property=experience]').text(event.experience);
                $detailsTable.find('[data-property=characterCount]').text(event.characterCount);
            }

            if (event.description)
            {
                $detailsTable.find('[data-property=description]').text(event.description);
                $detailsTable.find('#descriptionLabelRow').removeClass('ui-screen-hidden');
            }
            else
            {
                $detailsTable.find('[data-property=description]').text('');
                $detailsTable.find('#descriptionLabelRow').addClass('ui-screen-hidden');
            }
        });
    };

    function setupEditEventAutocomplete(eventTypeId)
    {
        /// <summary>
        ///     Sets up autocomplete for the edit events page for non combat, resurrect, and death events
        /// </summary>
        /// <param name="eventTypeId" type="number">The eventType Id for the event type</param>

        var eventTypeIds = [];

        if (eventTypeId === lifeStory.DEATH_EVENT)
        {
            eventTypeIds = [eventTypeId, lifeStory.COMBAT_EVENT];
        }
        else
        {
            eventTypeIds = [eventTypeId];
        }

        lifeStory.db.getEventTitles(eventTypeIds, function (titles)
        {
            if (eventTypeId === lifeStory.NON_COMBAT_EVENT)
            {
                $('#editEventName').autocomplete(
                {
                    source: titles[lifeStory.NON_COMBAT_EVENT]
                });
            }
            else if (eventTypeId === lifeStory.RESURRECT_EVENT)
            {
                $('#editCauseOfResurrect').autocomplete(
                {
                    source: titles[lifeStory.RESURRECT_EVENT]
                });
            }
            else if (eventTypeId === lifeStory.DEATH_EVENT)
            {
                $('#editCauseOfDeath').autocomplete(
                {
                    source: titles[lifeStory.DEATH_EVENT].concat(titles[lifeStory.COMBAT_EVENT])
                });
            }
        });
    }

    uiLibrary.populateEventEdit = function(appendToSelector, templateElementId, removeButtonSelector)
    {
        /// <summary>
        ///     Populates the event edit form with the data for the selected event
        /// </summary>

        var eventId = lifeStory.values.eventId;

        lifeStory.db.getEvent(eventId, function(event)
        {
            var $form;
            var eventTypeId = event.eventTypeId;

            if (eventTypeId !== lifeStory.COMBAT_EVENT)
            {
                setupEditEventAutocomplete(eventTypeId);
            }

            if (eventTypeId === lifeStory.COMBAT_EVENT)
            {
                uiLibrary.showCombatDetailInputs(true);

                // Need to have autocomplete setup before any of this can run
                lifeStory.db.getEventTitles([eventTypeId], function(titles)
                {
                    $('#editEnemyName').autocomplete(
                    {
                        source: titles[lifeStory.COMBAT_EVENT]
                    });

                    event.eventDetails.forEach(function(item, index)
                    {
                        var $detailInputs = $(appendToSelector);

                        $detailInputs.find('[name=enemyName]').val(item.name);
                        $detailInputs.find('[name=creatureCount]').val(item.creatureCount);

                        // Duplicate after so first event goes in the template
                        if (index + 1 < event.eventDetails.length)
                        {
                            uiLibrary.duplicateInputSet(appendToSelector, templateElementId,
                                removeButtonSelector);
                        }
                    });
                });
            }
            else if (eventTypeId === lifeStory.NON_COMBAT_EVENT)
            {
                uiLibrary.showEventDetailInputs(true);
            }
            else if (eventTypeId === lifeStory.RESURRECT_EVENT)
            {
                $('#editEventForm, #editDeathEventForm').hide();
                $form = $('#editResurrectEventForm').show();
            }
            else if (eventTypeId === lifeStory.DEATH_EVENT)
            {
                $('#editEventForm, #editResurrectEventForm').hide();
                $form = $('#editDeathEventForm').show();
            }

            if (eventTypeId === lifeStory.COMBAT_EVENT ||
                eventTypeId === lifeStory.NON_COMBAT_EVENT)
            {
                $('#editResurrectEventForm, #editDeathEventForm').hide();
                $form = $('#editEventForm').show();

                $form.find('[name=experience]').val(event.experience);
                $form.find('[name=characterCount]').val(event.characterCount);
            }

            if (eventTypeId === lifeStory.NON_COMBAT_EVENT ||
                eventTypeId === lifeStory.RESURRECT_EVENT ||
                eventTypeId === lifeStory.DEATH_EVENT)
            {
                $form.find('[name=eventName]').val(event.eventDetails[0].name);
            }

            $form.find('[name=id]').val(event.id);
            $form.find('[name=eventType]').val(eventTypeId);
            $form.find('[name=description]').val(event.description);
        });
    };

    uiLibrary.populateCharacterDetail = function()
    {
        /// <summary>
        ///     Populates the character details page with the data for the selected character
        /// </summary>

        var characterId = lifeStory.values.characterId;
        var characterName = lifeStory.values.characterName;

        $('#characterDetails h2[data-property=characterName]').text(characterName);

        lifeStory.db.getCharacter(characterId, function(character)
        {
            var $detailsTable = $('#characterDetailsTable');

            $detailsTable.find('[data-property=race]').text(character.raceName);
            $detailsTable.find('[data-property=class]').text(character.className);

            var level = lifeStory.util.getLevel(Math.floor(character.experience));
            $detailsTable.find('[data-property=level]').text(level);
            $detailsTable.find('[data-property=totalXP]').text(Math.floor(character.experience) + ' XP');
            $detailsTable.find('[data-property=nextLevel').text((level + 1));
            $detailsTable.find('[data-property=requiredXP]').text(
                lifeStory.util.experienceToNextLevel(character.experience) + ' XP');

            $detailsTable.find('[data-property=living]').text(
                character.living === lifeStory.ALIVE ? 'Alive' : 'Dead');

            if (character.details)
            {
                $detailsTable.find('[data-property=details]').text(character.details);
                $detailsTable.find('#detailsLabelRow').removeClass('ui-screen-hidden');
            }
            else
            {
                $detailsTable.find('[data-property=details]').text('');
                $detailsTable.find('#detailsLabelRow').addClass('ui-screen-hidden');
            }
        });
    };

    uiLibrary.populateCharacterEdit = function()
    {
        /// <summary>
        ///     Populates the character edit form with the data for the selected character
        /// </summary>

        lifeStory.db.getCharacter(lifeStory.values.characterId, function(character)
        {
            var $form = $('#editCharacterForm');

            $form.find('[name=id]').val(character.id);
            $form.find('[name=name]').val(character.name);
            $form.find('[name=raceId]').val(character.raceId).selectmenu('refresh');
            $form.find('[name=classId]').val(character.classId).selectmenu('refresh');
            $form.find('[name=details]').val(character.details);
        });
    };

    uiLibrary.populateCreateEventAutocomplete = function()
    {
        /// <summary>
        ///     Populates the autocomplete data for the create event form
        /// </summary>

        var eventTypeIds = [lifeStory.COMBAT_EVENT, lifeStory.NON_COMBAT_EVENT];

        lifeStory.db.getEventTitles(eventTypeIds, function(titles)
        {
            $('#enemyName').autocomplete(
            {
                source: titles[lifeStory.COMBAT_EVENT]
            });

            $('#eventName').autocomplete(
            {
                source: titles[lifeStory.NON_COMBAT_EVENT]
            });
        });
    };

    uiLibrary.populateDeathAutocomplete = function()
    {
        /// <summary>
        ///     Populates the autocomplete data for the create death event form
        /// </summary>

        lifeStory.db.getEventTitles([lifeStory.DEATH_EVENT, lifeStory.COMBAT_EVENT], function (titles)
        {
            $('#causeOfDeath').autocomplete(
            {
                source: titles[lifeStory.DEATH_EVENT].concat(titles[lifeStory.COMBAT_EVENT])
            });
        });
    };

    uiLibrary.populateResurrectAutocomplete = function()
    {
        /// <summary>
        ///     Populates the autocomplete data for the create resurrect event form
        /// </summary>

        lifeStory.db.getEventTitles([lifeStory.RESURRECT_EVENT], function(titles)
        {
            $('#causeOfResurrect').autocomplete(
            {
                source: titles[lifeStory.RESURRECT_EVENT]
            });
        });
    };

    function deleteCharacterAccepted()
    {
        /// <summary>
        ///     Callback function for a user accepting the delete character confirmation dialog
        /// </summary>

        var callbackData = new lifeStory.CallbackData();
        callbackData.successMessage = 'The character was deleted successfully.';
        callbackData.redirectToPageId = 'home';

        lifeStory.dataAccess.deleteCharacter(lifeStory.values.characterId, callbackData);
    }

    uiLibrary.confirmDeleteCharacter = function()
    {
        /// <summary>
        ///     Confirms the user wants to clear the delete the character. If so, deletes the character.
        /// </summary>

        uiLibrary.displayConfirmation('Delete ' + lifeStory.values.characterName + '?',
            'Are you sure you want to delete ' + lifeStory.values.characterName +'?',
            deleteCharacterAccepted);
    };

    function deleteEventAccepted()
    {
        /// <summary>
        ///     Callback function for a user accepting the delete event confirmation dialog
        /// </summary>

        var callbackData = new lifeStory.CallbackData();
        callbackData.successMessage = 'The event was deleted successfully.';
        callbackData.redirectToPageId = 'eventLog';

        lifeStory.dataAccess.deleteEvent(lifeStory.values.eventId, callbackData);
    }

    uiLibrary.confirmDeleteEvent = function()
    {
        /// <summary>
        ///     Confirms the user wants to delete the event. If so, deletes the event.
        /// </summary>

        uiLibrary.displayConfirmation('Delete Event?',
            'Are you sure you want to delete this event?',
            deleteEventAccepted);
    };

    uiLibrary.confirmClearCharacterData = function ()
    {
        /// <summary>
        ///     Confirms the user wants to clear the character data. If so, clears the table.
        /// </summary>

        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't used.
        lifeStory.db.getCharacterCount(function (characterCount)
        {
            uiLibrary.displayConfirmation('Delete Characters?',
                'Are you sure you want to delete all (' + characterCount + ') characters permanently?',
                lifeStory.dataAccess.clearCharacterData);
        });
    };

    uiLibrary.confirmClearDatabase = function ()
    {
        /// <summary>
        ///     Confirms the user wants to clear the database. If so, clears the database.
        /// </summary>

        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't used.
        lifeStory.db.getCharacterCount(function (count)
        {
            uiLibrary.displayConfirmation('Delete All Data?',
                'Are you sure you want to delete all data? This will delete all (' + count + ') ' +
                'characters, their events, and custom races and classes permanently.',
                lifeStory.dataAccess.clearDatabase);
        });
    };

})(window.lifeStory, jQuery);
///#source 1 1 /js/validation.js
/* validation.js
 * Purpose: Validation functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.18: Created
 */

// Extend lifeStory with validation functions located under lifeStory.validation
(function(lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var validationLibrary = lifeStory.validation = {};

    // Validation rules for race and class forms
    var classRaceNameRules =
    {
        required: true,
        rangelength: [2, 20]
    };

    function setupFormValidation(formId, submitHandler, rules, messages, submitCallbackData)
    {
        /// <summary>
        ///     Sets up form validation for the formId using the submit handler, rules, and messages
        /// </summary>
        /// <param name="formId" type="string">The Id of the form to add validation to</param>
        /// <param name="submitHandler" type="function">
        ///     The function to call when a valid form is submitted
        /// </param>
        /// <param name="rules" type="object">The validation rules for the form</param>
        /// <param name="messages" type="object">Messages for when the validation rules aren't met</param>
        /// <param name="submitCallbackData" type="lifeStory.CallbackData">
        ///     Optional addition submit callback data
        /// </param>

        // If callback data is passed in, set up the submit handler with the callback data as
        // the first argument
        if (submitCallbackData)
        {
            submitHandler = submitHandler.bind(null, submitCallbackData);
        }

        $('#' + formId).validate(
        {
            submitHandler: submitHandler,
            rules: rules,
            messages: messages
        });
    }

    validationLibrary.handleRaceForm = function(formId, isCustomizePage)
    {
        /// <summary>
        ///     Sets up validation for the race form identified by formId.
        /// </summary>
        /// <param name="formId" type="string">The id of the race form to add validation to</param>
        /// <param name="isCustomizePage" type="boolean">
        ///     True if the form is on the customize page
        /// </param>

        var rules = { raceName: classRaceNameRules };

        var messages =
        {
            raceName:
            {
                required: 'Please enter the race name.',
                rangelength: 'Race name must be between 2 and 20 characters long.'
            }
        };

        var submitHandler = lifeStory.dataAccess.saveRaceToDb;

        var callbackData = new lifeStory.CallbackData(formId);
        callbackData.successMessage = 'New custom race created.';
        callbackData.failureMessage = 'Failed to create the new race.';
        callbackData.isCustomizePage = isCustomizePage;

        setupFormValidation(formId, submitHandler, rules, messages, callbackData);
    };

    validationLibrary.handleClassForm = function(formId, isCustomizePage)
    {
        /// <summary>
        ///     Sets up validation for the class form identified by formId.
        /// </summary>
        /// <param name="formId" type="string">The id of the class form to add validation to</param>
        /// <param name="isCustomizePage" type="boolean">
        ///     True if the form is on the customize page
        /// </param>

        var rules = { className: classRaceNameRules };

        var messages =
        {
            className:
            {
                required: 'Please enter the class name.',
                rangelength: 'Class name must be between 2 and 20 characters long.'
            }
        };

        var callbackData = new lifeStory.CallbackData(formId);
        callbackData.successMessage = 'New custom class created.';
        callbackData.failureMessage ='Failed to create the new class.';
        callbackData.isCustomizePage = isCustomizePage;

        var submitHandler = lifeStory.dataAccess.saveClassToDb;

        setupFormValidation(formId, submitHandler, rules, messages, callbackData);
    };

    validationLibrary.handleCharacterForm = function(formId, isNewCharacterForm)
    {
        /// <summary>
        ///     Sets up validation for the character form identified by formId.
        /// </summary>
        /// <param name="formId" type="string">The id of the race form to add validation to</param>
        /// <param name="isNewCharacterForm" type="boolean">
        ///     True if the form is a new character form
        /// </param>

        var rules =
        {
            name:
            {
                required: true,
                rangelength: [1, 50]
            },
            raceId:
            {
                required: true,
                number: true
            },
            classId:
            {
                required: true,
                number: true
            }
        };

        var messages =
        {
            name:
            {
                required: 'Your character must have a name.',
                rangelength: 'Your character\'s name must be between 1 and 50 characters long.'
            },
            raceId:
            {
                required: 'Your character must have a race.',
                number: 'Please create a race for your character.'
            },
            classId:
            {
                required: 'Your character must have a class.',
                number: 'Please create a class for your character.'
            }
        };

        var callbackData = new lifeStory.CallbackData(formId, 'eventLog');

        if (isNewCharacterForm)
        {
            callbackData.successMessage = 'New character created.';
            callbackData.failureMessage = 'Failed to create the character.';

            setupFormValidation(formId, lifeStory.dataAccess.saveCharacterToDb, rules, messages,
                callbackData);
        }
        else
        {
            callbackData.successMessage = 'Character updated.';
            callbackData.failureMessage = 'Failed to update the character.';

            setupFormValidation(formId, lifeStory.dataAccess.updateCharacterInDb, rules, messages,
                callbackData);
        }
    };

    validationLibrary.handleEventForm = function (formId, isNewEventForm)
    {
        /// <summary>
        ///     Sets up validation for the combat or non combat form identified by formId.
        /// </summary>
        /// <param name="formId" type="string">The id of the event form to add validation to</param>
        /// <param name="isNewCharacterForm" type="boolean">
        ///     True if the form is a new event form
        /// </param>

        var isNonCombat = function()
        {
            // Required because doing 'depends: !lifeStory.util.isCombatEvent' always results in true
            // as that function is always defined and as a result true
            return !lifeStory.util.isCombatEvent();
        }

        var rules =
        {
            eventType:
            {
                required: true,
                number: true
            },
            enemyName: // Combat event only
            {
                required:
                {
                    param: true,
                    depends: lifeStory.util.isCombatEvent
                },
                maxlength:
                {
                    param: 30,
                    depends: lifeStory.util.isCombatEvent
                }
            },
            creatureCount: // Combat event only
            {
                required:
                {
                    param: true,
                    depends: lifeStory.util.isCombatEvent
                },
                number:
                {
                    param: true,
                    depends: lifeStory.util.isCombatEvent
                }
            },
            eventName: // Non Combat event only
            {
                required:
                {
                    param: true,
                    depends: isNonCombat
                },
                maxlength:
                {
                    param:  30,
                    depends: isNonCombat
                }
            },
            experience:
            {
                required: true,
                number: true,
                min: 0
            },
            characterCount:
            {
                required: true,
                number: true
            }
        };

        var messages =
        {
            eventType:
            {
                required: 'You must select an XP source.',
                number: 'Please select an XP source.'
            },
            enemyName:
            {
                required: 'Please enter a name.',
                maxlength: 'Max 30 characters long.'
            },
            creatureCount:
            {
                required: 'Required.',
                number: 'Must be a number.'
            },
            eventName:
            {
                required: 'Please enter a title.',
                maxlength: 'Max 30 characters long.'
            },
            experience:
            {
                required: 'Please enter the total XP amount.',
                number: 'XP amount must be a number.',
                min: 'XP amount must be at least 0.'
            },
            characterCount:
            {
                required: 'Please enter how many PCs shared the XP.',
                number: 'This must be a number.'
            }
        };

        var callbackData = new lifeStory.CallbackData(formId, 'eventLog');

        if (isNewEventForm)
        {
            callbackData.successMessage = 'New Event created.';
            callbackData.failureMessage = 'Failed to save the new event.';

            setupFormValidation(formId, lifeStory.dataAccess.saveEventToDb, rules, messages,
                callbackData);
        }
        else
        {
            callbackData.successMessage = 'Event updated.';
            callbackData.failureMessage = 'Failed to update the event.';

            setupFormValidation(formId, lifeStory.dataAccess.updateEventInDb, rules, messages,
                callbackData);
        }
    };

    validationLibrary.handleOtherEventForm = function(formId, isResurrectEvent, isNewEvent)
    {
        /// <summary>
        ///     Sets up validation for the resurrect or death form identified by formId.
        /// </summary>
        /// <param name="formId" type="string">The id of the event form to add validation to</param>
        /// <param name="isResurrectEvent" type="boolean">
        ///     True if the form is a resurrection form
        /// </param>
        /// <param name="isNewEvent" type="boolean">
        ///     True if the form is a new other event form
        /// </param>

        var rules =
        {
            eventName:
            {
                required:
                {
                    param: true,
                    depends: !lifeStory.util.isCombatEvent
                },
                maxlength:
                {
                    param: 30,
                    depends: !lifeStory.util.isCombatEvent
                }
            }
        };

        var messages =
        {
            eventName:
            {
                required: 'Please enter what got you experience.',
                maxlength: 'Max 30 characters long.'
            }
        };

        var callbackData = new lifeStory.CallbackData(formId, 'eventLog');
        callbackData.isResurrection = isResurrectEvent;

        if (isNewEvent)
        {
            callbackData.successMessage = isResurrectEvent ?
                'You\'ve been resurrected.' :
                'You died.';
            callbackData.failureMessage = 'Failed to save ' +
                (isResurrectEvent ? 'resurrection.' : 'death.');

            setupFormValidation(formId, lifeStory.dataAccess.saveOtherEventToDb, rules, messages,
                callbackData);
        }
        else
        {
            callbackData.successMessage = 'Updated ' +
                (isResurrectEvent ? 'resurrection' : 'death') + ' event successfully.';
            callbackData.failureMessage = 'Failed to updated ' +
                (isResurrectEvent ? 'resurrection' : 'death') + ' event.';

            setupFormValidation(formId, lifeStory.dataAccess.updateOtherEventInDb, rules, messages,
                callbackData);
        }
    };

})(window.lifeStory, jQuery);
