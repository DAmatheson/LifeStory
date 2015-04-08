using System;
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

        public static IWebElement Empty(this IWebElement element)
        {
            element.Clear();

            return element;
        }
    }
}
