using System;
using System.Threading;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace EndToEndTests.Helpers
{
    // ReSharper disable once InconsistentNaming
    public static class IWebElementExtensionMethods
    {
        public static IWebElement FindElement(this IWebDriver driver, By bySelector, int timeoutInSeconds)
        {
            if (timeoutInSeconds > 0)
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutInSeconds));

                wait.Until(drv => drv.FindElement(bySelector));
            }

            return driver.FindElement(bySelector);
        }

        /// <summary>
        ///     Clears out the element and returns it. <br/>
        ///     Adds a slight delay so that the command can be sent and executed before
        ///     the element is returned
        /// </summary>
        /// <param name="element">The element to clear input values from</param>
        /// <returns>element</returns>
        public static IWebElement Empty(this IWebElement element)
        {
            element.Clear();

            Thread.Sleep(5);

            return element;
        }
    }
}
