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

            driver.Manage().Timeouts().ImplicitlyWait(TimeSpan.FromSeconds(5));
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

        [TearDown]
        public void TearDown()
        {
            ((IJavaScriptExecutor) driver).ExecuteScript("lifeStory.db.dropAllTables(); localStorage.clear();");
        }

        [Test]
        public void View_EmptyDatabase_ShowsAddCharacterItem()
        {
            driver.Navigate().GoToUrl(baseURL);

            IWebElement addCharacterItem = driver.FindElement(
                By.CssSelector("#characterList>li:not(.ui-screen-hidden) a"));

            Assert.That(addCharacterItem.Text, Is.EqualTo("Add a Character").IgnoreCase);
            Assert.That(addCharacterItem.GetAttribute("href"), Is.EqualTo(baseURL + "#createCharacter"));
        }

        [Test]
        public void Click_NewCharacter_ShowsNewCharacterForm()
        {
            driver.Navigate().GoToUrl(baseURL);

            driver.FindElement(By.CssSelector("#home div.right>a[href='#createCharacter'")).Click();

            Assert.That(driver.Url, Is.StringContaining("#createCharacter"));
        }

        [Test]
        public void NewCharacterForm_ValidData_CharacterDisplayedOnHomePage()
        {
            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            driver.FindElement(By.CssSelector("#createCharacter #characterName")).SendKeys("Test Character");
            driver.FindElement(By.CssSelector("#createCharacter #details")).SendKeys("Test Details.");
            driver.FindElement(By.CssSelector("#createCharacter button:last-of-type")).Click();

            driver.FindElement(By.CssSelector("#successDialog-popup.ui-popup-active #successBtn")).Click();

            driver.Navigate().GoToUrl(baseURL);

            IWebElement testCharacterItem = driver.FindElement(
                By.CssSelector("#characterList>li:not(.ui-screen-hidden) a"));

            Assert.That(testCharacterItem.Text, Is.StringContaining("Test Character").IgnoreCase);
            Assert.That(testCharacterItem.GetAttribute("href"), Is.EqualTo(baseURL + "#eventLog"));
        }
    }
}
