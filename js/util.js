/* util.js
 * Purpose: Utility functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with utility functions located under lifeStory.util
(function (window, lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var utilLibrary = lifeStory.util = {};

    function reduceToOnlyInputs(element)
    {
        return $(':input:not(button)', element);
    }

    utilLibrary.createEventFromInput = function(form)
    {
        var $inputs = reduceToOnlyInputs(form);

        var id = parseInt($inputs.filter('[name=id]').val(), 10) || null;
        var eventTypeId = $inputs.filter('[name=eventType]').val();
        var characterCount = $inputs.filter('[name=characterCount]').val();
        var experience = $inputs.filter('[name=experience]').val();
        var description = $inputs.filter('[name=description]').val();

        var event = new lifeStory.Event(eventTypeId, characterCount, experience, description);
        event.id = id;

        return event;
    }

    utilLibrary.createEventDetailsFromInput = function(form, eventTypeId)
    {
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
        var $inputs = reduceToOnlyInputs(form);

        var raceName = $inputs.filter('[name=raceName]').val().trim();

        return new lifeStory.Race(raceName);
    };

    // Returns a new class object populated with the values from the passed in inputs
    utilLibrary.createClassFromInput = function(form)
    {
        var $inputs = reduceToOnlyInputs(form);

        var className = $inputs.filter('[name=className]').val().trim();

        return new lifeStory.CharacterClass(className);
    };

    utilLibrary.isCombatEvent = function()
    {
        // TODO: Make this work on both the edit and the create
        return parseInt($('#eventType option:selected').val(), 10) === lifeStory.COMBAT_EVENT;
    }

    utilLibrary.redirectToPage = function(pageId)
    {
        $.mobile.changePage('#' + pageId);
    };

    utilLibrary.triggerReset = function(formIdToReset)
    {
        $('#' + formIdToReset).trigger('reset');
    }

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

    utilLibrary.xpToNextLevel = function(xpTotal)
    {
        var level = utilLibrary.getLevel(xpTotal);

        return lifeStory.LEVEL_VALUES[level] - xpTotal;
    };

})(window, window.lifeStory, jQuery);