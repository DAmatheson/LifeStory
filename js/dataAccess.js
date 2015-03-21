/* dataAccess.js
 * Purpose: Data access methods for lifeStory
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.19: Created
 */

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
        /// <param name="errorMessage" type=""></param>
        /// <param name="transaction" type=""></param>
        /// <param name="error" type=""></param>

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
            lifeStory.util.redirectToPage(callbackData.redirectToPageId);
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

        $('button', form).blur();
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
            lifeStory.util.redirectToPage(callbackData.redirectToPageId);
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

        $('button', form).blur();
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
        lifeStory.ui.displaySuccessMessage('New character created.');
        //lifeStory.util.redirectToPage(callbackData.redirectToPageId); // TODO: Show the created character's event log
    }

    dataAccessLibrary.saveCharacterToDb = function (form)
    {
        //var successCallback = modifySuccessCallback(saveCharacterSuccess, callbackData); // TODO: To redirect to details page
        var saveFailure = failureCallback('Failed to create the character.');

        lifeStory.db.addCharacter(lifeStory.util.createCharacterFromInput(form), saveCharacterSuccess,
            saveFailure);
    };

    function updateCharacterSuccess(transaction, resultSet, callbackData)
    {
        lifeStory.ui.displaySuccessMessage('Character updated.');
        //lifeStory.util.redirectToPage(callbackData.redirectToPageId); // TODO: Show the character's details page
    }

    dataAccessLibrary.updateCharacterInDb = function (form)
    {
        //var successCallback = modifySuccessCallback(updateCharacterSuccess, callbackData); // TODO: To redirect to details page
        var updateFailure = failureCallback('Failed to update the character.');

        lifeStory.db.updateCharacter(lifeStory.util.createCharacterFromInput(form),
            updateCharacterSuccess, updateFailure);
    };

})(window, window.lifeStory, jQuery);