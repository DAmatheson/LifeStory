/* init.js
 * Purpose: Initialization scripts for LifeStory
 *
 * Revision History:
 *      Isaac West, 2015.03.05: Created
 */

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
    
    lifeStory.validation.handleCharacterForm('createCharacterForm', true);
});

// Initialize the add class page
$('#addClass').one('pageinit', function addClassPageInit()
{
    lifeStory.validation.handleClassForm('addClassForm', 'createCharacter');
});

// Initialize the add race page
$('#addRace').one('pageinit', function addRacePageInit()
{
    lifeStory.validation.handleRaceForm('addRaceForm', 'createCharacter');
});

// Initialize the edit character page
$('#editCharacter').one('pageinit', function customizePageInit() {
    lifeStory.validation.handleCharacterForm('editCharacterForm');

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('editCharacterRaceSelect', 'editCharacterClassSelect');
        lifeStory.ui.populateCharacterEdit();
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
    lifeStory.validation.handleRaceForm('createRaceForm');
    lifeStory.validation.handleClassForm('createClassForm');

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
        }
    };

    // Makes lifeStory available to the global object
    window.lifeStory = lifeStory;

})(window);