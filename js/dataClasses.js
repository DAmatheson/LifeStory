/* database.js
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

    // TODO: Remove id or figure out what to do with it on all classes
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
        this.name = name;
        this.raceId = raceId;
        this.classId = classId;
        this.details = details;
        this.living = living;
    }

    lifeStory.EventName = function eventName(name)
    {
        this.id = null;
        this.name = name;
    }

    lifeStory.Event = function event(eventNameId, experience, numOfCreatures)
    {
        this.id = null;
        this.eventNameId = eventNameId;
        this.experience = experience;
        this.numberOfCreatures = numOfCreatures;
    }

    lifeStory.EventDetail = function eventDetail(eventId, date, numOfCharacters, description)
    {
        this.id = null;
        this.eventId = eventId;
        this.date = date;
        this.numberOfCharacters = numOfCharacters;
        this.description = description;
    }

    lifeStory.SelectEntry = function selectEntry(key, value)
    {
        this.key = key;
        this.value = value;
    }

})(window, lifeStory);