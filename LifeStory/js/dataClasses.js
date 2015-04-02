/* dataClasses.js
 * Purpose: Data classes for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with model classes located under lifeStory
(function (lifeStory, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by dataClasses but is undefined.';
    }

    lifeStory.Race = function race(name)
    {
        /// <summary>
        ///     Model class for character races
        /// </summary>
        /// <param name="name" type="string">Name for the race</param>

        this.id = null;
        this.name = name || null;
    };

    lifeStory.CharacterClass = function characterClass(name)
    {
        /// <summary>
        ///     Model class for character classes
        /// </summary>
        /// <param name="name" type="string">Name for the class</param>

        this.id = null;
        this.name = name || null;
    };

    lifeStory.Character = function character(name, raceId, classId, details, living)
    {
        /// <summary>
        ///     Model class for characters
        /// </summary>
        /// <param name="name" type="string">Character name</param>
        /// <param name="raceId" type="number">Id of the character's race</param>
        /// <param name="classId" type="number">Id of the character's class</param>
        /// <param name="details" type="string">Details for the character</param>
        /// <param name="living" type="number">
        ///     Living status for the character
        ///     1 for alive, 0 for dead
        /// </param>

        this.id = null;
        this.raceId = parseInt(raceId, 10) || null;
        this.classId = parseInt(classId, 10) || null;
        this.name = name || null;
        this.living = parseInt(living, 10) || null;
        this.details = details || null;

        this.raceName = null;
        this.className = null;
        this.experience = null;
    };

    lifeStory.EventType = function eventType(name)
    {
        /// <summary>
        ///     Model class for event types
        /// </summary>
        /// <param name="name" type="string">Name for the event type</param>

        this.id = null;
        this.name = name || null;
    };

    lifeStory.EventDetail = function eventDetail(detailId, eventName, creatureCount, eventId)
    {
        /// <summary>
        ///     Model class for event details
        /// </summary>
        /// <param name="detailId" type="number">The sequential number for the detail</param>
        /// <param name="eventName" type="string">The name for the detail</param>
        /// <param name="creatureCount" type="number">The creature count for the detail</param>
        /// <param name="eventId" type="number">The Id of the event the detail belongs to</param>

        this.id = detailId || null;
        this.eventId = parseInt(eventId, 10) || null;
        this.name = eventName || null;
        this.creatureCount = parseInt(creatureCount, 10) || null;
    };

    lifeStory.Event = function event(eventTypeId, characterCount, experience, description, date)
    {
        /// <summary>
        ///     Model class for events
        /// </summary>
        /// <param name="eventTypeId" type="number">The Id for the event's type</param>
        /// <param name="characterCount" type="number">The number of characters present</param>
        /// <param name="experience" type="number">The amount of experience from the event</param>
        /// <param name="description" type="string">A description of the event</param>
        /// <param name="date" type="date">
        ///     The date of the event. Set by default to today's date when saving
        /// </param>

        this.id = null;
        this.eventTypeId = parseInt(eventTypeId, 10) || null;
        this.characterCount = parseInt(characterCount, 10) || null;
        this.experience = parseInt(experience, 10) || null;
        this.description = description || null;

        this.date = date || null;
        this.eventTypeName = null;
        this.eventDetails = null;
    };

    lifeStory.SelectEntry = function selectEntry(key, value)
    {
        /// <summary>
        ///     Key value pair for select list options
        /// </summary>
        /// <param name="key" type="any">The value for the option</param>
        /// <param name="value" type="any">The text for the option</param>

        this.key = key;
        this.value = value;
    };

    lifeStory.CallbackData = function callbackData(formIdToReset, redirectToPageId,
        successMessage, failureMessage)
    {
        /// <summary>
        ///     Class for additional function callback data
        /// </summary>
        /// <param name="formIdToReset" type="string">Id of the form to reset</param>
        /// <param name="redirectToPageId" type="string">Id of the page to redirect to</param>
        /// <param name="successMessage" type="string">Success message to display on success</param>
        /// <param name="failureMessage" type="string">Error message to display on errors</param>

        this.formIdToReset = formIdToReset || null;
        this.redirectToPageId = redirectToPageId || null;

        this.successMessage = successMessage || '';
        this.failureMessage = failureMessage || '';
    };

})(window.lifeStory);