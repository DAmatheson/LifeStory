/* validation.js
 * Purpose: Validation functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.18: Created
 */

(function (window, lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by util but is undefined.';
    }

    var validationLibrary = lifeStory.validation = {};

    var classRaceNameRules =
    {
        required: true,
        rangelength: [2, 20]
    };

    function setupFormValidation(formId, submitHandler, rules, messages, submitCallbackData)
    {
        if (submitCallbackData)
        {
            var passedInSubmitHandler = submitHandler;

            submitHandler = function(form)
            {
                passedInSubmitHandler(form, submitCallbackData);
            }
        }

        $('#' + formId).validate(
        {
            submitHandler: submitHandler,
            rules: rules,
            messages: messages
        });
    }

    validationLibrary.handleRaceForm = function(formId)
    {
        var rules = { raceName: classRaceNameRules };

        var messages =
        {
            raceName:
            {
                required: 'Please enter the race name.',
                rangelength: 'Race name must be between 2 and 20 characters long.'
            }
        };

        var submitHandler = lifeStory.util.saveRaceToDb;

        var callbackData = { redirectToPageId: 'createCharacter', formIdToReset: formId }

        setupFormValidation(formId, submitHandler, rules, messages, callbackData);
    };

    validationLibrary.handleClassForm = function (formId)
    {
        var rules = { className: classRaceNameRules };

        var messages =
        {
            className:
            {
                required: 'Please enter the class name.',
                rangelength: 'Class name must be between 2 and 20 characters long.'
            }
        };

        var submitHandler = lifeStory.util.saveClassToDb;

        setupFormValidation(formId, submitHandler, rules, messages);
    };
})(window, lifeStory, jQuery);