/* CharacterTests.cs
 * Purpose: Selenium/NUnit end to end tests for LifeStory
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.30: Created
 */ 

using System;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using EndToEndTests.Helpers;

namespace EndToEndTests
{
    [TestFixture]
    public class CharacterTests
    {
        private IWebDriver driver;
        private const string baseURL = @"http://localhost:6632/";

        /// <summary>
        ///     Clears the database and localstorage then goes to reloadPageUrl.
        ///     By default, reloadPageUrl is baseURL.
        /// </summary>
        /// <param name="reloadPageUrl">The page to reload after deleting the database</param>
        private void ClearData(string reloadPageUrl = baseURL)
        {
            ((IJavaScriptExecutor) driver).ExecuteScript(
                "lifeStory.db.dropAllTables(); localStorage.clear();");

            driver.Navigate().GoToUrl(reloadPageUrl);
        }

        public void CreateCharacter(string name, string details = "")
        {
            driver.FindElement(By.CssSelector("#createCharacter #characterName")).
                SendKeys(name);
            driver.FindElement(By.CssSelector("#createCharacter #details")).SendKeys(details);
            driver.FindElement(By.CssSelector("#createCharacter button:last-of-type")).Click();

            driver.FindElement(By.CssSelector("#successDialog-popup.ui-popup-active #successBtn")).Click();
        }

        [TestFixtureSetUp]
        public void StartUp()
        {
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
                // Don't care that the chrome window and driver weren't closed
            }
        }

        [Test]
        public void View_EmptyDatabase_ShowsAddCharacterItem()
        {
            driver.Navigate().GoToUrl(baseURL);

            ClearData();

            IWebElement addCharacterItem = driver.FindElement(
                By.CssSelector("#characterList>li:not(.ui-screen-hidden) a"));

            Assert.That(addCharacterItem.Text, Is.EqualTo("Add a Character").IgnoreCase);
            Assert.That(addCharacterItem.GetAttribute("href"), Is.EqualTo(baseURL + "#createCharacter"));
        }

        [Test]
        public void Click_NewCharacter_ShowsNewCharacterForm()
        {
            driver.Navigate().GoToUrl(baseURL);

            ClearData();

            driver.FindElement(By.CssSelector("#home div.right>a[href='#createCharacter']")).Click();

            Assert.That(driver.Url, Is.StringContaining("#createCharacter"));
        }

        [Test]
        public void NewCharacterForm_ValidData_CharacterDisplayedOnHomePage()
        {
            string name = "Test Character";

            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            ClearData(baseURL + "#createCharacter");
            CreateCharacter(name);

            driver.Navigate().GoToUrl(baseURL);

            IWebElement testCharacterItem = driver.FindElement(
                By.CssSelector("#characterList>li:not(.ui-screen-hidden) a"));

            Assert.That(testCharacterItem.Text, Is.StringContaining(name).IgnoreCase);
            Assert.That(testCharacterItem.GetAttribute("href"), Is.EqualTo(baseURL + "#eventLog"));
        }

        [Test]
        public void NewCharacterForm_ValidNameCreateNewRaceCreateNewClassValidDetails_HasCorrectDetails()
        {
            driver.Navigate().GoToUrl(baseURL);

            ClearData();

            driver.FindElement(By.LinkText("Add a Character")).Click();
            driver.FindElement(By.Id("characterName")).SendKeys("TestCharacter");

            driver.FindElement(By.Id("createAddRace")).Click();
            driver.FindElement(By.Id("addRaceName")).SendKeys("ANewRace");
            driver.FindElement(By.CssSelector("#addRaceForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            driver.FindElement(By.Id("createAddClass")).Click();
            driver.FindElement(By.Id("addClassName")).SendKeys("ANewClass");
            driver.FindElement(By.CssSelector("#addClassForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            driver.FindElement(By.Id("details")).SendKeys("Details");
            driver.FindElement(By.CssSelector("button.ui-btn-hidden")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();
            driver.FindElement(By.LinkText("Details")).Click();

            IWebElement detailsTable = driver.FindElement(By.Id("characterDetailsTable"));

            Assert.That(driver.FindElement(By.CssSelector("#characterDetails h2[data-property='characterName']")).Text, Is.EqualTo("TestCharacter"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='race']")).Text, Is.EqualTo("ANewRace"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='class']")).Text, Is.EqualTo("ANewClass"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='level']")).Text, Is.EqualTo("1"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='totalXP']")).Text, Is.EqualTo("0 XP"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='requiredXP']")).Text, Is.EqualTo("300 XP"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='living']")).Text, Is.EqualTo("Alive"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='details']")).Text, Is.EqualTo("Details"));
        }

        [Test]
        public void ViewCharacterDetails_DeleteCharacter_HomePageShowsAddCharacterItem()
        {
            driver.Navigate().GoToUrl(baseURL);

            ClearData();
            driver.FindElement(By.LinkText("Add a Character")).Click();
            CreateCharacter("ToDelete");
            driver.FindElement(By.LinkText("Details")).Click();
            driver.FindElement(By.Id("deleteCharacter")).Click();
            driver.FindElement(By.Id("confirmAccept")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            IWebElement addCharacterItem = driver.FindElement(
                By.CssSelector("#characterList>li:not(.ui-screen-hidden) a"));

            Assert.That(addCharacterItem.Text, Is.EqualTo("Add a Character").IgnoreCase);
            Assert.That(addCharacterItem.GetAttribute("href"), Is.EqualTo(baseURL + "#createCharacter"));
        }

        [Test]
        public void EditCharacter_ViewDetails_DisplaysUpdatedCharacterData()
        {
            string updatedName = "UpdatedName";
            string updatedDetails = "UpdatedDetails.";

            driver.Navigate().GoToUrl(baseURL);

            ClearData();
            driver.FindElement(By.LinkText("Add a Character")).Click();
            CreateCharacter("ToDelete");
            driver.FindElement(By.LinkText("Details")).Click();

            driver.FindElement(By.CssSelector("a[href='#editCharacter']")).Click();
            driver.FindElement(By.Id("editCharacterName")).Empty().SendKeys(updatedName);
            (new SelectElement(driver.FindElement(By.Id("editCharacterRaceSelect")))).SelectByText("Elf");
            (new SelectElement(driver.FindElement(By.Id("editCharacterClassSelect")))).SelectByText("Druid");
            driver.FindElement(By.Id("editDetails")).Empty().SendKeys(updatedDetails);
            driver.FindElement(By.CssSelector("#editCharacterForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();

            driver.FindElement(By.LinkText("Continue")).Click();

            driver.FindElement(By.LinkText("Details")).Click();

            IWebElement detailsTable = driver.FindElement(By.Id("characterDetailsTable"));

            Assert.That(driver.FindElement(By.CssSelector("#characterDetails h2[data-property='characterName']")).Text, Is.EqualTo(updatedName));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='race']")).Text, Is.EqualTo("Elf"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='class']")).Text, Is.EqualTo("Druid"));
            Assert.That(detailsTable.FindElement(By.CssSelector("td[data-property='details']")).Text, Is.EqualTo(updatedDetails));
        }
    }
}