/* NavigationHelpers.cs
 * Purpose: Methods to help reduce duplicate navigation code
 * 
 * Revision History:
 *      Drew Matheson, 2015.04.09: Created
 */ 

using OpenQA.Selenium;

namespace EndToEndTests.Helpers
{
    public static class NavigationHelpers
    {
        public static void DismissSuccessDialog(this IWebDriver driver)
        {
            driver.FindElement(By.LinkText("Continue")).Click();
        }
    }
}