﻿/* database.js
 * Purpose: UI functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// 
(function (window, lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by ui but is undefined.';
    }

    var uiLibrary = lifeStory.ui = {};

    // Populate the select element matching selectElementId with key and values from data
    uiLibrary.populateList = function (selectElementId, data)
    {
        if (!Array.isArray(data))
        {
            throw 'The data argument for populateList must be an array';
        }
        else if (data.length === 0)
        {
            throw 'The data argument for populateList must contain at least one element.';
        }
        else if (!(data[0] instanceof lifeStory.SelectEntry))
        {
            throw 'The entries in the data argument for populateList must be instances of SelectEntry';
        }

        var text = '';

        for (var i = 0; i < data.length; i++)
        {
            text += '<option value="' + data[i].key + '">' + data[i].value + '</option>';
        }

        $('select#' + selectElementId).
            html(text). // TODO: Switch this back to append if a fix is found for requiring an option entry for select menues
            selectmenu('refresh');
    };

    // TODO: Remove this once it is not longer needed
    // Usage example:
    //$('button#clearCharacters').on('tap',
    //    { countDisplaySelector: '#selector' },
    //    lifeStory.ui.confirmClearCharactersTable);

    // Confirms the user wants to clear the character table. If so, clears the table.
    uiLibrary.confirmClearCharactersTable = function (e)
    {
        // Create a local copy of the event data so that it is captured in the callback's closure
        var eventData = e.data;

        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't use.
        lifeStory.db.getCharacterCount(function (characterCount)
        {
            var result = confirm('All (' + characterCount +
                ') character records will be deleted permanently. Continue?');

            if (result === true)
            {
                lifeStory.db.clearCharacterTable();

                if (eventData !== undefined && eventData !== null &&
                    eventData.countDisplaySelector !== undefined &&
                    eventData.countDisplaySelector !== null)
                {
                    $(eventData.countDisplaySelector).text('0');
                }
            }
        });
    };

})(window, lifeStory, jQuery);