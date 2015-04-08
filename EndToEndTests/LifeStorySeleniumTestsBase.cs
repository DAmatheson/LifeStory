/* LifeStorySeleniumTestsBase.cs
 * Purpose: Base class for Selenium/NUnit end to end tests for LifeStory
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.30: Created
 */ 

using System;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace EndToEndTests
{
    [TestFixture]
    public abstract class LifeStorySeleniumTestsBase
    {
        protected IWebDriver driver;
        protected const string baseURL = @"http://localhost:6632/";

        /// <summary>
        ///     Clears the database and localstorage then goes to reloadPageUrl.
        ///     By default, reloadPageUrl is baseURL.
        /// </summary>
        /// <param name="reloadPageUrl">The page to reload after deleting the database</param>
        protected void ClearData(string reloadPageUrl = baseURL)
        {
            ((IJavaScriptExecutor)driver).ExecuteScript(
                "lifeStory.db.dropAllTables(); localStorage.clear();");

            driver.Navigate().GoToUrl(reloadPageUrl);
        }

        [TestFixtureSetUp]
        public virtual void StartUp()
        {
            driver = new ChromeDriver();

            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(5));
        }

        [TestFixtureTearDown]
        public virtual void ShutDown()
        {
            try
            {
                driver.Quit();
            }
            catch (Exception)
            {
                // Don't care that the chrome window and driver weren't closed
            }
        }
    }
}
