/* dataAccess.js
 * Purpose: Data access methods for lifeStory
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.19: Created
 */

(function(window, lifeStory, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var dataAccessLibrary = lifeStory.dataAccess = {};

    function dbFailure(alertMessage, transaction, error)
    {
        alert(alertMessage);

        console.error(error.message, transaction, error);
    }

    function modifySuccessCallback(successCallback, callbackData)
    {
        /// <summary>
        ///     Modifies the success callback to pass in additional data to the callback<br/>
        ///     Only modifies the callback if callbackData is passed in
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

    dataAccessLibrary.saveRaceToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveRaceSuccess, callbackData);

        lifeStory.db.addRace(lifeStory.util.createRaceFromInput(form), successCallback, saveRaceFailure);

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
    dataAccessLibrary.saveClassToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveClassSuccess, callbackData);

        lifeStory.db.addClass(lifeStory.util.createClassFromInput(form), successCallback,
            saveClassFailure);

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

    dataAccessLibrary.saveCharacterToDb = function (form)
    {
        lifeStory.db.addCharacter(lifeStory.util.createCharacterFromInput(form), saveCharacterSuccess,
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

    dataAccessLibrary.updateCharacterInDb = function (form)
    {
        lifeStory.db.updateCharacter(lifeStory.util.createCharacterFromInput(form),
            updateCharacterSuccess, updateCharacterFailure);
    };

})(window, window.lifeStory);