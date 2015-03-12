/* init.js
 * Purpose: Initialization scripts for LifeStory
 *
 * Revision History:
 *      Isaac West, 2015.03.05: Created
 */

$('section#home').one('pageinit', function homePageInit()
{
    // Initialization stuff for the home page
    lifeStory.db.getDb(); // TODO: Just for testing that the db initialization works
});

$('section#characterCreation').one('pageinit', function characterCreationPageInit()
{
    lifeStory.ui.populateRaceAndClassList('raceSelect', 'classSelect');
});

$('section#customize').one('pageinit', function customizePageInit()
{
    lifeStory.ui.populateRaceAndClassList('deleteRaceSelect', 'deleteClassSelect');
});

$('select#xpSource').on('change', function ()
{
    var value = $('#xpSource option:selected').val();
    if (value === 'combat') {
        $('div#eventDetailInputs').hide();
        $('div#combatDetailInputs').show();
    }
    else {
        $('div#combatDetailInputs').hide();
        $('div#eventDetailInputs').show();
    }
});

$('button#addEnemy').on('tap', function (event)
{
    event.preventDefault();
    $('div#additionalEnemyInputs').append(
        $('div#firstEnemyInputs').html());
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