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
            var detailId = $('[name=eventDetailId]', element).val() || index + 1;
            var eventName = $('[name=enemyName]', element).val();
            var creatureCount = $('[name=creatureCount]', element).val() || null;

            eventDetailItems[index] = new lifeStory.EventDetail(detailId, eventId, eventName,
                creatureCount);
        });

        return eventDetailItems;
    };

    function createCharacterFromInput($inputs)
    {
        var newCharacter = new lifeStory.Character(
            $('[name=name]').val(),
            $('[name=raceId]').val(),
            $('[name=classId]').val(),
            $('[name=details]').val(),
            $('[name=living]').val() || true);

        return newCharacter;
    }

    function createRaceFromInput($inputs)
    {
        var raceName = $inputs.filter('[name=raceName]').val();

        return new lifeStory.Race(raceName);
    }

    // Returns a new class object populated with the values from the passed in inputs
    function createClassFromInput($inputs)
    {
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
        var $inputs = $(':input:not(button)', form);

        lifeStory.db.addRace(createRaceFromInput($inputs), saveRaceSuccess, saveRaceFailure, callbackData);

        $('button', form).blur();
    };

    // Callback function for successfully saving a class
    function saveClassSuccess(transaction, resultSet)
    {
        alert('New custom class created.');

        //$.mobile.changePage('#dmViewFeedback'); // TODO: Duplicate callbackData logic from saveRaceToDb
    }

    // Callback function for failure to save a class
    function saveClassFailure(transaction, error)
    {
        dbFailure('Failed to create the new class.', transaction, error);
    }

    // Gets the form data and calls db.addClass
    utilLibrary.saveClassToDb = function (form)
    {
        var $inputs = $(':input:not(button)', form); // TODO: Consider removing : before input

        lifeStory.db.addClass(createClassFromInput($inputs), saveClassSuccess, saveClassFailure);

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
        var $inputs = $('input:not(button)', form);

        lifeStory.db.addCharacter(createCharacterFromInput($inputs), saveCharacterSuccess, saveCharacterFailure);
    };

    function updateCharacterSuccess(transaction, resultSet) {
        alert('Character updated.');

        //$.mobile.changePage(); // TODO: Show the character's details page
    }

    function updateCharacterFailure(transaction, error) {
        dbFailure('Failed to update the character.', transaction, error);
    }

    utilLibrary.updateCharacterInDb = function (form) {
        var $inputs = $('input:not(button)', form);

        lifeStory.db.updateCharacter(createCharacterFromInput($inputs), updateCharacterSuccess, updateCharacterFailure);
    };

})(window, lifeStory, jQuery);