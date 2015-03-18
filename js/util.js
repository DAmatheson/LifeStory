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

    function createRaceFromInput($inputs)
    {
        var raceName = $inputs.filter('[name=raceName]').val();

        return new lifeStory.Race(raceName);
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
        alert('Failed to create the new race.');

        console.error(error.message, transaction, error);
    }

    utilLibrary.saveRaceToDb = function (form, callbackData)
    {
        var $inputs = $(':input:not(button)', form);

        lifeStory.db.addRace(createRaceFromInput($inputs), saveRaceSuccess, saveRaceFailure, callbackData);

        $('button', form).blur(); // TODO: Confirm this works
    };

    // Returns a new class object populated with the values from the passed in inputs
    function createClassFromInput($inputs)
    {
        var className = $inputs.filter('[name=className').val();

        return new lifeStory.CharacterClass(className);
    }

    // Callback function for successfully saving a class
    function saveClassSuccess(transaction, resultSet)
    {
        alert('New custom class created.');

        $.mobile.changePage('#dmViewFeedback'); // TODO: Figure out how to decide which page to redirect to
    }

    // Callback function for failure to save a class
    function saveClassFailure(transaction, error)
    {
        alert('Failed to create the new class.');

        console.error(error.message, transaction, error);
    }

    // Gets the form data and calls db.addClass
    utilLibrary.saveClassToDb = function (form)
    {
        var $inputs = $(':input:not(button)', form); // TODO: Consider removing : before input

        lifeStory.db.addClass(createClassFromInput($inputs), saveClassSuccess, saveClassFailure);

        $('button', form).blur(); // TODO: Confirm this works
    };

    utilLibrary.createCharacterValidate = function ()
    {
        $('#createCharacterForm').validate(
        {
            rules: {
                name: {
                    required:true
                }
            },
            messages: {
                name: {
                    required:"Your character must have a name."
                }
            }
        });
    }

})(window, lifeStory, jQuery);