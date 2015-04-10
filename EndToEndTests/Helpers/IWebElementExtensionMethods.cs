/* IWebElementExtensionMethods.cs
 * Purpose: Extension elements for IWebElement
 * 
 * Revision History:
 *      Drew Matheson, 2015.04.07: Created
 */ 

using OpenQA.Selenium;

namespace EndToEndTests.Helpers
{
    // ReSharper disable once InconsistentNaming
    public static class IWebElementExtensionMethods
    {
        /// <summary>
        ///     Clears out the element and returns it. <br/>
        /// </summary>
        /// <param name="element">The element to clear input values from</param>
        /// <returns>element</returns>
        public static IWebElement Empty(this IWebElement element)
        {
            element.Clear();

            while (!string.IsNullOrWhiteSpace(element.GetAttribute("value")))
            {
                element.Clear();
            }

            return element;
        }
    }
}
