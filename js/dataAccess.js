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

    function dbFailure(errorMessage, error, transaction)
    {
        /// <summary>
        ///     Displays the passed in message. Logs the error.
        /// </summary>

        lifeStory.ui.displayErrorMessage(errorMessage);

        console.error(error.message, error, transaction);
    }

    function failureCallback(message)
    {
        /// <summary>
        ///     Calls dbFailure with the passed in message in addition to the transaction and error
        /// </summary>
        /// <param name="message" type="string">The message to pass on to dbFailure</param>
        /// <returns type="function">The enhanced callback function</returns>

        return function(transaction, error)
        {
            dbFailure(message, error, transaction);
        };
    }

    function transactionFailureCallback(message)
    {
        /// <summary>
        ///     Calls dbFailure with the passed in message in addition to the error.<br/>
        ///     Intended for callbacks which are called for transaction level failures
        /// </summary>
        /// <param name="message" type="string">The message to pass on to dbFailure</param>
        /// <returns type="function">The enhanced callback function</returns>

        return function(error)
        {
            dbFailure(message, error);
        };
    }

    function genericSuccessCallback(callbackData)
    {
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

    function modifySuccessCallback(successCallback, callbackData)
    {
        /// <summary>
        ///     Modifies the success callback to pass in additional data to the callback<br/>
        ///     Only modifies the callback if callbackData is passed in.
        /// </summary>
        /// <param name="successCallback" type="function">The intended success callback function</param>
        /// <param name="callbackData" type="lifeStory.CallbackData">
        ///     Additional data to pass to the success callback
        /// </param>
        /// <returns type="function">The modified success callback</returns>

        if (successCallback && callbackData)
        {
            return function (transaction, resultSet)
            {
                successCallback(callbackData, resultSet, transaction);
            };
        }

        return successCallback;
    }

    function refreshDeleteRaceUI()
    {
        lifeStory.ui.populateRaceList('deleteRaceSelect', lifeStory.ui.refreshDeleteRaceUIState);
    }

    // Callback function for successfully saving a race
    function saveRaceSuccess(callbackData)
    {
        genericSuccessCallback(callbackData);        

        if (callbackData.isCustomizePage) // Repopulate the list and refresh the UI state
        {
            refreshDeleteRaceUI();
        }
    }

    dataAccessLibrary.saveRaceToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveRaceSuccess, callbackData);
        var saveFailure = failureCallback(callbackData.failureMessage);

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
    };

    function refreshDeleteClassUI()
    {
        lifeStory.ui.populateClassList('deleteClassSelect', lifeStory.ui.refreshDeleteClassUIState);
    }

    // Callback function for successfully saving a class
    function saveClassSuccess(callbackData)
    {
        genericSuccessCallback(callbackData);

        if (callbackData.isCustomizePage) // Repopulate the list and refresh the UI state
        {
            refreshDeleteClassUI();
        }
    }

    // Gets the form data and calls db.addClass
    dataAccessLibrary.saveClassToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveClassSuccess, callbackData);
        var saveFailure = failureCallback(callbackData.failureMessage);

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
    dataAccessLibrary.deleteClass = function(classId)
    {
        var deleteFailure = failureCallback('Failed to delete the class.');

        lifeStory.db.deleteClass(classId, deleteClassSuccess, deleteFailure);
    };

    function saveCharacterSuccess(callbackData, resultSet)
    {
        lifeStory.values.characterId = resultSet.insertId;

        genericSuccessCallback(callbackData);
    }

    dataAccessLibrary.saveCharacterToDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(saveCharacterSuccess, callbackData);
        var saveFailure = failureCallback(callbackData.failureMessage);

        var newCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = newCharacter.name;
        lifeStory.values.characterAlive = newCharacter.living;

        lifeStory.db.addCharacter(newCharacter, successCallback, saveFailure);
    };

    dataAccessLibrary.updateCharacterInDb = function (form, callbackData)
    {
        var successCallback = modifySuccessCallback(genericSuccessCallback, callbackData);
        var updateFailure = failureCallback(callbackData.failureMessage);

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

        var callbackData = new lifeStory.CallbackData();
        callbackData.successMessage = 'The character was deleted successfully.';
        callbackData.redirectToPageId = 'home';

        genericSuccessCallback(callbackData);
    }

    // Attempts to delete the character identified by characterId and displays a message of the outcome
    dataAccessLibrary.deleteCharacter = function(characterId)
    {
        var deleteFailure = transactionFailureCallback('Failed to delete the character.');

        lifeStory.db.deleteCharacter(characterId, deleteCharacterSuccess, deleteFailure);
    };

    dataAccessLibrary.saveEventToDb = function(form, callbackData)
    {
        var successCallback = modifySuccessCallback(genericSuccessCallback, callbackData);
        var saveFailure = transactionFailureCallback(callbackData.failureMessage);

        var newEvent = lifeStory.util.createEventFromInput(form);
        var newEventDetails = lifeStory.util.createEventDetailsFromInput(form, newEvent.eventTypeId);
        var characterId = lifeStory.values.characterId;

        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, successCallback, saveFailure);
    };

    // Callback function for successfully deleting an event
    function deleteEventSuccess()
    {
        lifeStory.values.eventId = null;

        var callbackData = new lifeStory.CallbackData();
        callbackData.successMessage = 'The event was deleted successfully.';
        callbackData.redirectToPageId = 'eventLog';

        genericSuccessCallback(callbackData);
    }

    // Attempts to delete the character identified by eventId and displays a message of the outcome
    dataAccessLibrary.deleteEvent = function(eventId)
    {
        var deleteFailure = transactionFailureCallback('Failed to delete the event.');
        var characterId = lifeStory.values.characterId;

        lifeStory.db.deleteEvent(eventId, characterId, deleteEventSuccess, deleteFailure);
    };

    dataAccessLibrary.saveOtherEventToDb = function(form, callbackData)
    {
        /// <summary>
        ///     Saves a resurrection or death even to the DB.
        /// </summary>
        /// <param name="form" type="DOM Element">The form to get data from</param>
        /// <param name="callbackData" type="object">
        ///     Additional callback data to pass to the success callback
        /// </param>

        var successCallback = modifySuccessCallback(genericSuccessCallback, callbackData);
        var saveFailure = transactionFailureCallback(callbackData.failureMessage);

        var newEvent = lifeStory.util.createEventFromInput(form);

        if (callbackData.isResurrection)
        {
            newEvent.eventTypeId = lifeStory.RESURRECT_EVENT;
            lifeStory.values.characterAlive = lifeStory.ALIVE;
        }
        else
        {
            newEvent.eventTypeId = lifeStory.DEATH_EVENT;
            lifeStory.values.characterAlive = lifeStory.DEAD;
        }

        var newEventDetails = lifeStory.util.createEventDetailsFromInput(form, newEvent.eventTypeId);
        var characterId = lifeStory.values.characterId;

        newEvent.experience = null;
        newEvent.characterCount = 1;

        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, successCallback, saveFailure);
    };
    
})(window, window.lifeStory, jQuery);