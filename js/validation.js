/* validation.js
 * Purpose: Validation functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.18: Created
 */

// Extend lifeStory with validation functions located under lifeStory.validation
(function(window, lifeStory, $, undefined)
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
        // If callback data is passed in, set up a function to call the submit handler with
        // the form and that callback data
        if (submitCallbackData)
        {
            var passedInSubmitHandler = submitHandler;

            submitHandler = function(form)
            {
                passedInSubmitHandler(form, submitCallbackData);
            };
        }

        $('#' + formId).validate(
        {
            submitHandler: submitHandler,
            rules: rules,
            messages: messages
        });
    }

    validationLibrary.handleRaceForm = function(formId, redirectToPageIdOnSubmit)
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

        var submitHandler = lifeStory.dataAccess.saveRaceToDb;

        var callbackData =
        {
            redirectToPageId: redirectToPageIdOnSubmit,
            formIdToReset: formId,
            isCustomizePage: !redirectToPageIdOnSubmit
        };

        setupFormValidation(formId, submitHandler, rules, messages, callbackData);
    };

    validationLibrary.handleClassForm = function(formId, redirectToPageIdOnSubmit)
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

        var callbackData =
        {
            redirectToPageId: redirectToPageIdOnSubmit,
            formIdToReset: formId,
            isCustomizePage: !redirectToPageIdOnSubmit
        };

        var submitHandler = lifeStory.dataAccess.saveClassToDb;

        setupFormValidation(formId, submitHandler, rules, messages, callbackData);
    };

    validationLibrary.handleCharacterForm = function(formId, isNewCharacterForm)
    {
        var rules =
        {
            name:
            {
                required: true,
                rangelength: [1, 50]
            },
            raceId:
            {
                required: true,
                number: true
            },
            classId:
            {
                required: true,
                number: true
            }
        };

        var messages =
        {
            name:
            {
                required: 'Your character must have a name.',
                rangelength: 'Your character\'s name must be between 1 and 50 characters long.'
            },
            raceId:
            {
                required: 'Your character must have a race.',
                number: 'Please create a race for your character.'
            },
            classId:
            {
                required: 'Your character must have a class.',
                number: 'Please create a class for your character.'
            }
        };

        var callbackData =
        {
            formIdToReset: formId
        };

        if (isNewCharacterForm)
        {
            setupFormValidation(formId, lifeStory.dataAccess.saveCharacterToDb, rules, messages,
                callbackData);
        }
        else
        {
            setupFormValidation(formId, lifeStory.dataAccess.updateCharacterInDb, rules, messages,
                callbackData);
        }
    };

    validationLibrary.handleEventForm = function (formId, isNewEventForm)
    {
        var rules =
        {
            eventType:
            {
                required: true,
                number: true
            },
            enemyName: // Combat event only
            {
                required:
                {
                    param: true,
                    depends: lifeStory.util.isCombatEvent
                },
                maxlength:
                {
                    param: 30,
                    depends: lifeStory.util.isCombatEvent
                }
            },
            creatureCount: // Combat event only
            {
                required:
                {
                    param: true,
                    depends: lifeStory.util.isCombatEvent
                },
                number:
                {
                    param: true,
                    depends: lifeStory.util.isCombatEvent
                }
            },
            eventName: // Non Combat event only
            {
                required:
                {
                    param: true,
                    depends: !lifeStory.util.isCombatEvent
                },
                maxlength:
                {
                    param:  30,
                    depends: !lifeStory.util.isCombatEvent
                }
            },
            experience:
            {
                required: true,
                number: true,
                min: 0
            },
            characterCount:
            {
                required: true,
                number: true
            }
        };

        var messages =
        {
            eventType:
            {
                required: 'You must select an XP source.',
                number: 'Please select an XP source.'
            },
            enemyName:
            {
                required: 'Please enter a name.',
                maxlength: 'Max 30 characters long.'
            },
            creatureCount:
            {
                required: 'Required.',
                number: 'Must be a number.'
            },
            eventName:
            {
                required: 'Please enter what got you experience.',
                maxlength: 'Max 30 characters long.'
            },
            experience:
            {
                required: 'Please enter the total XP amount.',
                number: 'XP amount must be a number.',
                min: 'XP amount must be at least 0.'
            },
            characterCount:
            {
                required: 'Please enter how many characters shared the XP.',
                number: 'Character count must be a number.' // TODO: This message needs work
            }
        };

        var callbackData =
        {
            formIdToReset: formId
        };

        if (isNewEventForm)
        {
            setupFormValidation(formId, lifeStory.dataAccess.saveEventToDb, rules, messages,
                callbackData);
        }
        else
        {
            setupFormValidation(formId, lifeStory.dataAccess.updateEventInDb, rules, messages,
                callbackData);
        }
    };

    validationLibrary.handleOtherEventForm = function(formId, isResurrectEvent)
    {
        var rules =
        {
            eventName:
            {
                required:
                {
                    param: true,
                    depends: !lifeStory.util.isCombatEvent
                },
                maxlength:
                {
                    param: 30,
                    depends: !lifeStory.util.isCombatEvent
                }
            }
        };

        var messages =
        {
            eventName:
            {
                required: 'Please enter what got you experience.',
                maxlength: 'Max 30 characters long.'
            }
        };

        var callbackData =
        {
            formIdToReset: formId,
            successMessage: isResurrectEvent ? 'You\'ve been resurrected successfully.' : 'You died.', // TODO: Messages
            failureMessage: 'Failed to save ' + (isResurrectEvent ? 'resurrection.' : 'death.'), // TODO: Messages
            isResurrection: isResurrectEvent
        };

        setupFormValidation(formId, lifeStory.dataAccess.saveOtherEventToDb, rules, messages,
            callbackData);
    }

})(window, window.lifeStory, jQuery);