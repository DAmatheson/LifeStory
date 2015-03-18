/* dataClasses.js
 * Purpose: Data classes for LifeStory
 *
 * Revision History: 
 *      Drew Matheson, 2015.03.05: Created
 */

// Data classes for LifeStory
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
        this.name = name;
    }

    lifeStory.CharacterClass = function characterClass(name)
    {
        this.id = null;
        this.name = name;
    }

    lifeStory.Character = function character(name, raceId, classId, details, living)
    {
        this.id = null;
        this.raceId = raceId;
        this.classId = classId;
        this.name = name;
        this.living = living;
        this.details = details;
    }

    lifeStory.EventType = function eventType(name)
    {
        this.id = null;
        this.name = name;
    }

    lifeStory.EventDetail = function eventDetail(detailId, eventId, eventName, creatureCount)
    {
        this.id = detailId;
        this.eventId = eventId;
        this.name = eventName;
        this.creatureCount = creatureCount;
    }

    lifeStory.Event = function event(eventTypeId, date, characterCount, experience, description)
    {
        this.id = null;
        this.eventTypeId = eventTypeId;
        this.characterCount = characterCount;
        this.date = date;
        this.experience = experience;
        this.description = description;
    }

    lifeStory.SelectEntry = function selectEntry(key, value)
    {
        this.key = key;
        this.value = value;
    }

})(window, lifeStory);