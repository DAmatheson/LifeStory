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

    function saveRaceSuccess(callbackData, transaction, resultSet)
    {
        /// <summary>
        ///     Success callback for saving a race
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        if (!callbackData.isCustomizePage)
        {
            lifeStory.values.newRaceId = resultSet.insertId;
        }

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

    function saveClassSuccess(callbackData, transaction, resultSet)
    {
        /// <summary>
        ///     Success callback for saving a class
        /// </summary>
        /// <param name="callbackData" type="lifeStory.CallbackData">Additional callback data</param>

        if (!callbackData.isCustomizePage)
        {
            lifeStory.values.newClassId = resultSet.insertId;
        }

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