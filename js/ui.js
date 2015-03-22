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

    // Displays a confirmation dialog and returns the users choice
    uiLibrary.displayConfirmation = function (title, message, acceptCallback, denyCallback)
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

        $('#confirmTitle').html(title);
        $('#confirmMessage').html(message);
        $('#confirmDialog').popup('open');

        if (acceptCallback)
        {
            $('#confirmAccept').one('tap', function ()
            {
                acceptCallback();
                $('#confirmDeny').off('tap');
            });
        }
        
        if (denyCallback)
        {
            $('#confirmDeny').one('tap', function ()
            {
                denyCallback();
                $('#confirmAccept').off('tap');
            });
        }
    }

    uiLibrary.displaySuccessMessage = function(message)
    {
        /// <summary>
        ///     Displays the passed in success message to the user
        /// </summary>
        /// <param name="message" type="string">Success message to display</param>

        $('#successMessage').html(message);
        $('#successDialog').popup('open');
    }

    uiLibrary.displayErrorMessage = function(message)
    {
        /// <summary>
        ///     Displays the passed in error message to the user
        /// </summary>
        /// <param name="message" type="string">Error message to display</param>

        $('#errorMessage').html(message);
        $('#errorDialog').popup('open');
    }

    // Filters the character list to remove deceased characters if the source checkbox is unchecked
    uiLibrary.filterCharacterList = function()
    {
        var hideDead = !this.checked; // We show when checked, so flip the value

        // Add class if hideDead is true, otherwise remove it
        $('#characterList li[data-theme=f]').toggleClass('ui-screen-hidden', hideDead);

    };

    uiLibrary.refreshDeleteRaceUIState = function ()
    {
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

    // Populate the select element matching selectElementId with key and values from data
    uiLibrary.populateSelectList = function (selectElementId, data)
    {
        if (!Array.isArray(data))
        {
            throw 'The data argument for populateSelectList must be an array';
        }
        else if (data.length > 0 && !(data[0] instanceof lifeStory.SelectEntry))
        {
            throw 'The entries in the data argument for populateSelectList must be instances ' +
                'of lifeStory.SelectEntry';
        }

        var text = '';

        for (var i = 0; i < data.length; i++)
        {
            text += '<option value="' + data[i].key + '">' + data[i].value + '</option>';
        }

        if (data.length === 0)
        {
            text = '<option disabled>-- No Races Created --</option>';
        }

        $('#' + selectElementId).
            children().remove().end(). // Remove placeholder option which prevents an error in jQM 1.1.2
            append(text).
            selectmenu('refresh');
    };

    uiLibrary.populateClassList = function(classListId, populationCompleteCallback)
    {
        lifeStory.db.getClasses(function(selectEntries)
        {
            uiLibrary.populateSelectList(classListId, selectEntries);

            if (typeof populationCompleteCallback === 'function')
            {
                populationCompleteCallback();
            }
        });
    };

    uiLibrary.populateRaceList = function(raceListId, populationCompleteCallback)
    {
        lifeStory.db.getRaces(function(selectEntries)
        {
            uiLibrary.populateSelectList(raceListId, selectEntries);

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
        /// <param name="raceListId" type="">Id of the race list to populate</param>
        /// <param name="classListId" type="">Id of the class list to populate</param>
        /// <param name="refreshDeleteUI" type="boolean">
        ///     True if the delete UI on customize page should be refreshed
        /// </param>

        uiLibrary.populateRaceList(raceListId,
            refreshDeleteUI ? uiLibrary.refreshDeleteRaceUIState : undefined);

        uiLibrary.populateClassList(classListId,
            refreshDeleteUI ? uiLibrary.refreshDeleteClassUIState : undefined);
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

    function characterLinkClicked(event)
    {
        lifeStory.values.characterId = event.data.id;
        lifeStory.values.characterName = event.data.name;
        lifeStory.values.characterAlive = event.data.alive;
    }

    uiLibrary.populateCharacterList = function(listViewId, itemElementType)
    {
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
                    $currentItem.attr('data-theme', 'f').removeClass('ui-btn-up-c').addClass('ui-btn-up-f');
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
        });
    };

    uiLibrary.populateEventLog = function (listViewId, itemElementType)
    {
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

                if (event.description) // TODO: Figure out title if a description doesn't exist
                {
                    title = event.description;
                }
                else
                {
                    title = event.eventTypeName;
                }

                $('[data-property=title]', $currentItem).text(title);
                $('[data-property=experience]', $currentItem).text(event.experience + ' XP');

                if (event.id === lifeStory.DEATH_EVENT)
                {
                    $currentItem.data('theme', 'f');
                }
                else if (event.id === lifeStory.RESURRECT_EVENT)
                {
                    $currentItem.data('theme', 'g');
                }

                $('a', $currentItem).on('tap', { eventId: event.id }, function (e)
                {
                    lifeStory.values.eventId = e.eventId;
                });

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

    uiLibrary.populateCharacterDetail = function()
    {
        var characterId = lifeStory.values.characterId;
        var characterName = lifeStory.values.characterName;

        $('#characterDetails h2[data-property=characterName]').text(characterName);

        lifeStory.db.getCharacter(characterId, function(character)
        {
            var $detailsTable = $('#characterDetailsTable');

            $detailsTable.find('[data-property=race]').text(character.raceName);
            $detailsTable.find('[data-property=class]').text(character.className);
            $detailsTable.find('[data-property=living]').text(
                character.living === lifeStory.ALIVE ? 'Alive' : 'Dead');

            $detailsTable.find('[data-property=level]').text(Math.floor(character.experience) || 0); // TODO: Calculate level based on experience instead

            if (character.details)
            {
                $detailsTable.find('[data-property=details]').text(character.details).
                    parent().prev().removeClass('ui-screen-hidden');
            }
            else
            {
                $detailsTable.find('[data-property=details]').text('').
                    parent().prev().addClass('ui-screen-hidden');
            }
        });
    };

    // Confirms the user wants to clear the character table. If so, clears the table.
    uiLibrary.confirmClearCharactersTable = function ()
    {
        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't use.
        lifeStory.db.getCharacterCount(function (characterCount)
        {
            uiLibrary.displayConfirmation('Clear Characters?',
                'Are you sure you want to delete all (' + characterCount + ') characters permanently? ' +
                '<strong>This cannot be undone.</strong>', lifeStory.db.clearCharacterTable);
        });
    };

    // Confirms the user wants to clear the database. If so, clears the database.
    uiLibrary.confirmClearDatabase = function ()
    {
        // This must be done this way because the confirm dialog will be shown before a value
        // is returned from getCharacterCount if a callback isn't use.
        lifeStory.db.getCharacterCount(function (count)
        {
            uiLibrary.displayConfirmation('Delete All Data?',
                'Are you sure you want to delete all data? This will delete all (' + count + ') ' +
                'characters, their events, and custom races and classes permanently. ' +
                '<strong>This cannot be undone.</strong>', lifeStory.db.dropAllTables);
        });
    };

})(window, window.lifeStory, jQuery);