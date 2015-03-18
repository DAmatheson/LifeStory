/* init.js
 * Purpose: Initialization scripts for LifeStory
 *
 * Revision History:
 *      Isaac West, 2015.03.05: Created
 */

// TODO: Only here to prevent query strings in the URL while form handling isn't set up
$(function()
{
    $('form').on('submit', function(event)
    {
        event.preventDefault();
    });
});

$('#home').one('pageinit', function homePageInit()
{
    // Initialization stuff for the home page
    lifeStory.db.getDb(); // TODO: Just for testing that the db initialization works
});

$('#createCharacter').one('pageinit', function createCharacterPageInit()
{
    lifeStory.ui.populateRaceAndClassList('raceSelect', 'classSelect');
    lifeStory.util.createCharacterValidate();
});

$('#customize').one('pageinit', function customizePageInit()
{
    lifeStory.ui.populateRaceAndClassList('deleteRaceSelect', 'deleteClassSelect');
});

$('#editCharacter').one('pageinit', function customizePageInit() {
    lifeStory.ui.populateRaceAndClassList('editCharacterRaceSelect', 'editCharacterClassSelect');
});

$('#createEvent').one('pageinit', function createEventPageInit()
{
    $('#removeEnemy').closest('.ui-btn').hide();
});

$('#editEvent').one('pageinit', function createEventPageInit()
{
    $('#editRemoveEnemy').closest('.ui-btn').hide();
});

$('#createCharacterForm').on('submit', function () {
    if ($(this).valid())
    {
        var newCharacter = new lifeStory.Character(
            $('#characterName').val(),
            $('#raceSelect').val(),
            $('#classSelect').val(),
            $('#details').val(),
            true);

        lifeStory.db.insertCharacter(
            newCharacter,
            function ()
            {
                // TODO: show character's event log
            },
            null);
    }
});

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

$('#editAddEnemy').on('tap', function ()
{
    var appendToSelector = '#editCombatDetailInputs fieldset:last';
    var templateElementId = 'editEnemyInputsTemplate';
    var removeButtonSelector = '#editRemoveEnemy';

    lifeStory.ui.duplicateInputSet(appendToSelector, templateElementId, removeButtonSelector);
});

$('#editRemoveEnemy').on('tap', function()
{
    var removeButtonSelector = '#editRemoveEnemy';
    var removeElementSelector = '#editCombatDetailInputs fieldset:last:not(#editEnemyInputsTemplate)';

    lifeStory.ui.removeInputSet(removeElementSelector, removeButtonSelector);
});

$('#clearCharacters').on('tap', function ()
{
    // TODO: Use a better looking confirmation, consider http://jsfiddle.net/taditdash/vvjj8/
    if (confirm('Are you sure you want to delete all characters? This cannot be undone.'))
    {
        lifeStory.db.clearCharacterTable();
    }
});

$('#resetDatabase').on('tap', function () {
    // TODO: Use a better looking confirmation
    if (confirm('Are you sure you want to reset the database? This will delete all characters, events, custom races, and custom classes. This cannot be undone.')) {
        lifeStory.db.resetDatabase();
    }
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