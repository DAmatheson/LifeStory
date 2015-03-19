/* ui.js
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

    // Filters the character list to remove deceased characters if the source checkbox is unchecked
    uiLibrary.filterCharacterList = function()
    {
        var $listItems = $('#characterList').children();

        if ($(this).is(':checked'))
        {
            $listItems.each(function(index, element)
            {
                $(element).removeClass('ui-screen-hidden');
            });
        }
        else
        {
            $listItems.each(function(index, element)
            {
                if ($(element).attr('data-theme') === 'f')
                {
                    $(element).addClass('ui-screen-hidden');
                }
            });
        }
    };

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

        $('#' + selectElementId).
            children().remove().end(). // Remove placeholder option which prevents an error in jQM 1.1.2
            append(text).
            selectmenu('refresh');
    };

    uiLibrary.duplicateInputSet = function(appendToSelector, templateElementId, removeButtonSelector)
    {
        if ($(appendToSelector + ':not(#' + templateElementId + ')').length === 0)
        {
            $(removeButtonSelector).closest('.ui-btn').show();
        }

        $(appendToSelector).after(
            $('#' + templateElementId).
                clone().
                removeAttr('id'). // Remove id from the clone
                find('label').remove(). // Find and remove the labels
                end(). // Collapse the jQuery object down to keep only the remaining elements
                find('input').removeAttr('id').val(''). // Find the inputs and remove their ids and values
                end() // Collapse the jQuery object down again
        );
    };

    uiLibrary.removeInputSet = function(toRemoveSelector, removeButtonSelector)
    {
        $(toRemoveSelector).remove();

        if ($(toRemoveSelector).length === 0)
        {
            $(removeButtonSelector).closest('.ui-btn').hide();
        }
    };

    // Helper function to populate the race and class lists specified by the two arguments
    uiLibrary.populateRaceAndClassList = function(raceListId, classListId)
    {
        lifeStory.db.getClasses(function(selectEntries)
        {
            uiLibrary.populateList(classListId, selectEntries);
        });

        lifeStory.db.getRaces(function(selectEntries)
        {
            uiLibrary.populateList(raceListId, selectEntries);
        });
    };

    // Confirms the user wants to clear the character table. If so, clears the table.
    uiLibrary.confirmClearCharactersTable = function ()
    {
        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't use.
        lifeStory.db.getCharacterCount(function (characterCount)
        {
            // TODO: Use a better looking confirmation, consider http://jsfiddle.net/taditdash/vvjj8/
            var result = confirm('Are you sure you want to delete all (' + characterCount +
                ') characters permanently? This cannot be undone.');

            if (result === true)
            {
                lifeStory.db.clearCharacterTable();
            }
        });
    };

    // Confirms the user wants to clear the database. If so, clears the database.
    uiLibrary.confirmClearDatabase = function ()
    {
        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't use.
        lifeStory.db.getCharacterCount(function (characterCount)
        {
            // TODO: Use a better looking confirmation, consider http://jsfiddle.net/taditdash/vvjj8/
            var result = confirm('Are you sure you want to delete all data? This will delete all ('
                 + characterCount + ') characters, their events, and custom races and classes ' +
                'permanently. This cannot be undone.');

            if (result === true)
            {
                lifeStory.db.dropAllTables();
            }
        });
    };

})(window, window.lifeStory, jQuery);