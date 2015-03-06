/* database.js
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