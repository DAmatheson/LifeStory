/* ClassTests.cs
 * Purpose: Selenium/NUnit end to end tests for LifeStory's Class CRUD pages
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
    public class ClassTests : LifeStorySeleniumTestsBase
    {
        [SetUp]
        public void SetUp()
        {
            driver.Navigate().GoToUrl(baseURL);
            ClearData();
        }

        [Test]
        public void AddClass_FromNewCharacterForm_IsSelectedOnNewCharacterForm()
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
            Assert.That(classes.SelectedOption.Text, Is.EqualTo(className));
        }

        [Test]
        public void SelectClass_ClickAddClassFromNewCharacterFormAndReturn_InitiallySelectedValueIsSelected()
        {
            string selectedClass = "Druid";

            driver.Navigate().GoToUrl(baseURL + "#createCharacter");

            SelectElement classes = new SelectElement(driver.FindElement(By.Id("classSelect")));
            classes.SelectByText(selectedClass);

            driver.FindElement(By.Id("createAddClass")).Click();
            driver.FindElement(By.PartialLinkText("New Character")).Click();

            Thread.Sleep(50); // Give time for the select to be populated

            Assert.That(classes.SelectedOption.Text, Is.EqualTo(selectedClass));
        }

        [Test]
        public void AddClass_FromCustomize_IsInListOnCustomizePage()
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
        public void AddClass_FromEditCharacter_IsInListOnEditCharacterForm()
        {
            string className = "TestClass";

            driver.CreateCharacter(baseURL);

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
        public void DeleteClass_FromCustomize_RemovesClass()
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