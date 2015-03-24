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
        this.raceId = raceId || null;
        this.classId = classId || null;
        this.name = name || null;
        this.living = living || null;
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

    lifeStory.EventDetail = function eventDetail(detailId, eventId, eventName, creatureCount)
    {
        this.id = detailId || null;
        this.eventId = eventId || null;
        this.name = eventName || null;
        this.creatureCount = creatureCount || null;
    };

    lifeStory.Event = function event(eventTypeId, date, characterCount, experience, description)
    {
        this.id = null;
        this.eventTypeId = eventTypeId || null;
        this.characterCount = characterCount || null;
        this.date = date || null; // Note: Likely never used as it is only for sorting and that is all DB side currently
        this.experience = experience || null;
        this.description = description || null;

        this.eventTypeName = null;
        this.eventDetails = null;
    };

    lifeStory.SelectEntry = function selectEntry(key, value)
    {
        this.key = key;
        this.value = value;
    };

})(window, window.lifeStory);