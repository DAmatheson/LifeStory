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
    internal class ClassTests : LifeStorySeleniumTestsBase
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
            string className = "TestClass";

            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            driver.FindElement(By.Id("createAddClass")).Click();
            driver.FindElement(By.Id("addClassName")).SendKeys(className);
            driver.FindElement(
                By.CssSelector(
                    "#addClassForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            SelectElement classes = new SelectElement(driver.FindElement(By.Id("classSelect")));

            IWebElement newClassOption = classes.Options.First(ele => ele.Text == className);

            Assert.That(newClassOption.Text, Is.EqualTo(className));
        }

        [Test]
        public void AddRace_FromCustomize_IsInListOnCustomizePage()
        {
            string className = "TestClass";

            driver.Navigate().GoToUrl(baseURL + "#customize");

            driver.FindElement(By.Id("className")).SendKeys(className);
            driver.FindElement(
                By.CssSelector(
                    "#createClassForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).
                Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            SelectElement classes = new SelectElement(driver.FindElement(By.Id("deleteClassSelect")));

            IWebElement newClassOption = classes.Options.First(ele => ele.Text == className);

            Assert.That(newClassOption.Text, Is.EqualTo(className));
        }

        [Test]
        public void AddRace_FromEditCharacter_IsInListOnEditCharacterForm()
        {
            string className = "TestClass";

            CreateCharacter();

            driver.Navigate().GoToUrl(baseURL + "#eventLog");

            driver.FindElement(By.CssSelector("a[href='#characterDetails']")).Click();
            driver.FindElement(By.CssSelector("a[href='#editCharacter']")).Click();

            driver.FindElement(By.Id("editAddClass")).Click();
            driver.FindElement(By.Id("addClassName")).SendKeys(className);
            driver.FindElement(
                By.CssSelector(
                    "#addClassForm > div.ui-btn.ui-shadow.ui-btn-corner-all.ui-btn-up-b > button")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            SelectElement classes = new SelectElement(driver.FindElement(By.Id("editCharacterClassSelect")));

            IWebElement newClassOption = classes.Options.First(ele => ele.Text == className);

            Assert.That(newClassOption.Text, Is.EqualTo(className));
        }

        [Test]
        public void DeleteRace_FromCustomize_RemovesRace()
        {
            string className = "Druid";

            driver.Navigate().GoToUrl(baseURL + "#customize");

            SelectElement classes = new SelectElement(driver.FindElement(By.Id("deleteClassSelect")));
            classes.SelectByText(className);

            driver.FindElement(By.Id("deleteClass")).Click();
            driver.FindElement(By.LinkText("Continue")).Click();

            IWebElement deletedClassOption = classes.Options.FirstOrDefault(ele => ele.Text == className);

            Assert.That(deletedClassOption, Is.Null);
        }
    }
}