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
        var saveSuccess = saveRaceSuccess.bind(this, callbackData);
        var saveFailure = dbFailure.bind(this, callbackData.failureMessage);

        lifeStory.db.addRace(lifeStory.util.createRaceFromInput(form), saveSuccess, saveFailure);
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
        var deleteFailure = dbFailure.bind(this, 'Failed to delete the race.');

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
        var saveSuccess = saveClassSuccess.bind(this, callbackData);
        var saveFailure = dbFailure.bind(this, callbackData.failureMessage);

        lifeStory.db.addClass(lifeStory.util.createClassFromInput(form), saveSuccess, saveFailure);
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
        var deleteFailure = dbFailure.bind(this, 'Failed to delete the class.');

        lifeStory.db.deleteClass(classId, deleteClassSuccess, deleteFailure);
    };

    function saveCharacterSuccess(callbackData, transaction, resultSet)
    {
        lifeStory.values.characterId = resultSet.insertId;

        genericSuccessCallback(callbackData);
    }

    dataAccessLibrary.saveCharacterToDb = function (form, callbackData)
    {
        var saveSuccess = saveCharacterSuccess.bind(this, callbackData);
        var saveFailure = dbFailure.bind(this, callbackData.failureMessage);

        var newCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = newCharacter.name;
        lifeStory.values.characterAlive = newCharacter.living;

        lifeStory.db.addCharacter(newCharacter, saveSuccess, saveFailure);
    };

    dataAccessLibrary.updateCharacterInDb = function (form, callbackData)
    {
        var updateSuccess = genericSuccessCallback.bind(this, callbackData);
        var updateFailure = dbFailure.bind(this, callbackData.failureMessage);

        var updatedCharacter = lifeStory.util.createCharacterFromInput(form);
        lifeStory.values.characterName = updatedCharacter.name;
        lifeStory.values.characterAlive = updatedCharacter.living;

        lifeStory.db.updateCharacter(updatedCharacter, updateSuccess, updateFailure);
    };

    // Callback function for successfully deleting a character
    function deleteCharacterSuccess(callbackData)
    {
        lifeStory.values.characterId = null;
        lifeStory.values.characterName = null;
        lifeStory.values.characterAlive = null;

        genericSuccessCallback(callbackData);
    }

    // Attempts to delete the character identified by characterId and displays a message of the outcome
    dataAccessLibrary.deleteCharacter = function(characterId, callbackData)
    {
        var deleteSuccess = deleteCharacterSuccess.bind(this, callbackData);
        var deleteFailure = dbFailure.bind(this, 'Failed to delete the character.');

        lifeStory.db.deleteCharacter(characterId, deleteSuccess, deleteFailure);
    };

    dataAccessLibrary.saveEventToDb = function(form, callbackData)
    {
        var saveSuccess = genericSuccessCallback.bind(this, callbackData);
        var saveFailure = dbFailure.bind(this, callbackData.failureMessage);

        var newEvent = lifeStory.util.createEventFromInput(form);
        var newEventDetails = lifeStory.util.createEventDetailsFromInput(form, newEvent.eventTypeId);
        var characterId = lifeStory.values.characterId;

        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, saveSuccess, saveFailure);
    };

    dataAccessLibrary.updateEventInDb = function(form, callbackData)
    {
        var saveSuccess = genericSuccessCallback.bind(callbackData);
        var saveFailure = dbFailure.bind(this, callbackData.failureMessage);

        var event = lifeStory.util.createEventFromInput(form);
        var eventDetails = lifeStory.util.createEventDetailsFromInput(form, event.eventTypeId);

        lifeStory.db.updateEvent(event, eventDetails, saveSuccess, saveFailure);
    };

    // Callback function for successfully deleting an event
    function deleteEventSuccess(callbackData)
    {
        lifeStory.values.eventId = null;

        genericSuccessCallback(callbackData);
    }

    // Attempts to delete the character identified by eventId and displays a message of the outcome
    dataAccessLibrary.deleteEvent = function(eventId, callbackData)
    {
        var deleteSuccess = deleteEventSuccess.bind(this, callbackData);
        var deleteFailure = dbFailure.bind(this, 'Failed to delete the event.');
        var characterId = lifeStory.values.characterId;

        lifeStory.db.deleteEvent(eventId, characterId, deleteSuccess, deleteFailure);
    };

    function otherEventSuccess(callbackData, newAliveStatus)
    {
        lifeStory.values.characterAlive = newAliveStatus;

        genericSuccessCallback(callbackData);
    }

    function prepareOtherEventData(form, callbackData)
    {
        var successCallback = otherEventSuccess.bind(this, callbackData);
        var saveFailure = dbFailure.bind(this, callbackData.failureMessage);

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

    dataAccessLibrary.saveOtherEventToDb = function(form, callbackData)
    {
        /// <summary>
        ///     Saves a resurrection or death event to the DB.
        /// </summary>
        /// <param name="form" type="DOM Element">The form to get data from</param>
        /// <param name="callbackData" type="object">
        ///     Additional callback data to pass to the success callback
        /// </param>

        var data = prepareOtherEventData(form, callbackData);

        var newAliveStatus = data.event.eventTypeId === lifeStory.RESURRECT_EVENT
            ? lifeStory.ALIVE
            : lifeStory.DEAD;

        var saveSuccess = data.successCallback.bind(this, newAliveStatus);
        var saveFailure = data.failureCallback;

        var newEvent = data.event;

        var newEventDetails = data.eventDetails;
        var characterId = lifeStory.values.characterId;


        lifeStory.db.addEvent(newEvent, newEventDetails, characterId, saveSuccess, saveFailure);
    };

    dataAccessLibrary.updateOtherEventInDb = function (form, callbackData)
    {
        /// <summary>
        ///     Updates a resurrection or death event in the DB.
        /// </summary>
        /// <param name="form" type="DOM Element">The form to get data from</param>
        /// <param name="callbackData" type="object">
        ///     Additional callback data to pass to the success callback
        /// </param>

        var data = prepareOtherEventData(form, callbackData);

        var updateSuccess = data.successCallback;
        var updateFailure = data.failureCallback;

        var updatedEvent = data.event;
        var updatedEventDetails = data.eventDetails;

        lifeStory.db.updateEvent(updatedEvent, updatedEventDetails, updateSuccess, updateFailure);
    };
    
})(window, window.lifeStory);