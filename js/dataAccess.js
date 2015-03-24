/* dataAccess.js
 * Purpose: Data access methods for lifeStory
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.19: Created
 */

// Extend lifeStory with data access functions located under lifeStory.dataAccess
(function(window, lifeStory, $, undefined)
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

        console.error(error.message, transaction, error);
    }

    function failureCallback(message)
    {
        /// <summary>
        ///     Calls dbFailure with the passed in message in addition to the transaction and error
        /// </summary>
        /// <param name="message" type="string">The message to pass on to dbFailure</param>
        /// <returns type="function">The enhanced callback function</returns>

        return function (transaction, error)
        {
            dbFailure(message, transaction, error);
        }
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

    function refreshDeleteRaceUI()
    {
        lifeStory.ui.populateRaceList('deleteRaceSelect', lifeStory.ui.refreshDeleteRaceUIState);
    }

    // Callback function for successfully saving a race
    function saveRaceSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        lifeStory.ui.displaySuccessMessage('New custom race created.');

        if (callbackData.redirectToPageId) // Redirect to the specified page
        {
            lifeStory.util.redirectOnSuccessDialogClose(callbackData.redirectToPageId);
        }
        else if (callbackData.isCustomizePage) // Repopulate the list and refresh the UI state
        {
            refreshDeleteRaceUI();
        }
    }

    dataAccessLibrary.saveRaceToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveRaceSuccess, callbackData);
        var saveFailure = failureCallback('Failed to create the new race.');

        lifeStory.db.addRace(lifeStory.util.createRaceFromInput(form), successCallback, saveFailure);
    };

    // Callback function for successfully deleting a race
    function deleteRaceSuccess(transaction, resultSet)
    {
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

    // Attempts to delete the race identified by raceId and displays a message of the outcome
    dataAccessLibrary.deleteRace = function(raceId)
    {
        var deleteFailure = failureCallback('Failed to delete the race.');

        lifeStory.db.deleteRace(raceId, deleteRaceSuccess, deleteFailure);
    }

    function refreshDeleteClassUI()
    {
        lifeStory.ui.populateClassList('deleteClassSelect', lifeStory.ui.refreshDeleteClassUIState);
    }

    // Callback function for successfully saving a class
    function saveClassSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        lifeStory.ui.displaySuccessMessage('New custom class created.');

        if (callbackData.redirectToPageId) // Redirect to the specified page
        {
            lifeStory.util.redirectOnSuccessDialogClose(callbackData.redirectToPageId);
        }
        else if (callbackData.isCustomizePage) // Repopulate the list and refresh the UI state
        {
            refreshDeleteClassUI();
        }
    }

    // Gets the form data and calls db.addClass
    dataAccessLibrary.saveClassToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveClassSuccess, callbackData);
        var saveFailure = failureCallback('Failed to create the new class.');

        lifeStory.db.addClass(lifeStory.util.createClassFromInput(form), successCallback,
            saveFailure);
    };

    // Callback function for successfully deleting a class
    function deleteClassSuccess(transaction, resultSet)
    {
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

    // Attempts to delete the class identified by classId and displays a message of the outcome
    dataAccessLibrary.deleteClass = function (classId)
    {
        var deleteFailure = failureCallback('Failed to delete the class.');

        lifeStory.db.deleteClass(classId, deleteClassSuccess, deleteFailure);
    }

    function saveCharacterSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        lifeStory.values.characterId = resultSet.insertId;

        lifeStory.ui.displaySuccessMessage('New character created.');
        lifeStory.util.redirectOnSuccessDialogClose('eventLog');
    }

    dataAccessLibrary.saveCharacterToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveCharacterSuccess, callbackData);
        var saveFailure = failureCallback('Failed to create the character.');

        var newCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = newCharacter.name;
        lifeStory.values.characterAlive = newCharacter.living;

        lifeStory.db.addCharacter(newCharacter, successCallback, saveFailure);
    };

    function updateCharacterSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        lifeStory.ui.displaySuccessMessage('Character updated.');
        lifeStory.util.redirectOnSuccessDialogClose('eventLog');
    }

    dataAccessLibrary.updateCharacterInDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(updateCharacterSuccess, callbackData);
        var updateFailure = failureCallback('Failed to update the character.');

        var updatedCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = updatedCharacter.name;
        lifeStory.values.characterAlive = updatedCharacter.living;

        lifeStory.db.updateCharacter(updatedCharacter, successCallback, updateFailure);
    };

    // Callback function for successfully deleting a character
    function deleteCharacterSuccess()
    {
        lifeStory.values.characterId = null;
        lifeStory.values.characterName = null;
        lifeStory.values.characterAlive = null;

        lifeStory.ui.displaySuccessMessage('The character was deleted successfully.');
        lifeStory.util.redirectOnSuccessDialogClose('home');
    }

    // Attempts to delete the character identified by characterId and displays a message of the outcome
    dataAccessLibrary.deleteCharacter = function (characterId)
    {
        var deleteFailure = failureCallback('Failed to delete the character.');

        lifeStory.db.deleteCharacter(characterId, deleteCharacterSuccess, deleteFailure);
    }

    // Callback function for successfully saving an event
    function saveEventSuccess(transaction, resultSet, callbackData)
    {
        $('#' + callbackData.formIdToReset).trigger('reset');

        lifeStory.ui.displaySuccessMessage('New Event created');
        lifeStory.util.redirectOnSuccessDialogClose('eventLog');
    };

    dataAccessLibrary.saveEventToDb = function(form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveEventSuccess, callbackData);
        var saveFailure = failureCallback('Failed to save the event.');

        var newEvent = lifeStory.util.createEventFromInput(form);
        var newEventDetails = lifeStory.util.createEventDetailsFromInput(form);
        var characterId = lifeStory.values.characterId;

        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, successCallback, saveFailure);
    }

})(window, window.lifeStory, jQuery);