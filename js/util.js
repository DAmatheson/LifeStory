/* util.js
 * Purpose: Utility functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

(function (window, lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var utilLibrary = lifeStory.util = {};

    function dbFailure(alertMessage, transaction, error)
    {
        alert(alertMessage);

        console.error(error.message, transaction, error);
    }

    utilLibrary.createEventDetailsFromInput = function(formId, inputSetContainer)
    {
        var eventDetailItems = [];

        var $form = $('#' + formId);

        var eventId = $form.find('[name=id]').val();

        $(inputSetContainer, $form).each(function(index, element)
        {
            var detailId = element.filter('[name=eventDetailId]').val() || index + 1;
            var eventName = element.filter('[name=enemyName]').val();
            var creatureCount = element.filter('[name=creatureCount]').val() || null;

            eventDetailItems[index] = new lifeStory.EventDetail(detailId, eventId, eventName,
                creatureCount);
        });

        return eventDetailItems;
    };

    function filterFormToOnlyInputs(form)
    {
        return $(':input:not(button)', form);
    }

    function createCharacterFromInput(form)
    {
        var $inputs = filterFormToOnlyInputs(form);

        var newCharacter = new lifeStory.Character();

        newCharacter.name = $inputs.filter('[name=name]').val();
        newCharacter.raceId = $inputs.filter('[name=raceId]').val();
        newCharacter.classId = $inputs.filter('[name=classId]').val();
        newCharacter.living = $inputs.filter('[name=living]').val() || true; // TODO: Figure out if webSQL converts true to 1 automatically or if this needs to be 1
        newCharacter.details = $inputs.filter('[name=details]').val();

        return newCharacter;
    }

    function createRaceFromInput(form)
    {
        var $inputs = filterFormToOnlyInputs(form);

        var raceName = $inputs.filter('[name=raceName]').val();

        return new lifeStory.Race(raceName);
    }

    // Returns a new class object populated with the values from the passed in inputs
    function createClassFromInput(form)
    {
        var $inputs = filterFormToOnlyInputs(form);

        var className = $inputs.filter('[name=className]').val();

        return new lifeStory.CharacterClass(className);
    }

    // Callback function for successfully saving a race
    function saveRaceSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        alert('New custom race created.');

        $.mobile.changePage('#' + callbackData.redirectToPageId);
    }

    // Callback function for failure to save a race
    function saveRaceFailure(transaction, error)
    {
        dbFailure('Failed to create the new race.', transaction, error);
    }

    utilLibrary.saveRaceToDb = function (form, callbackData)
    {
        lifeStory.db.addRace(createRaceFromInput(form), saveRaceSuccess, saveRaceFailure, callbackData);

        $('button', form).blur();
    };

    // Callback function for successfully saving a class
    function saveClassSuccess(transaction, resultSet)
    {
        alert('New custom class created.');

        //$.mobile.changePage('#'); // TODO: Duplicate callbackData logic from saveRaceToDb
    }

    // Callback function for failure to save a class
    function saveClassFailure(transaction, error)
    {
        dbFailure('Failed to create the new class.', transaction, error);
    }

    // Gets the form data and calls db.addClass
    utilLibrary.saveClassToDb = function (form)
    {
        lifeStory.db.addClass(createClassFromInput(form), saveClassSuccess, saveClassFailure);

        $('button', form).blur(); // TODO: Duplicate callbackData logic from saveRaceToDb
    };

    function saveCharacterSuccess(transaction, resultSet)
    {
        alert('New character created.');

        //$.mobile.changePage(); // TODO: Show the created character's event log
    }

    function saveCharacterFailure(transaction, error)
    {
        dbFailure('Failed to create the character.', transaction, error);
    }

    utilLibrary.saveCharacterToDb = function(form)
    {
        lifeStory.db.addCharacter(createCharacterFromInput(form), saveCharacterSuccess,
            saveCharacterFailure);
    };

    function updateCharacterSuccess(transaction, resultSet)
    {
        alert('Character updated.');

        //$.mobile.changePage(); // TODO: Show the character's details page
    }

    function updateCharacterFailure(transaction, error)
    {
        dbFailure('Failed to update the character.', transaction, error);
    }

    utilLibrary.updateCharacterInDb = function (form)
    {
        lifeStory.db.updateCharacter(createCharacterFromInput(form), updateCharacterSuccess,
            updateCharacterFailure);
    };

})(window, lifeStory, jQuery);