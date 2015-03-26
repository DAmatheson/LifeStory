/* dataClasses.js
 * Purpose: Data classes for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Extend lifeStory with model classes located under lifeStory
(function (window, lifeStory, undefined)
{
    'use strict';

    if (lifeStory === undefined || lifeStory === null)
    {
        throw 'lifeStory is required by dataClasses but is undefined.';
    }

    lifeStory.Race = function race(name)
    {
        this.id = null;
        this.name = name || null;
    };

    lifeStory.CharacterClass = function characterClass(name)
    {
        this.id = null;
        this.name = name || null;
    };

    lifeStory.Character = function character(name, raceId, classId, details, living)
    {
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
        this.id = null;
        this.name = name || null;
    };

    lifeStory.EventDetail = function eventDetail(detailId, eventName, creatureCount, eventId)
    {
        this.id = detailId || null;
        this.eventId = parseInt(eventId, 10) || null;
        this.name = eventName || null;
        this.creatureCount = parseInt(creatureCount, 10) || null;
    };

    lifeStory.Event = function event(eventTypeId, characterCount, experience, description, date)
    {
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
        this.key = key;
        this.value = value;
    };

    lifeStory.CallbackData = function callbackData(formIdToReset, redirectToPageId,
        successMessage, failureMessage)
    {
        this.formIdToReset = formIdToReset || null;
        this.redirectToPageId = redirectToPageId || null;

        this.successMessage = successMessage || '';
        this.failureMessage = failureMessage || '';
    }

})(window, window.lifeStory);