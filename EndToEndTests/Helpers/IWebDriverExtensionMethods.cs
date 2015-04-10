using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace EndToEndTests.Helpers
{
    public static class IWebDriverExtensionMethods {
        /// <summary>
        ///     Finds an element after a delay
        /// </summary>
        /// <param name="bySelector">The selector to find the element with</param>
        /// <param name="timeoutInSeconds">Length of the delay in seconds</param>
        /// <returns>The found element</returns>
        public static IWebElement DelayedFindElement(this IWebDriver driver, By bySelector, int timeoutInSeconds)
        {
            if (timeoutInSeconds > 0)
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutInSeconds));

                wait.Until(drv => drv.FindElement(bySelector));
            }

            return driver.FindElement(bySelector);
        }

        /// <summary>
        ///     Creates a character
        /// </summary>
        public static void CreateCharacter(this IWebDriver driver, string baseURL)
        {
            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            driver.FindElement(By.CssSelector("#createCharacter #characterName")).SendKeys("Test");

            // Ensure the class and race selects have been populated before clicking save
            new SelectElement(driver.FindElement(By.Id("raceSelect"))).SelectByText("Dwarf");

            driver.FindElement(By.CssSelector("#createCharacter button:last-of-type")).Click();

            driver.FindElement(By.CssSelector("#successDialog-popup.ui-popup-active #successBtn")).Click();
        }
    }
}