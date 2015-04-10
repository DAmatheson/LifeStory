/* ui.js
 * Purpose: UI functions for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with ui functions located under lifeStory.ui
(function (lifeStory, $, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by ui but is undefined.';
    }

    var uiLibrary = lifeStory.ui = {};

    // Displays a confirmation dialog and returns the users choice
    uiLibrary.displayConfirmation = function(title, message, acceptCallback, denyCallback)
    {
        /// <summary>
        ///     Displays a confirmation popup to the user<br/>
        ///     #confirmAccept is the accept button<br/>
        ///     #confirmDeny is the decline button
        /// </summary>
        /// <param name="title" type="string">Title to display</param>
        /// <param name="message" type="string">Message to display</param>
        /// <param name="acceptCallback" type="function">
        ///     Optional. Callback to call if the user accepts
        /// </param>
        /// <param name="denyCallback" type="function">
        ///     Optional. Callback to call if the user declines
        /// </param>

        $('#confirmTitle').text(title);
        $('#confirmMessage').text(message);
        $('#confirmDialog').popup('open');

        if (acceptCallback)
        {
            $('#confirmAccept').one('tap', function()
            {
                // Make this run after all of the event handlers so the dialog is closed first
                setTimeout(acceptCallback, 50);

                $('#confirmDeny').off('tap');
            });
        }

        if (denyCallback)
        {
            $('#confirmDeny').one('tap', function()
            {
                // Make this run after all of the event handlers
                setTimeout(denyCallback, 50);
                $('#confirmAccept').off('tap');
            });
        }
    };

    uiLibrary.displaySuccessMessage = function (message, dismissCallback)
    {
        /// <summary>
        ///     Displays the passed in success message to the user
        /// </summary>
        /// <param name="message" type="string">Success message to display</param>

        $('#successMessage').text(message);
        $('#successDialog').popup('open');

        if (dismissCallback)
        {
            $('#successBtn').one('tap', function ()
            {
                // Make this run after all of the event handlers
                setTimeout(dismissCallback, 100);
                $('#successBtn').off('tap');
            });
        }
    };

    uiLibrary.displayErrorMessage = function(message)
    {
        /// <summary>
        ///     Displays the passed in error message to the user
        /// </summary>
        /// <param name="message" type="string">Error message to display</param>

        $('#errorMessage').text(message);
        $('#errorDialog').popup('open');
    };

    uiLibrary.filterCharacterList = function()
    {
        /// <summary>
        ///     Filters the character list to remove deceased characters if the source checkbox is
        ///     unchecked
        /// </summary>

        lifeStory.values.showDeceased = this.checked;

        var hideDead = !this.checked; // We show when checked, so flip the value

        // Add class if hideDead is true, otherwise remove it
        $('#characterList li[data-theme=f]').toggleClass('ui-screen-hidden', hideDead);
    };

    uiLibrary.refreshDeleteRaceUIState = function ()
    {
        /// <summary>
        ///     Updates the state of the delete race select list to match its current options
        /// </summary>

        if ($('#deleteRaceSelect option:first').is(':disabled'))
        {
            $('#deleteRace').button('disable');
            $('#deleteRaceSelect').selectmenu('disable');
        }
        else
        {
            $('#deleteRace').button('enable');
            $('#deleteRaceSelect').selectmenu('enable');
        }
    };

    uiLibrary.refreshDeleteClassUIState = function ()
    {
        /// <summary>
        ///     Updates the state of the delete class select list to match its current options
        /// </summary>

        if ($('#deleteClassSelect option:first').is(':disabled'))
        {
            $('#deleteClass').button('disable');
            $('#deleteClassSelect').selectmenu('disable');
        }
        else
        {
            $('#deleteClass').button('enable');
            $('#deleteClassSelect').selectmenu('enable');
        }
    };

    uiLibrary.showCombatDetailInputs = function(isEdit)
    {
        /// <summary>
        ///     Shows the combat detail inputs
        /// </summary>
        /// <param name="isEdit" type="boolean">
        ///     If true, shows the inputs on the edit page. Otherwise, shows the inputs on the create page
        /// </param>

        if (isEdit)
        {
            $('#editEventDetailInputs').hide();
            $('#editCombatDetailInputs').show();
        }
        else
        {
            $('#eventDetailInputs').hide();
            $('#combatDetailInputs').show();
        }
    };

    uiLibrary.showEventDetailInputs = function(isEdit)
    {
        /// <summary>
        ///     Shows the event detail inputs
        /// </summary>
        /// <param name="isEdit" type="boolean">
        ///     If true, shows the inputs on the edit page. Otherwise, shows the inputs on the create page
        /// </param>

        if (isEdit)
        {
            $('#editCombatDetailInputs').hide();
            $('#editEventDetailInputs').show();
        }
        else
        {
            $('#combatDetailInputs').hide();
            $('#eventDetailInputs').show();
        }
    };

    uiLibrary.populateSelectList = function (selectElementId, data, name)
    {
        /// <summary>
        ///     Populate the select element matching selectElementId with key and values from data
        /// </summary>
        /// <param name="selectElementId" type="string">Id of the select element to add options to</param>
        /// <param name="data" type="Array">
        ///     An array containing the data as lifeStory.SelectEntry objects
        /// </param>

        if (!Array.isArray(data))
        {
            throw 'The data argument for populateSelectList must be an array';
        }
        else if (data.length > 0 && !(data[0] instanceof lifeStory.SelectEntry))
        {
            throw 'The entries in the data argument for populateSelectList must be instances ' +
                'of lifeStory.SelectEntry';
        }

        var previousValue;

        if (name === 'class')
        {
            previousValue = lifeStory.values.newClassId;
        }
        else if (name === 'race')
        {
            previousValue = lifeStory.values.newRaceId;
        }

        previousValue = previousValue || parseInt($('#' + selectElementId).val(), 10);

        $('#' + selectElementId).children().remove().end();

        var $option = $('<option></option>');

        for (var i = 0; i < data.length; i++)
        {
            var currentOption = $option.clone();
            currentOption.val(data[i].key).text(data[i].value);

            if (data[i].key === previousValue)
            {
                currentOption.prop('selected', 'selected');
            }

            $('#' + selectElementId).append(currentOption);
        }

        if (data.length === 0)
        {
            $('#' + selectElementId).append('<option disabled>-- No Races Created --</option>');
        }

        $('#' + selectElementId).selectmenu('refresh');
    };

    uiLibrary.populateClassList = function(classListId, populationCompleteCallback)
    {
        /// <summary>
        ///     Populates the class lists with the data in the database
        /// </summary>
        /// <param name="classListId" type="string">Id of the class list to populate</param>
        /// <param name="refreshDeleteUI" type="string">
        ///     Callback to call when the list has been populated
        /// </param>

        lifeStory.db.getClasses(function(selectEntries)
        {
            uiLibrary.populateSelectList(classListId, selectEntries, 'class');

            if (typeof populationCompleteCallback === 'function')
            {
                populationCompleteCallback();
            }
        });
    };

    uiLibrary.populateRaceList = function(raceListId, populationCompleteCallback)
    {
        /// <summary>
        ///     Populates the race lists with the data in the database
        /// </summary>
        /// <param name="raceListId" type="string">Id of the race list to populate</param>
        /// <param name="refreshDeleteUI" type="string">
        ///     Callback to call when the list has been populated
        /// </param>

        lifeStory.db.getRaces(function(selectEntries)
        {
            uiLibrary.populateSelectList(raceListId, selectEntries, 'race');

            if (typeof populationCompleteCallback === 'function')
            {
                populationCompleteCallback();
            }
        });
    };

    uiLibrary.populateRaceAndClassList = function (raceListId, classListId, refreshDeleteUI)
    {
        /// <summary>
        ///     Populates the race and class lists with the data in the database
        /// </summary>
        /// <param name="raceListId" type="string">Id of the race list to populate</param>
        /// <param name="classListId" type="string">Id of the class list to populate</param>
        /// <param name="refreshDeleteUI" type="boolean">
        ///     True if the delete UI on customize page should be refreshed
        /// </param>

        uiLibrary.populateRaceList(raceListId,
            refreshDeleteUI ? uiLibrary.refreshDeleteRaceUIState : undefined);

        uiLibrary.populateClassList(classListId,
            refreshDeleteUI ? uiLibrary.refreshDeleteClassUIState : undefined);
    };

    uiLibrary.duplicateInputSet = function(insertAfterSelector, templateElementId, removeButtonSelector)
    {
        /// <summary>
        ///     Duplicates combat event the input set identified by templateElementId and inserts
        ///     it after insertAfterSelector. Shows removeButtonSelector
        /// </summary>
        /// <param name="insertAfterSelector" type="string">
        ///     jQuery selector string for the element to place the duplicated input set after
        /// </param>
        /// <param name="templateElementId" type="string">Id of the templateElement to duplicate</param>
        /// <param name="removeButtonSelector" type="string">
        ///     jQuery selector for the remove button to show if the element to append to contains only
        ///     the templateElementId element
        /// </param>

        if ($(insertAfterSelector + ':not(#' + templateElementId + ')').length === 0)
        {
            $(removeButtonSelector).closest('.ui-btn').show();
        }

        // Use the autocomplete source already on the first input to avoid accessing the db again
        var autocompleteTitles = $('#' + templateElementId + 
            ' input[name=enemyName]:first-child').autocomplete('option', 'source');

        $(insertAfterSelector).after(
            $('#' + templateElementId).
                clone().
                removeAttr('id'). // Remove id from the clone
                find('label').remove(). // Find and remove the labels
                end(). // Collapse the jQuery object down to keep only the remaining elements
                find('input').removeAttr('id').val(''). // Find the inputs and remove their ids and values
                end(). // Collapse the jQuery object down again
                find('input[name=enemyName]'). // Find the new enemy name input
                autocomplete(
                {
                    source: autocompleteTitles // Give the new input the same autocomplete as the first one
                }).
                end() // Collapse the new input fields down
        );
    };

    uiLibrary.removeInputSet = function(toRemoveSelector, removeButtonSelector)
    {
        /// <summary>
        ///     Removes combat event input sets which match toRemoveSelector and hides the remove button
        ///     if no extra input sets remain
        /// </summary>
        /// <param name="toRemoveSelector" type="string">
        ///     jQuery selector string for the input sets to remove
        /// </param>
        /// <param name="removeButtonSelector" type="string">
        ///     jQuery selector for the remove button to hide if no elements matching 
        ///     toRemoveSelector remain
        /// </param>

        $(toRemoveSelector).remove();

        if ($(toRemoveSelector).length === 0)
        {
            $(removeButtonSelector).closest('.ui-btn').hide();
        }
    };

    function characterLinkClicked(event)
    {
        /// <summary>
        ///     Sets the values of lifeStory.values to the values for the clicked character
        /// </summary>
        /// <param name="event" type="jQuery.Event">
        ///     Event containing the character information for the clicked character
        /// </param>

        lifeStory.values.characterId = event.data.id;
        lifeStory.values.characterName = event.data.name;
        lifeStory.values.characterAlive = event.data.alive;
    }

    uiLibrary.populateCharacterList = function(listViewId, itemElementType)
    {
        /// <summary>
        ///     Populates the character list with all of the user's characters
        /// </summary>

        lifeStory.db.getCharacters(function (characters)
        {
            var $listContainer = $('#' + listViewId);
            var $reviewItem = $(':first(' + itemElementType + ')', $listContainer).
                clone().
                removeClass('ui-screen-hidden');

            // Remove everything except the first item. First item is hidden and used as a template
            $(':first(' + itemElementType + ')', $listContainer).siblings().remove();

            for (var i = 0; i < characters.length; i++)
            {
                var $currentItem = $reviewItem.clone();
                var character = characters[i];

                $('[data-property=name]', $currentItem).text(character.name);
                $('[data-property=raceName]', $currentItem).text(character.raceName);
                $('[data-property=className]', $currentItem).text(character.className);

                if (character.living === lifeStory.DEAD)
                {
                    $currentItem.attr('data-theme', 'f').
                        removeClass('ui-btn-up-c').addClass('ui-btn-up-f');
                }

                $('a', $currentItem).on('tap',
                    { id: character.id, name: character.name, alive: character.living },
                    characterLinkClicked
                );

                $listContainer.append($currentItem);
            }

            if (characters.length === 0)
            {
                $reviewItem.
                    find('a').
                    attr('href', '#createCharacter').
                    find('h1').
                    text('Add a Character').
                    siblings().
                    remove();

                // Change icon to a plus
                $reviewItem.find('span').removeClass('ui-icon-arrow-r').addClass('ui-icon-plus');

                $listContainer.append($reviewItem);
            }

            $listContainer.listview('refresh');

            // Manually invoke filterCharacterList with 'this' set to the showDeceased checkbox
            uiLibrary.filterCharacterList.call($('#showDeceased')[0]);
        });
    };

    function eventLogItemClicked(event)
    {
        /// <summary>
        ///     Sets the value of lifeStory.values.eventId to the Id of the clicked event
        /// </summary>
        /// <param name="event" type="jQuery.Event">
        ///     Event containing the eventId for the clicked event
        /// </param>

        lifeStory.values.eventId = event.data.eventId;
    }

    uiLibrary.populateEventLog = function (listViewId, itemElementType)
    {
        /// <summary>
        ///     Populates the event log page with the events for the selected character
        /// </summary>

        $('#eventLog h2[data-property=characterName]').text(lifeStory.values.characterName);

        lifeStory.db.getCharactersEvents(lifeStory.values.characterId, function (events)
        {
            var $listContainer = $('#' + listViewId);
            var $reviewItem = $(':first(' + itemElementType + ')', $listContainer).
                clone().
                removeClass('ui-screen-hidden');

            // Remove everything except the first item. First item is hidden and used as a template
            $(':first(' + itemElementType + ')', $listContainer).siblings().remove();

            for (var i = 0; i < events.length; i++)
            {
                var $currentItem = $reviewItem.clone();
                var event = events[i];

                var title = '';
                
                if (event.eventTypeId === lifeStory.COMBAT_EVENT)
                {
                    title = 'Defeated: ';

                    event.eventDetails.forEach(function(item)
                    {
                        title += item.creatureCount + ' ' + item.name + ', ';
                    });

                    title = title.slice(0, -2);
                }
                else if (event.eventTypeId === lifeStory.NON_COMBAT_EVENT)
                {
                    title = event.eventDetails[0].name;
                }
                else if (event.eventTypeId === lifeStory.RESURRECT_EVENT)
                {
                    title = 'Resurrected by: ' + event.eventDetails[0].name;
                }
                else if (event.eventTypeId === lifeStory.DEATH_EVENT)
                {
                    title = 'Died to: ' + event.eventDetails[0].name;
                }
                else
                {
                    title = event.eventTypeName;
                }

                $('[data-property=title]', $currentItem).text(title);

                if (event.eventTypeId === lifeStory.COMBAT_EVENT ||
                    event.eventTypeId === lifeStory.NON_COMBAT_EVENT)
                {
                    var characterExperience = Math.floor(event.experience / event.characterCount);

                    if (characterExperience > 0)
                    {
                        $('[data-property=experience]', $currentItem).text(characterExperience + ' XP');
                    }
                }

                if (event.eventTypeId === lifeStory.DEATH_EVENT)
                {
                    $currentItem.attr('data-theme', 'f').
                        removeClass('ui-btn-up-c').addClass('ui-btn-up-f');
                }
                else if (event.eventTypeId === lifeStory.RESURRECT_EVENT)
                {
                    $currentItem.attr('data-theme', 'g').
                        removeClass('ui-btn-up-c').addClass('ui-btn-up-g');
                }

                $('a', $currentItem).on('tap', { eventId: event.id }, eventLogItemClicked);

                $listContainer.append($currentItem);
            }

            if (events.length === 0)
            {
                $reviewItem.
                    find('a').
                    attr('href', '#createEvent').
                    find('h1').
                    text('Add a character event').
                    siblings().
                    remove();

                // Change icon to a plus
                $reviewItem.find('span').removeClass('ui-icon-arrow-r').addClass('ui-icon-plus');

                $listContainer.append($reviewItem);
            }

            if (lifeStory.values.characterAlive === lifeStory.ALIVE)
            {
                $('#diedButton').removeClass('ui-screen-hidden');
                $('#resurrectButton').addClass('ui-screen-hidden');
            }
            else
            {
                $('#resurrectButton').removeClass('ui-screen-hidden');
                $('#diedButton').addClass('ui-screen-hidden');
            }

            $listContainer.listview('refresh');
        });
    };

    uiLibrary.populateEventDetail = function()
    {
        /// <summary>
        ///     Populates the event details page with the data for the selected event
        /// </summary>

        var characterName = lifeStory.values.characterName;
        var eventId = lifeStory.values.eventId;

        $('#eventDetails h2[data-property=characterName]').text(characterName);

        lifeStory.db.getEvent(eventId, function(event)
        {
            var $detailsTable = $('#eventDetailsTable');

            var typeLabel = '';

            switch (event.eventTypeId)
            {
                case (lifeStory.COMBAT_EVENT):
                    typeLabel = 'Defeated:';
                    break;
                case (lifeStory.NON_COMBAT_EVENT):
                    typeLabel = 'Event Title:';
                    break;
                case (lifeStory.RESURRECT_EVENT):
                    typeLabel = 'Resurrected By:';
                    break;
                case (lifeStory.DEATH_EVENT):
                    typeLabel = 'Killed By:';
                    break;
            }

            $detailsTable.find('[data-property=typeLabel').text(typeLabel);
            $detailsTable.find('[data-property=eventType]').text(event.eventTypeName);
            $detailsTable.find('[data-property=date]').text(event.date);

            var names = '';

            event.eventDetails.forEach(function(item)
            {
                names += (item.creatureCount || '') + ' ' + item.name + ', ';
            });

            names = names.substring(0, names.length - 2).trim();

            $detailsTable.find('[data-property=names]').text(names);

            if (event.eventTypeId === lifeStory.RESURRECT_EVENT ||
                event.eventTypeId === lifeStory.DEATH_EVENT)
            {
                $('#experienceRow').addClass('ui-screen-hidden');
                $('#characterCountRow').addClass('ui-screen-hidden');
            }
            else
            {
                $('#experienceRow').removeClass('ui-screen-hidden');
                $('#characterCountRow').removeClass('ui-screen-hidden');

                $detailsTable.find('[data-property=experience]').text(event.experience);
                $detailsTable.find('[data-property=characterCount]').text(event.characterCount);
            }

            if (event.description)
            {
                $detailsTable.find('[data-property=description]').text(event.description);
                $detailsTable.find('#descriptionLabelRow').removeClass('ui-screen-hidden');
            }
            else
            {
                $detailsTable.find('[data-property=description]').text('');
                $detailsTable.find('#descriptionLabelRow').addClass('ui-screen-hidden');
            }
        });
    };

    function setupEditEventAutocomplete(eventTypeId)
    {
        /// <summary>
        ///     Sets up autocomplete for the edit events page for non combat, resurrect, and death events
        /// </summary>
        /// <param name="eventTypeId" type="number">The eventType Id for the event type</param>

        var eventTypeIds;

        if (eventTypeId === lifeStory.DEATH_EVENT)
        {
            eventTypeIds = [eventTypeId, lifeStory.COMBAT_EVENT];
        }
        else
        {
            eventTypeIds = [eventTypeId];
        }

        lifeStory.db.getEventTitles(eventTypeIds, function (titles)
        {
            if (eventTypeId === lifeStory.NON_COMBAT_EVENT)
            {
                $('#editEventName').autocomplete(
                {
                    source: titles[lifeStory.NON_COMBAT_EVENT]
                });
            }
            else if (eventTypeId === lifeStory.RESURRECT_EVENT)
            {
                $('#editCauseOfResurrect').autocomplete(
                {
                    source: titles[lifeStory.RESURRECT_EVENT]
                });
            }
            else if (eventTypeId === lifeStory.DEATH_EVENT)
            {
                $('#editCauseOfDeath').autocomplete(
                {
                    source: titles[lifeStory.DEATH_EVENT].concat(titles[lifeStory.COMBAT_EVENT])
                });
            }
        });
    }

    uiLibrary.populateEventEdit = function(appendToSelector, templateElementId, removeButtonSelector)
    {
        /// <summary>
        ///     Populates the event edit form with the data for the selected event
        /// </summary>

        var eventId = lifeStory.values.eventId;

        lifeStory.db.getEvent(eventId, function(event)
        {
            var $form;
            var eventTypeId = event.eventTypeId;

            if (eventTypeId !== lifeStory.COMBAT_EVENT)
            {
                setupEditEventAutocomplete(eventTypeId);
            }

            if (eventTypeId === lifeStory.COMBAT_EVENT)
            {
                uiLibrary.showCombatDetailInputs(true);

                // Need to have autocomplete setup before any of this can run
                lifeStory.db.getEventTitles([eventTypeId], function(titles)
                {
                    $('#editEnemyName').autocomplete(
                    {
                        source: titles[lifeStory.COMBAT_EVENT]
                    });

                    event.eventDetails.forEach(function(item, index)
                    {
                        var $detailInputs = $(appendToSelector);

                        $detailInputs.find('[name=enemyName]').val(item.name);
                        $detailInputs.find('[name=creatureCount]').val(item.creatureCount);

                        // Duplicate after so first event goes in the template
                        if (index + 1 < event.eventDetails.length)
                        {
                            uiLibrary.duplicateInputSet(appendToSelector, templateElementId,
                                removeButtonSelector);
                        }
                    });
                });
            }
            else if (eventTypeId === lifeStory.NON_COMBAT_EVENT)
            {
                uiLibrary.showEventDetailInputs(true);
            }
            else if (eventTypeId === lifeStory.RESURRECT_EVENT)
            {
                $('#editEventForm, #editDeathEventForm').hide();
                $form = $('#editResurrectEventForm').show();
            }
            else if (eventTypeId === lifeStory.DEATH_EVENT)
            {
                $('#editEventForm, #editResurrectEventForm').hide();
                $form = $('#editDeathEventForm').show();
            }

            if (eventTypeId === lifeStory.COMBAT_EVENT ||
                eventTypeId === lifeStory.NON_COMBAT_EVENT)
            {
                $('#editResurrectEventForm, #editDeathEventForm').hide();
                $form = $('#editEventForm').show();

                $form.find('[name=experience]').val(event.experience);
                $form.find('[name=characterCount]').val(event.characterCount);
            }

            if (eventTypeId === lifeStory.NON_COMBAT_EVENT ||
                eventTypeId === lifeStory.RESURRECT_EVENT ||
                eventTypeId === lifeStory.DEATH_EVENT)
            {
                $form.find('[name=eventName]').val(event.eventDetails[0].name);
            }

            $form.find('[name=id]').val(event.id);
            $form.find('[name=eventType]').val(eventTypeId);
            $form.find('[name=description]').val(event.description);
        });
    };

    uiLibrary.populateCharacterDetail = function()
    {
        /// <summary>
        ///     Populates the character details page with the data for the selected character
        /// </summary>

        var characterId = lifeStory.values.characterId;
        var characterName = lifeStory.values.characterName;

        $('#characterDetails h2[data-property=characterName]').text(characterName);

        lifeStory.db.getCharacter(characterId, function(character)
        {
            var $detailsTable = $('#characterDetailsTable');

            $detailsTable.find('[data-property=race]').text(character.raceName);
            $detailsTable.find('[data-property=class]').text(character.className);

            var level = lifeStory.util.getLevel(Math.floor(character.experience));
            $detailsTable.find('[data-property=level]').text(level);
            $detailsTable.find('[data-property=totalXP]').text(Math.floor(character.experience) + ' XP');
            $detailsTable.find('[data-property=nextLevel').text((level + 1));
            $detailsTable.find('[data-property=requiredXP]').text(
                lifeStory.util.experienceToNextLevel(character.experience) + ' XP');

            $detailsTable.find('[data-property=living]').text(
                character.living === lifeStory.ALIVE ? 'Alive' : 'Dead');

            if (character.details)
            {
                $detailsTable.find('[data-property=details]').text(character.details);
                $detailsTable.find('#detailsLabelRow').removeClass('ui-screen-hidden');
            }
            else
            {
                $detailsTable.find('[data-property=details]').text('');
                $detailsTable.find('#detailsLabelRow').addClass('ui-screen-hidden');
            }
        });
    };

    uiLibrary.populateCharacterEdit = function()
    {
        /// <summary>
        ///     Populates the character edit form with the data for the selected character
        /// </summary>

        lifeStory.db.getCharacter(lifeStory.values.characterId, function(character)
        {
            var $form = $('#editCharacterForm');

            $form.find('[name=id]').val(character.id);
            $form.find('[name=name]').val(character.name);
            $form.find('[name=raceId]').val(character.raceId).selectmenu('refresh');
            $form.find('[name=classId]').val(character.classId).selectmenu('refresh');
            $form.find('[name=details]').val(character.details);
        });
    };

    uiLibrary.populateCreateEventAutocomplete = function()
    {
        /// <summary>
        ///     Populates the autocomplete data for the create event form
        /// </summary>

        var eventTypeIds = [lifeStory.COMBAT_EVENT, lifeStory.NON_COMBAT_EVENT];

        lifeStory.db.getEventTitles(eventTypeIds, function(titles)
        {
            $('#enemyName').autocomplete(
            {
                source: titles[lifeStory.COMBAT_EVENT]
            });

            $('#eventName').autocomplete(
            {
                source: titles[lifeStory.NON_COMBAT_EVENT]
            });
        });
    };

    uiLibrary.populateDeathAutocomplete = function()
    {
        /// <summary>
        ///     Populates the autocomplete data for the create death event form
        /// </summary>

        lifeStory.db.getEventTitles([lifeStory.DEATH_EVENT, lifeStory.COMBAT_EVENT], function (titles)
        {
            $('#causeOfDeath').autocomplete(
            {
                source: titles[lifeStory.DEATH_EVENT].concat(titles[lifeStory.COMBAT_EVENT])
            });
        });
    };

    uiLibrary.populateResurrectAutocomplete = function()
    {
        /// <summary>
        ///     Populates the autocomplete data for the create resurrect event form
        /// </summary>

        lifeStory.db.getEventTitles([lifeStory.RESURRECT_EVENT], function(titles)
        {
            $('#causeOfResurrect').autocomplete(
            {
                source: titles[lifeStory.RESURRECT_EVENT]
            });
        });
    };

    function deleteCharacterAccepted()
    {
        /// <summary>
        ///     Callback function for a user accepting the delete character confirmation dialog
        /// </summary>

        var callbackData = new lifeStory.CallbackData();
        callbackData.successMessage = 'The character was deleted successfully.';
        callbackData.redirectToPageId = 'home';

        lifeStory.dataAccess.deleteCharacter(lifeStory.values.characterId, callbackData);
    }

    uiLibrary.confirmDeleteCharacter = function()
    {
        /// <summary>
        ///     Confirms the user wants to clear the delete the character. If so, deletes the character.
        /// </summary>

        uiLibrary.displayConfirmation('Delete ' + lifeStory.values.characterName + '?',
            'Are you sure you want to delete ' + lifeStory.values.characterName +'?',
            deleteCharacterAccepted);
    };

    function deleteEventAccepted()
    {
        /// <summary>
        ///     Callback function for a user accepting the delete event confirmation dialog
        /// </summary>

        var callbackData = new lifeStory.CallbackData();
        callbackData.successMessage = 'The event was deleted successfully.';
        callbackData.redirectToPageId = 'eventLog';

        lifeStory.dataAccess.deleteEvent(lifeStory.values.eventId, callbackData);
    }

    uiLibrary.confirmDeleteEvent = function()
    {
        /// <summary>
        ///     Confirms the user wants to delete the event. If so, deletes the event.
        /// </summary>

        uiLibrary.displayConfirmation('Delete Event?',
            'Are you sure you want to delete this event?',
            deleteEventAccepted);
    };

    uiLibrary.confirmClearCharacterData = function ()
    {
        /// <summary>
        ///     Confirms the user wants to clear the character data. If so, clears the table.
        /// </summary>

        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't used.
        lifeStory.db.getCharacterCount(function (characterCount)
        {
            uiLibrary.displayConfirmation('Delete Characters?',
                'Are you sure you want to delete all (' + characterCount + ') characters permanently?',
                lifeStory.dataAccess.clearCharacterData);
        });
    };

    uiLibrary.confirmClearDatabase = function ()
    {
        /// <summary>
        ///     Confirms the user wants to clear the database. If so, clears the database.
        /// </summary>

        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't used.
        lifeStory.db.getCharacterCount(function (count)
        {
            uiLibrary.displayConfirmation('Delete All Data?',
                'Are you sure you want to delete all data? This will delete all (' + count + ') ' +
                'characters, their events, and custom races and classes permanently.',
                lifeStory.dataAccess.clearDatabase);
        });
    };

})(window.lifeStory, jQuery);