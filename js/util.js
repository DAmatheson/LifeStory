/* database.js
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

    utilLibrary.fetchEventDetails = function(formId, inputSetContainer)
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