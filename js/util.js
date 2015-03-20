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

    function reduceToOnlyInputs(element)
    {
        return $(':input:not(button)', element);
    }

    utilLibrary.createEventDetailsFromInput = function(formId, inputSetContainer)
    {
        var eventDetailItems = [];

        var $form = $('#' + formId);

        var eventId = $form.find('[name=id]').val();

        var detailCounter = 0;

        $(inputSetContainer, $form).each(function()
        {
            var $inputs = reduceToOnlyInputs(this);

            var detailId = $inputs.filter('[name=eventDetailId]').val() || detailCounter + 1;
            var eventName = $inputs.filter('[name=enemyName]').val().trim();
            var creatureCount = $inputs.filter('[name=creatureCount]').val() || null;

            if (eventName && creatureCount)
            {
                eventDetailItems.push(new lifeStory.EventDetail(detailId, eventId, eventName,
                    creatureCount));

                detailCounter++;
            }
        });

        return eventDetailItems;
    };

    function createCharacterFromInput(form)
    {
        var $inputs = reduceToOnlyInputs(form);

        var newCharacter = new lifeStory.Character();

        newCharacter.name = $inputs.filter('[name=name]').val().trim();
        newCharacter.raceId = $inputs.filter('[name=raceId]').val();
        newCharacter.classId = $inputs.filter('[name=classId]').val();
        newCharacter.living = $inputs.filter('[name=living]').val() || true; // TODO: true = WHERE living = 'true'; 1 = WHERE living = 1; Which is preferable?
        newCharacter.details = $inputs.filter('[name=details]').val().trim() || null;

        return newCharacter;
    }

    function createRaceFromInput(form)
    {
        var $inputs = reduceToOnlyInputs(form);

        var raceName = $inputs.filter('[name=raceName]').val().trim();

        return new lifeStory.Race(raceName);
    }

    // Returns a new class object populated with the values from the passed in inputs
    function createClassFromInput(form)
    {
        var $inputs = reduceToOnlyInputs(form);

        var className = $inputs.filter('[name=className]').val().trim();

        return new lifeStory.CharacterClass(className);
    }

    function modifySuccessCallback(successCallback, callbackData)
    {
        /// <summary>
        ///     Modifies the success callback to pass in additional callback data <br/>
        ///     Only modifies the callback if additional callback data is passed in
        /// </summary>
        /// <param name="successCallback" type="function">The intended success callback function</param>
        /// <param name="callbackData" type="any">Additional data to pass to the success callback</param>
        /// <returns type="function">The modified success callback</returns>

        if (successCallback && callbackData)
        {
            return function (transaction, resultSet)
            {
                successCallback(transaction, resultSet, callbackData);
            };
        }

        return successCallback;
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
        var successCallback = modifySuccessCallback(saveRaceSuccess, callbackData);

        lifeStory.db.addRace(createRaceFromInput(form), successCallback, saveRaceFailure, callbackData);

        $('button', form).blur();
    };

    // Callback function for successfully saving a class
    function saveClassSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        alert('New custom class created.');

        $.mobile.changePage('#' + callbackData.redirectToPageId);
    }

    // Callback function for failure to save a class
    function saveClassFailure(transaction, error)
    {
        dbFailure('Failed to create the new class.', transaction, error);
    }

    // Gets the form data and calls db.addClass
    utilLibrary.saveClassToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveClassSuccess, callbackData);

        lifeStory.db.addClass(createClassFromInput(form), successCallback, saveClassFailure, callbackData);

        $('button', form).blur();
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

    utilLibrary.convertToSelectEntrys = function(resultSet, valueName, callback)
    {
        /// <summary>
        ///     Converts the values from a resultSet into an array of key value lifeStory.SelectEntrys
        /// </summary>
        /// <param name="resultSet" type="">The result set</param>
        /// <param name="valueName" type="string">The column name to pull the value from</param>
        /// <param name="callback" type="function">The function to call with the converted results</param>

        var results = [];

        for (var i = 0; i < resultSet.rows.length; i++)
        {
            results[i] = new lifeStory.SelectEntry(resultSet.rows.item(i).id,
                resultSet.rows.item(i)[valueName]);
        }

        callback(results);
    }

})(window, window.lifeStory, jQuery);