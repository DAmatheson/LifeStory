/* init.js
 * Purpose: Initialization scripts for LifeStory
 *
 * Revision History:
 *      Isaac West, 2015.03.05: Created
 */

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

$('#settings').one('pageinit', function settingsPageInit()
{
    $('#clearCharacters').on('tap', lifeStory.ui.confirmClearCharactersTable);
    $('#resetDatabase').on('tap', lifeStory.ui.confirmClearDatabase);
});

$('#home').one('pageinit', function homePageInit()
{
    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateCharacterList('characterList', 'li');
    });

    if (lifeStory.values.showDeceased === 'false')
    {
        $('#showDeceased').prop('checked', false).change().checkboxradio('refresh');
    }

    // Hook this up after the initial change since it won't result in a filtered list anyways
    $('#showDeceased').change(lifeStory.ui.filterCharacterList);
});

$('#eventLog').one('pageinit', function eventLogPageInit()
{
    $(this).on('pagebeforeshow', function ()
    {
        lifeStory.ui.populateEventLog('eventList', 'li');
    });
});

$('#characterDetails').one('pageinit', function characterDetailsPageInit()
{
    $(this).on('pagebeforeshow', lifeStory.ui.populateCharacterDetail);

    $('#deleteCharacter').on('tap', function()
    {
        lifeStory.ui.confirmDeleteCharacter();
    });
});

$('#eventDetails').one('pageinit', function eventDetailsPageInit()
{
    $(this).on('pagebeforeshow', lifeStory.ui.populateEventDetail);
    $('#deleteEvent').on('tap', lifeStory.ui.confirmDeleteEvent);
});

$('#createCharacter').one('pageinit', function createCharacterPageInit()
{
    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('raceSelect', 'classSelect');
    });
    
    lifeStory.validation.handleCharacterForm('createCharacterForm', true);
});

$('#addClass').one('pageinit', function addClassPageInit()
{
    lifeStory.validation.handleClassForm('addClassForm', 'createCharacter');
});

$('#addRace').one('pageinit', function addRacePageInit()
{
    lifeStory.validation.handleRaceForm('addRaceForm', 'createCharacter');
});

$('#editCharacter').one('pageinit', function customizePageInit() {
    lifeStory.validation.handleCharacterForm('editCharacterForm');

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('editCharacterRaceSelect', 'editCharacterClassSelect');
        lifeStory.ui.populateCharacterEdit();
    });
});

$('#createEvent').one('pageinit', function createEventPageInit()
{
    lifeStory.validation.handleEventForm('createEventForm', true);
    $('#removeEnemy').closest('.ui-btn').hide();

    $(this).on('pagebeforeshow', function () {
        lifeStory.ui.populateEventAutocomplete('enemyName', 'eventName');
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

$('#editEvent').one('pageinit', function createEventPageInit()
{
    lifeStory.validation.handleEventForm('editEventForm');
    lifeStory.validation.handleOtherEventForm('editResurrectEventForm', true);
    lifeStory.validation.handleOtherEventForm('editDeathEventForm');

    var removeButtonSelector = '#editRemoveEnemy';
    // TODO: Consider removing the edit enemy inputs template and just having it be the create template
    var extraInputsSelector = '#editCombatDetailInputs fieldset:not(#editEnemyInputsTemplate)';
    var appendToSelector = '#editCombatDetailInputs fieldset:last';
    var templateElementId = 'editEnemyInputsTemplate';

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.removeInputSet(extraInputsSelector, removeButtonSelector);
        lifeStory.ui.populateEventEdit(appendToSelector, templateElementId, removeButtonSelector);
        lifeStory.ui.populateEventAutocomplete('editEnemyName', 'editEventName');
        lifeStory.ui.populateDeathAutocomplete('editCauseOfDeath'); // TODO: ^ + this cause 2 DB queries so it could be better.
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

$('#resurrectEvent').one('pageinit', function resurrectEventPageInit()
{
    lifeStory.validation.handleOtherEventForm('resurrectEventForm', true, true);

    $('#resurrectEventForm span[data-property=characterName]').text(lifeStory.values.characterName);
});

$('#deathEvent').one('pageinit', function deathEventPageInit()
{
    lifeStory.validation.handleOtherEventForm('deathEventForm', false, true);
    lifeStory.ui.populateDeathAutocomplete('causeOfDeath');
});

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

// Setup lifeStory for later use to minimize global variables and encapsulate functions and variables
(function (window, undefined)
{
    'use strict';

    var lifeStory =
    {
        get COMBAT_EVENT()
        {
            return 1;
        },
        get NON_COMBAT_EVENT()
        {
            return 2;
        },
        get RESURRECT_EVENT()
        {
            return 3;
        },
        get DEATH_EVENT()
        {
            return 4;
        },
        get ALIVE()
        {
            return 1;
        },
        get DEAD()
        {
            return 0;
        },
        get LEVEL_VALUES()
        {
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
            return localStorage.getItem('characterId');
        },
        set characterId(value)
        {
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
            return localStorage.getItem('characterName');
        },
        set characterName(value)
        {
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
            return localStorage.getItem('characterAlive');
        },
        set characterAlive(value)
        {
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
            return localStorage.getItem('eventId');
        },
        set eventId(value)
        {
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
            return localStorage.getItem('showDeceased');
        },
        set showDeceased(value)
        {
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