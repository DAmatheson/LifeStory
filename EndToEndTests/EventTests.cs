/* EventTests.cs
 * Purpose: Selenium/NUnit end to end tests for LifeStory's Event CRUD pages
 * 
 * Revision History:
 *      Drew Matheson, 2015.04.08: Created
 */

using System;
using System.Threading;
using EndToEndTests.Helpers;
using NUnit.Framework;
using OpenQA.Selenium;

namespace EndToEndTests
{
    [TestFixture]
    public class EventTests : LifeStorySeleniumTestsBase
    {
        private IWebElement GetEventDetailsTable()
        {
            return driver.FindElement(By.Id("eventDetailsTable"));
        }

        private void AssertEventDetailNameValue(IWebElement detailsTable, string nameValue)
        {
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='names']")).Text, Is.StringContaining(nameValue));
        }

        private IWebElement AssertCorrectEventDetails(string xpAmount,
            string characterCount, string description)
        {
            IWebElement detailsTable = GetEventDetailsTable();

            Assert.That(detailsTable.FindElement(By.CssSelector("span[data-property='experience']")).Text, Is.EqualTo(xpAmount));
            Assert.That(detailsTable.FindElement(By.CssSelector("span[data-property='characterCount']")).Text, Is.EqualTo(characterCount));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='description']")).Text, Is.EqualTo(description));

            return detailsTable;
        }

        private IWebElement AssertCorrectCombatEventDetails(string enemyName, string creatureCount, string xpAmount,
            string characterCount, string description)
        {
            IWebElement detailsTable = AssertCorrectEventDetails(xpAmount, characterCount, description);

            AssertEventDetailNameValue(detailsTable, enemyName);
            AssertEventDetailNameValue(detailsTable, creatureCount);

            return detailsTable;
        }

        [SetUp]
        public void SetUp()
        {
            driver.Navigate().GoToUrl(baseURL);
            ClearData();

            driver.CreateCharacter(baseURL);

            driver.Navigate().GoToUrl(baseURL + "#createEvent");
        }

        [Test]
        public void CreateCombatEvent_ValidValues_HasCorrectDetails()
        {
            string enemyName = "Hogger";
            string creatureCount = "3";
            string xpAmount = "100";
            string characterCount = "2";
            string description = "We beat hogger after almost dying.";

            EventTestsHelpers.CreateCombatEvent(driver, enemyName, creatureCount, xpAmount, characterCount, description);

            driver.ClickFirstEvent();

            AssertCorrectCombatEventDetails(enemyName, creatureCount, xpAmount, characterCount, description);
        }

        [Test]
        public void CreateCombatEvent_MultipleEnemies_HasCorrectDetails()
        {
            string enemyName = "Hogger";
            string enemyName2 = "Kobold";
            string creatureCount = "1";
            string creatureCount2 = "2";
            string xpAmount = "150";
            string characterCount = "4";
            string description = "We won.";

            driver.FindElement(By.Id("addEnemy")).Click();

            driver.FindElement(By.Id("enemyName")).SendKeys(enemyName);
            driver.FindElement(By.Id("creatureCount")).SendKeys(creatureCount);
            driver.FindElement(By.CssSelector("#createEventForm fieldset:last-of-type input[name='enemyName']")).SendKeys(enemyName2);
            driver.FindElement(By.CssSelector("#createEventForm fieldset:last-of-type input[name='creatureCount']")).SendKeys(creatureCount2);

            driver.FindElement(By.Id("xpAmount")).SendKeys(xpAmount);
            driver.FindElement(By.Id("characterCount")).SendKeys(characterCount);
            driver.FindElement(By.Id("eventDescription")).SendKeys(description);

            driver.FindElement(
                By.CssSelector(
                    "#createEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).
                Click();

            driver.DismissSuccessDialog();

            driver.ClickFirstEvent();

            IWebElement detailsTable = AssertCorrectCombatEventDetails(enemyName, creatureCount, xpAmount, characterCount, description);
            AssertEventDetailNameValue(detailsTable, enemyName2);
            AssertEventDetailNameValue(detailsTable, creatureCount2);
        }

        [Test]
        public void EditCombatEvent_ValidValues_HasUpdatedDetails()
        {
            string updatedEnemyName = "NewName";
            string updatedCreatureCount = "4";
            string updatedXpAmount = "123";
            string updatedCharacterCount = "5";
            string updatedDescription = "Updated Description.";

            EventTestsHelpers.CreateCombatEvent(driver, "enemy", "1", "100", "1", "no description");

            driver.ClickFirstEvent();

            driver.FindElement(By.Id("editEventButton")).Click();

            Thread.Sleep(50); // Give time for the form to be populated

            driver.FindElement(By.Id("editEnemyName")).Empty().SendKeys(updatedEnemyName);
            driver.FindElement(By.Id("editEnemyCount")).Empty().SendKeys(updatedCreatureCount);
            driver.FindElement(By.Id("editXPAmount")).Empty().SendKeys(updatedXpAmount);
            driver.FindElement(By.Id("editNumberOfPCs")).Empty().SendKeys(updatedCharacterCount);
            driver.FindElement(By.Id("editEventDetails")).Empty().SendKeys(updatedDescription);

            driver.FindElement(By.CssSelector("#editEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();

            driver.DismissSuccessDialog();

            driver.ClickFirstEvent();

            AssertCorrectCombatEventDetails(updatedEnemyName, updatedCreatureCount, updatedXpAmount, updatedCharacterCount, updatedDescription);
        }

        [Test]
        public void CreateNonCombatEvent_ValidValues_HasCorrectDetails()
        {
            string eventName = "The Sunken Temple";
            string xpAmount = "150";
            string characterCount = "4";
            string description = "We won.";

            EventTestsHelpers.CreateNonCombatEvent(driver, eventName, xpAmount, characterCount, description);

            driver.ClickFirstEvent();

            IWebElement detailsTable = AssertCorrectEventDetails(xpAmount, characterCount, description);
            AssertEventDetailNameValue(detailsTable, eventName);
        }

        [Test]
        public void EditNonCombatEvent_ValidValues_HasUpdatedDetails()
        {
            string updatedEventName = "The Sunken Temple";
            string updatedXpAmount = "150";
            string updatedCharacterCount = "4";
            string updatedDescription = "We won.";

            EventTestsHelpers.CreateNonCombatEvent(driver, "New Event", "10", "1", "no description");

            driver.ClickFirstEvent();

            driver.FindElement(By.Id("editEventButton")).Click();

            Thread.Sleep(50); // Give time for the form to be populated

            driver.FindElement(By.Id("editEventName")).Empty().SendKeys(updatedEventName);
            driver.FindElement(By.Id("editXPAmount")).Empty().SendKeys(updatedXpAmount);
            driver.FindElement(By.Id("editNumberOfPCs")).Empty().SendKeys(updatedCharacterCount);
            driver.FindElement(By.Id("editEventDetails")).Empty().SendKeys(updatedDescription);

            driver.FindElement(By.CssSelector("#editEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();

            driver.DismissSuccessDialog();

            driver.ClickFirstEvent();

            IWebElement detailsTable = AssertCorrectEventDetails(updatedXpAmount, updatedCharacterCount, updatedDescription);
            AssertEventDetailNameValue(detailsTable, updatedEventName);
        }

        [Test]
        public void CreateDeathEvent_ValidValues_UpdatesCharactersAliveStatus()
        {
            driver.Navigate().GoToUrl(baseURL + "#eventLog");
            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, "Hogger", "We died to hogger.");

            driver.FindElement(By.CssSelector("#eventLog > footer > fieldset > div.ui-block-b > a")).Click();

            Assert.That(driver.FindElement(By.CssSelector("td[data-property='living']")).Text, Is.EqualTo("Dead"));
        }

        [Test]
        public void CreateDeathEvent_ValidValues_HasCorrectDetails()
        {
            string causeOfDeath = "Hogger";
            string details = "I couldn't defeat hogger.";

            driver.Navigate().GoToUrl(baseURL + "#eventLog");
            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, causeOfDeath, details);

            driver.ClickDeathEvent();

            IWebElement detailsTable = GetEventDetailsTable();
            AssertEventDetailNameValue(detailsTable, causeOfDeath);
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='description']")).Text, Is.EqualTo(details));
        }

        [Test]
        public void EditDeathEvent_ValidValues_HasUpdatedDetails()
        {
            string updatedCauseOfDeath = "Kel'Thuzad";
            string updatedDetails = "We didn't stand a chance.";

            driver.Navigate().GoToUrl(baseURL + "#eventLog");
            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, "died", "generic");
            driver.ClickDeathEvent();
            driver.FindElement(By.Id("editEventButton")).Click();

            Thread.Sleep(50); // Give time for the form to be populated

            driver.FindElement(By.Id("editCauseOfDeath")).Empty().SendKeys(updatedCauseOfDeath);
            driver.FindElement(By.Id("editDeathDetails")).Empty().SendKeys(updatedDetails);
            driver.FindElement(By.CssSelector("#editDeathEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-f > button")).Click();
            driver.DismissSuccessDialog();
            driver.ClickDeathEvent();

            IWebElement detailsTable = GetEventDetailsTable();
            AssertEventDetailNameValue(detailsTable, updatedCauseOfDeath);
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='description']")).Text, Is.EqualTo(updatedDetails));
        }

        [Test]
        public void CreateResurrectEvent_ValidValues_UpdatesCharacterAliveStatus()
        {
            driver.Navigate().GoToUrl(baseURL + "#eventLog");

            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, "causeOfDeath");

            driver.FindElement(By.Id("resurrectButton")).Click();
            EventTestsHelpers.CreateResurrectEvent(driver, "Potion of Life", "Glad I found this");

            driver.FindElement(By.CssSelector("#eventLog > footer > fieldset > div.ui-block-b > a")).Click();

            Assert.That(driver.FindElement(By.CssSelector("td[data-property='living']")).Text, Is.EqualTo("Alive"));
        }

        [Test]
        public void CreateResurrectEvent_ValidValues_HasCorrectDetails()
        {
            string causeOfResurrection = "Potion of Life";
            string details = "Glad I kept this around.";

            driver.Navigate().GoToUrl(baseURL + "#eventLog");

            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, "causeOfDeath");

            driver.FindElement(By.Id("resurrectButton")).Click();
            EventTestsHelpers.CreateResurrectEvent(driver, causeOfResurrection, details);

            driver.ClickResurrectEvent();

            IWebElement detailsTable = GetEventDetailsTable();
            AssertEventDetailNameValue(detailsTable, causeOfResurrection);
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='description']")).Text, Is.EqualTo(details));
        }

        [Test]
        public void EditResurrectEvent_ValidValues_HasUpdatedDetails()
        {
            string updatedCauseOfResurrection = "A priest.";
            string updatedDetails = "His name was Anduin.";

            driver.Navigate().GoToUrl(baseURL + "#eventLog");

            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, "causeOfDeath");

            driver.FindElement(By.Id("resurrectButton")).Click();
            EventTestsHelpers.CreateResurrectEvent(driver, "Potion of Life", "It tasted good.");
            driver.ClickResurrectEvent();
            driver.FindElement(By.Id("editEventButton")).Click();

            Thread.Sleep(50); // Give time for the form to be populated

            driver.FindElement(By.Id("editCauseOfResurrect")).Empty().SendKeys(updatedCauseOfResurrection);
            driver.FindElement(By.Id("editResurrectionDetails")).Empty().SendKeys(updatedDetails);
            driver.FindElement(By.CssSelector("#editResurrectEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-g > button")).Click();
            driver.DismissSuccessDialog();
            driver.ClickResurrectEvent();
            
            IWebElement detailsTable = GetEventDetailsTable();
            AssertEventDetailNameValue(detailsTable, updatedCauseOfResurrection);
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='description']")).Text, Is.EqualTo(updatedDetails));
        }

        [Test]
        public void DeleteEvent_EventNoLongerInList()
        {
            driver.Navigate().GoToUrl(baseURL + "#eventLog");
            driver.FindElement(By.Id("diedButton")).Click();
            EventTestsHelpers.CreateDeathEvent(driver, "DeleteTest");
            driver.ClickDeathEvent();
            driver.FindElement(By.Id("deleteEvent")).Click();
            driver.FindElement(By.CssSelector("#confirmDialog-popup.ui-popup-active #confirmAccept")).Click();
            driver.DismissSuccessDialog();

            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(2));

            Assert.That(driver.FindElements(By.CssSelector("#eventList > li.ui-btn-up-f")), Is.Empty);

            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(DEFAULT_WAIT_TIME));
        }
    }
}
