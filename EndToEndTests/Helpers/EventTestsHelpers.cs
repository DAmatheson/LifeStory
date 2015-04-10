/* EventTestsHelpers.cs
 * Purpose: Helper methods for EventTests
 * 
 * Revision History:
 *      Drew Matheson, 2015.04.09: Created
 */ 

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace EndToEndTests.Helpers
{
    public static class EventTestsHelpers
    {
        /// <summary>
        ///     Creates a combat event with the provided values
        /// </summary>
        public static void CreateCombatEvent(
            IWebDriver driver, string enemyName, string creatureCount, string xpAmount,
            string characterCount, string description)
        {
            driver.FindElement(By.Id("enemyName")).SendKeys(enemyName);
            driver.FindElement(By.Id("creatureCount")).SendKeys(creatureCount);
            driver.FindElement(By.Id("xpAmount")).SendKeys(xpAmount);
            driver.FindElement(By.Id("characterCount")).SendKeys(characterCount);
            driver.FindElement(By.Id("eventDescription")).SendKeys(description);

            driver.FindElement(
                By.CssSelector(
                    "#createEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).
                Click();

            driver.DismissSuccessDialog();
        }

        /// <summary>
        ///     Creates a NonCombat event with the provided values
        /// </summary>
        public static void CreateNonCombatEvent(
            IWebDriver driver, string eventName, string xpAmount, string characterCount, string description)
        {
            new SelectElement(driver.FindElement(By.Id("eventType"))).SelectByText("An Event");

            driver.FindElement(By.Id("eventName")).SendKeys(eventName);
            driver.FindElement(By.Id("xpAmount")).SendKeys(xpAmount);
            driver.FindElement(By.Id("characterCount")).SendKeys(characterCount);
            driver.FindElement(By.Id("eventDescription")).SendKeys(description);

            driver.FindElement(
                By.CssSelector(
                    "#createEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).
                Click();

            driver.DismissSuccessDialog();
        }

        /// <summary>
        ///     Creates a Death event with the provided values
        /// </summary>
        public static void CreateDeathEvent(IWebDriver driver, string causeOfDeath, string description = "")
        {
            driver.FindElement(By.Id("causeOfDeath")).SendKeys(causeOfDeath);
            driver.FindElement(By.Id("deathDetails")).SendKeys(description);

            driver.FindElement(
                By.CssSelector(
                    "#deathEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-f > button")).
                Click();

            driver.DismissSuccessDialog();
        }

        /// <summary>
        ///     Creates a Resurrection event with the provided values
        /// </summary>
        public static void CreateResurrectEvent(
            IWebDriver driver, string causeOfResurrect, string description = "")
        {
            driver.FindElement(By.Id("causeOfResurrect")).SendKeys(causeOfResurrect);
            driver.FindElement(By.Id("resurrectionDetails")).SendKeys(description);

            driver.FindElement(
                By.CssSelector(
                    "#resurrectEventForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-g > button")).
                Click();

            driver.DismissSuccessDialog();
        }

        /// <summary>
        ///     Clicks the first event in the event list
        /// </summary>
        public static void ClickFirstEvent(this IWebDriver driver)
        {
            driver.DelayedFindElement(
                By.CssSelector(
                    "#eventList > li.ui-btn.ui-btn-icon-right.ui-li-has-arrow.ui-li.ui-first-child.ui-last-child.ui-btn-up-c > div > div > a[href='#eventDetails']"),
                2).
                Click();
        }

        /// <summary>
        ///     Clicks the resurrect event in the event list
        /// </summary>
        public static void ClickResurrectEvent(this IWebDriver driver)
        {
            driver.DelayedFindElement(
                By.CssSelector(
                    "#eventList > li.ui-btn.ui-btn-up-g > div > div > a[href='#eventDetails']"),
                2).
                Click();
        }

        /// <summary>
        ///     Clicks the death event in the event list
        /// </summary>
        public static void ClickDeathEvent(this IWebDriver driver)
        {
            driver.DelayedFindElement(
                By.CssSelector(
                    "#eventList > li.ui-btn.ui-btn-up-f > div > div > a[href='#eventDetails']"),
                2).
                Click();
        }
    }
}