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

    utilLibrary.redirectToPage = function(pageId)
    {
        $.mobile.changePage('#' + pageId);
    };

    utilLibrary.redirectOnSuccessDialogClose = function(redirectToPageId)
    {
        /// <summary>
        ///     Redirects to the page identified by redirectToPageId when the success dialog is closed
        /// </summary>
        /// <param name="redirectToPageId" type="string">Id of the page to redirect to</param>

        $('#successBtn').one('tap', function(event)
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
        var levels = [0, 300, 900, 2700, 6500,
            14000, 23000, 34000, 48000, 64000,
            85000, 100000, 120000, 140000, 165000,
            195000, 225000, 265000, 305000, 355000];

        for (var i = 1; i < levels.length - 1; i++) {
            if (xpTotal < levels[i])
            {
                return i;
            }
        }

        // return highest level if above the highest xp requirement
        return levels.length;
    }
})(window, window.lifeStory, jQuery);