/* init.js
 * Purpose: Initialization scripts for LifeStory
 *
 * Revision History:
 *      Isaac West, 2015.03.05: Created
 */

$(function()
{
    $('#clearCharacters').on('tap', lifeStory.ui.confirmClearCharactersTable);
    $('#resetDatabase').on('tap', lifeStory.ui.confirmClearDatabase);

    // TODO: Only here to prevent query strings in the URL while form handling isn't set up
    $('form').on('submit', function(event)
    {
        event.preventDefault();
    });
});

// Initialization stuff for the home page
$('#home').one('pageinit', function homePageInit()
{
    $('#showDeceased').change(lifeStory.ui.filterCharacterList);
});

$('#createCharacter').one('pageinit', function createCharacterPageInit()
{
    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('raceSelect', 'classSelect');
    });
    
    lifeStory.validation.handleCharacterForm('createCharacterForm', true);
});

$('#customize').one('pageinit', function customizePageInit()
{
    lifeStory.validation.handleRaceForm('createRaceForm');
    lifeStory.validation.handleClassForm('createClassForm');

    $(this).on('pagebeforeshow', function()
    {
        lifeStory.ui.populateRaceAndClassList('deleteRaceSelect', 'deleteClassSelect');
    });
});

$('#addClass').one('pageinit', function addClassPageInit()
{
    lifeStory.validation.handleClassForm('addClassForm', 'createCharacter');
});

$('#addRace').one('pageinit', function addRacePageInit()
{
    lifeStory.validation.handleRaceForm('addRaceForm', 'createCharacter');
});

$('#editCharacter').one('pageinit', function customizePageInit() {
    lifeStory.ui.populateRaceAndClassList('editCharacterRaceSelect', 'editCharacterClassSelect');
    lifeStory.validation.handleCharacterForm('editCharacterForm');
});

$('#createEvent').one('pageinit', function createEventPageInit()
{
    $('#eventType').on('change', function ()
    {
        if ($('#eventType option:selected').val() === 'combat')
        {
            $('#eventDetailInputs').hide();
            $('#combatDetailInputs').show();
        }
        else
        {
            $('#combatDetailInputs').hide();
            $('#eventDetailInputs').show();
        }
    });

    $('#removeEnemy').closest('.ui-btn').hide();

    $('#addEnemy').on('tap', function ()
    {
        var appendToSelector = '#combatDetailInputs fieldset:last';
        var templateElementId = 'enemyInputsTemplate';
        var removeButtonSelector = '#removeEnemy';

        lifeStory.ui.duplicateInputSet(appendToSelector, templateElementId, removeButtonSelector);
    });

    $('#removeEnemy').on('tap', function ()
    {
        var removeButtonSelector = '#removeEnemy';
        var removeElementSelector = '#combatDetailInputs fieldset:last:not(#enemyInputsTemplate)';

        lifeStory.ui.removeInputSet(removeElementSelector, removeButtonSelector);
    });
});

$('#editEvent').one('pageinit', function createEventPageInit()
{
    $('#editRemoveEnemy').closest('.ui-btn').hide();

    $('#editAddEnemy').on('tap', function ()
    {
        var appendToSelector = '#editCombatDetailInputs fieldset:last';
        var templateElementId = 'editEnemyInputsTemplate';
        var removeButtonSelector = '#editRemoveEnemy';

        lifeStory.ui.duplicateInputSet(appendToSelector, templateElementId, removeButtonSelector);
    });

    $('#editRemoveEnemy').on('tap', function ()
    {
        var removeButtonSelector = '#editRemoveEnemy';
        var removeElementSelector = '#editCombatDetailInputs fieldset:last:not(#editEnemyInputsTemplate)';

        lifeStory.ui.removeInputSet(removeElementSelector, removeButtonSelector);
    });
});


// Setup lifeStory for later use to minimize global variables and encapsulate functions and variables
// Take undefined as parameter and don't pass anything to get an unchanged version of undefined.
(function (window, undefined)
{
    'use strict';

    var lifeStory = {};

    // Makes lifeStory available to the global object
    window.lifeStory = lifeStory;

})(window);