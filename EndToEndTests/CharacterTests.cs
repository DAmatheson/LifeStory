using System;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;

namespace EndToEndTests
{
    public static class WaitExtension
    {
        public static IWebElement FindElement(this IWebDriver driver, By bySelector, int timeoutInSeconds)
        {
            if (timeoutInSeconds > 0)
            {
                var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(timeoutInSeconds));


                wait.Until( drv => drv.FindElement(bySelector) );
            }

            return driver.FindElement(bySelector);
        }
    }

    [TestFixture]
    public class CharacterTests
    {
        private IWebDriver driver;
        private string baseURL;

        [TestFixtureSetUp]
        public void StartUp()
        {
            baseURL = "http://localhost:6632/";
            driver = new ChromeDriver();
        }

        [TestFixtureTearDown]
        public void ShutDown()
        {
            try
            {
                driver.Quit();
            }
            catch (Exception)
            {
                // Don't care that the chrome window wasn't closed
            }
        }

        [Test]
        public void View_EmptyDatabase_ShowsAddCharacterItem()
        {
            driver.Navigate().GoToUrl(baseURL);

            IWebElement addCharacterItem = driver.FindElement(
                By.CssSelector("#characterList>li:not(.ui-screen-hidden) a"), 2);

            Assert.That(addCharacterItem.Text, Is.EqualTo("Add a Character").IgnoreCase);
        }

        [Test]
        public void Click_NewCharacter_ShowsNewCharacterForm()
        {
            driver.Navigate().GoToUrl(baseURL);

            driver.FindElement(By.CssSelector("#home div[data-role=content]>div.right>a"), 2).Click();

            Assert.That(driver.Url, Is.StringContaining("#createCharacter"));
        }
    }
}
