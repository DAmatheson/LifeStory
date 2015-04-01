/* util.js
 * Purpose: Utility functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with utility functions located under lifeStory.util
(function (lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var utilLibrary = lifeStory.util = {};

    function reduceToOnlyInputs(element)
    {
        /// <summary>
        ///     Reduces the element down to only input elements
        /// </summary>
        /// <param name="element" type="DOMElement">The element to filter on</param>
        /// <returns type="jQuery">jQuery object of the input elements</returns>

        return $(':input:not(button)', element);
    }

    utilLibrary.createEventFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.Event with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.CharacterClass">The event created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var id = parseInt($inputs.filter('[name=id]').val(), 10) || null;
        var eventTypeId = $inputs.filter('[name=eventType]').val();
        var characterCount = $inputs.filter('[name=characterCount]').val();
        var experience = $inputs.filter('[name=experience]').val();
        var description = $inputs.filter('[name=description]').val();

        var event = new lifeStory.Event(eventTypeId, characterCount, experience, description);
        event.id = id;

        return event;
    };

    utilLibrary.createEventDetailsFromInput = function(form, eventTypeId)
    {
        /// <summary>
        ///     Pulls input from a form and returns an array of lifeStory.EventDetail with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="[lifeStory.EventDetail]">The event details created from the form input</returns>

        var $form = $(form);

        var eventDetailItems = [];

        if (eventTypeId === lifeStory.NON_COMBAT_EVENT ||
            eventTypeId === lifeStory.RESURRECT_EVENT ||
            eventTypeId === lifeStory.DEATH_EVENT)
        {
            var eventName = $form.find('[name=eventName]').val().trim();
            var creatureCount = null;

            eventDetailItems.push(new lifeStory.EventDetail(1, eventName, creatureCount));
        }
        else
        {
            var detailCounter = 0;

            $('fieldset', $form).each(function ()
            {
                var $inputs = reduceToOnlyInputs(this);

                var detailId = detailCounter + 1;
                var enemyName = $inputs.filter('[name=enemyName]').val().trim();

                var creatureCount = $inputs.filter('[name=creatureCount]').val() || null;

                if (enemyName && creatureCount)
                {
                    eventDetailItems.push(new lifeStory.EventDetail(detailId, enemyName, creatureCount));

                    detailCounter++;
                }
            });
        }

        return eventDetailItems;
    };

    utilLibrary.createCharacterFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.Character with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.Character">The character created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var character = new lifeStory.Character();

        character.id = $inputs.filter('[name=id]').val() || null;
        character.name = $inputs.filter('[name=name]').val().trim();
        character.raceId = $inputs.filter('[name=raceId]').val();
        character.classId = $inputs.filter('[name=classId]').val();
        character.living = $inputs.filter('[name=living]').val() || lifeStory.ALIVE;
        character.details = $inputs.filter('[name=details]').val().trim() || null;

        return character;
    };

    utilLibrary.createRaceFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.Race with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.Race">The race created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var raceName = $inputs.filter('[name=raceName]').val().trim();

        return new lifeStory.Race(raceName);
    };

    utilLibrary.createClassFromInput = function(form)
    {
        /// <summary>
        ///     Pulls input from a form and returns a new lifeStory.CharacterClass with those values
        /// </summary>
        /// <param name="form" type="DOMElement">The form to pull input values from</param>
        /// <returns type="lifeStory.CharacterClass">The class created from the form input</returns>

        var $inputs = reduceToOnlyInputs(form);

        var className = $inputs.filter('[name=className]').val().trim();

        return new lifeStory.CharacterClass(className);
    };

    utilLibrary.isCombatEvent = function()
    {
        /// <summary>
        ///     Checks if the current form is for a combat event
        /// </summary>
        /// <returns type="bool">True if the form is for a combat event, false otherwise</returns>

        var eventTypeId = $('#eventType option:selected, #editEventForm input[name=eventType]',
            $.mobile.activePage).val();

        return parseInt(eventTypeId, 10) === lifeStory.COMBAT_EVENT;
    };

    utilLibrary.triggerReset = function(formIdToReset)
    {
        /// <summary>
        ///     Triggers a reset on the form with the matching id
        /// </summary>
        /// <param name="formIdToReset" type="string">The id of the form to reset</param>

        $('#' + formIdToReset).trigger('reset');
    };

    utilLibrary.redirectToPage = function (pageId)
    {
        /// <summary>
        ///     Changes page to the page with the id matching pageId
        /// </summary>
        /// <param name="pageId" type="string">The id of the page to switch to</param>

        $.mobile.changePage('#' + pageId);
    };

    utilLibrary.redirectOnSuccessDialogClose = function(redirectToPageId)
    {
        /// <summary>
        ///     Redirects to the page identified by redirectToPageId when the success dialog is closed
        /// </summary>
        /// <param name="redirectToPageId" type="string">Id of the page to redirect to</param>

        // Unbind any previous events and bind the new one
        $('#successBtn').off('tap').one('tap', function(event)
        {
            event.stopImmediatePropagation();
            event.preventDefault();

            utilLibrary.redirectToPage(redirectToPageId);
        });
    };

    utilLibrary.convertToSelectEntrys = function(resultSet, valueName, callback)
    {
        /// <summary>
        ///     Converts the values from a resultSet into an array of key value lifeStory.SelectEntrys
        /// </summary>
        /// <param name="resultSet">The result set</param>
        /// <param name="valueName" type="string">The column name to pull the value from</param>
        /// <param name="callback" type="function">The function to call with the converted results</param>

        var results = [];

        for (var i = 0; i < resultSet.rows.length; i++)
        {
            results[i] = new lifeStory.SelectEntry(resultSet.rows.item(i).id,
                resultSet.rows.item(i)[valueName]);
        }

        callback(results);
    };

    utilLibrary.getLevel = function(xpTotal)
    {
        /// <summary>
        ///     Calculates a character's level based on their total XP
        /// </summary>
        /// <param name="xpTotal" type="number">The amount of XP the character has accrued</param>
        /// <returns type="number">The character's current level</returns>

        xpTotal = xpTotal || 0;

        // you are level n if your xp is between index n-1 and n
        for (var i = 1; i < lifeStory.LEVEL_VALUES.length - 1; i++)
        {
            if (xpTotal < lifeStory.LEVEL_VALUES[i])
            {
                return i;
            }
        }

        // return highest level if above the highest xp requirement
        return lifeStory.LEVEL_VALUES.length;
    };

    utilLibrary.experienceToNextLevel = function(xpTotal)
    {
        /// <summary>
        ///     Calculates the amount of experience until the next level based on total XP
        /// </summary>
        /// <param name="xpTotal" type="number">The total amount of XP the character has accrued</param>
        /// <returns type="number">The amount of experience until the character's next level</returns>

        var level = utilLibrary.getLevel(xpTotal);

        return lifeStory.LEVEL_VALUES[level] - xpTotal;
    };

})(window.lifeStory, jQuery);