/* RaceTests.cs
 * Purpose: Selenium/NUnit end to end tests for LifeStory's Race CRUD pages
 * 
 * Revision History:
 *      Drew Matheson, 2015.04.08: Created
 */ 

using System.Linq;
using System.Threading;
using EndToEndTests.Helpers;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace EndToEndTests
{
    [TestFixture]
    public class RaceTests : LifeStorySeleniumTestsBase
    {
        [SetUp]
        public void SetUp()
        {
            driver.Navigate().GoToUrl(baseURL);
            ClearData();
        }

        [Test]
        public void AddRace_FromNewCharacterForm_IsSelectedOnNewCharacterForm()
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
            Assert.That(races.SelectedOption.Text, Is.EqualTo(raceName));
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
        public void SelectRace_ClickAddRaceFromNewCharacterFormAndReturn_InitiallySelectedValueIsSelected()
        {
            string selectedRace = "Dwarf";

            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            SelectElement races = new SelectElement(driver.FindElement(By.Id("raceSelect")));
            races.SelectByText(selectedRace);

            driver.FindElement(By.Id("createAddRace")).Click();
            driver.FindElement(By.PartialLinkText("New Character")).Click();

            Thread.Sleep(50); // Give time for the select to be populated

            Assert.That(races.SelectedOption.Text, Is.EqualTo(selectedRace));
        }

        [Test]
        public void AddRace_FromEditCharacter_IsInListOnEditCharacterForm()
        {
            string raceName = "TestRace";

            driver.CreateCharacter(baseURL);

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