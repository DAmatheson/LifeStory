/* RaceTests.cs
 * Purpose: Selenium/NUnit end to end tests for LifeStory's Race CRUD pages
 * 
 * Revision History:
 *      Drew Matheson, 2015.03.30: Created
 */ 

using System.Linq;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace EndToEndTests
{
    [TestFixture]
    internal class RaceTests : LifeStorySeleniumTestsBase
    {
        private void CreateCharacter()
        {
            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            driver.FindElement(By.CssSelector("#createCharacter #characterName")).SendKeys("Test");
            driver.FindElement(By.CssSelector("#createCharacter button:last-of-type")).Click();

            driver.FindElement(By.CssSelector("#successDialog-popup.ui-popup-active #successBtn")).Click();
        }

        [SetUp]
        public void SetUp()
        {
            driver.Navigate().GoToUrl(baseURL);
            ClearData();
        }

        [Test]
        public void AddRace_FromNewCharacterForm_IsInListOnNewCharacterForm()
        {
            string raceName = "TestRace";

            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            driver.FindElement(By.Id("createAddRace")).Click();
            driver.FindElement(By.Id("addRaceName")).SendKeys(raceName);
            driver.FindElement(
                By.CssSelector(
                    "#addRaceForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            SelectElement races = new SelectElement(driver.FindElement(By.Id("raceSelect")));

            IWebElement newRaceOption = races.Options.First(ele => ele.Text == raceName);

            Assert.That(newRaceOption.Text, Is.EqualTo(raceName));
        }

        [Test]
        public void AddRace_FromCustomize_IsInListOnCustomizePage()
        {
            string raceName = "TestRace";

            driver.Navigate().GoToUrl(baseURL + "#customize");

            driver.FindElement(By.Id("raceName")).SendKeys(raceName);
            driver.FindElement(
                By.CssSelector(
                    "#createRaceForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).
                Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            SelectElement races = new SelectElement(driver.FindElement(By.Id("deleteRaceSelect")));

            IWebElement newRaceOption = races.Options.First(ele => ele.Text == raceName);

            Assert.That(newRaceOption.Text, Is.EqualTo(raceName));
        }

        [Test]
        public void AddRace_FromEditCharacter_IsInListOnEditCharacterForm()
        {
            string raceName = "TestRace";

            CreateCharacter();

            driver.Navigate().GoToUrl(baseURL + "#eventLog");

            driver.FindElement(By.CssSelector("a[href='#characterDetails']")).Click();
            driver.FindElement(By.CssSelector("a[href='#editCharacter']")).Click();

            driver.FindElement(By.Id("editAddRace")).Click();
            driver.FindElement(By.Id("addRaceName")).SendKeys(raceName);
            driver.FindElement(
                By.CssSelector(
                    "#addRaceForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            SelectElement races = new SelectElement(driver.FindElement(By.Id("editCharacterRaceSelect")));

            IWebElement newRaceOption = races.Options.First(ele => ele.Text == raceName);

            Assert.That(newRaceOption.Text, Is.EqualTo(raceName));
        }

        [Test]
        public void DeleteRace_FromCustomize_RemovesRace()
        {
            string raceName = "Dwarf";

            driver.Navigate().GoToUrl(baseURL + "#customize");

            SelectElement races = new SelectElement(driver.FindElement(By.Id("deleteRaceSelect")));
            races.SelectByText(raceName);

            driver.FindElement(By.Id("deleteRace")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            IWebElement newRaceOption = races.Options.FirstOrDefault(ele => ele.Text == raceName);

            Assert.That(newRaceOption, Is.Null);
        }
    }
}