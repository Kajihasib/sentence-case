document.addEventListener("DOMContentLoaded", function () {
  // Load the country and city names from an external JSON file
  fetch("alljson.json")
    .then((response) => response.json())
    .then((data) => {
      function toSentenceCase(input) {
        const emailPattern =
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const websitePattern =
          /((https?:\/\/)?(www\.)?[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/g;
        let emails = [];
        let websites = [];

        // Extract emails and replace them with placeholders
        input = input.replace(emailPattern, function (email) {
          emails.push(email);
          return `__EMAIL${emails.length - 1}__`;
        });

        // Extract websites and replace them with placeholders
        input = input.replace(websitePattern, function (website) {
          websites.push(website);
          return `__WEBSITE${websites.length - 1}__`;
        });

        // Split the input into sentences based on punctuation marks, including the punctuation in the result
        let sentences = input.split(/([.?!])\s*/).filter(Boolean);

        // Helper function to capitalize the first letter of a string
        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }

        // Process each sentence
        for (let i = 0; i < sentences.length; i += 2) {
          let sentence = sentences[i].trim();

          // Split sentence into words
          let words = sentence.split(" ");

          // Capitalize the first word if it's not an email or website placeholder
          if (
            !words[0].startsWith("__EMAIL") &&
            !words[0].startsWith("__WEBSITE")
          ) {
            words[0] = capitalizeFirstLetter(words[0]);
          }

          // Capitalize each word if it's a country/city name or starts with '#', skip email and website placeholders
          for (let j = 1; j < words.length; j++) {
            if (
              words[j].startsWith("__EMAIL") ||
              words[j].startsWith("__WEBSITE")
            ) {
              continue;
            } else if (
              data.includes(
                words[j].charAt(0).toUpperCase() +
                  words[j].slice(1).toLowerCase()
              )
            ) {
              words[j] =
                words[j].charAt(0).toUpperCase() +
                words[j].slice(1).toLowerCase();
            } else if (words[j].startsWith("#")) {
              words[j] =
                words[j].replace(/^#/, "").charAt(0).toUpperCase() +
                words[j].replace(/^#/, "").slice(1).toLowerCase();
            } else {
              words[j] = words[j].toLowerCase();
            }
          }

          // Reassemble the sentence
          sentences[i] = words.join(" ");
        }

        // Reassemble the entire string, keeping the punctuation marks
        let result = sentences
          .map((sentence, index) => {
            return index % 2 === 0 ? sentence : sentence.trim() + " ";
          })
          .join("")
          .trim();

        // Reinsert emails back into the text
        result = result.replace(/__EMAIL(\d+)__/g, function (match, p1) {
          return emails[parseInt(p1)];
        });

        // Reinsert websites back into the text
        result = result.replace(/__WEBSITE(\d+)__/g, function (match, p1) {
          return websites[parseInt(p1)];
        });

        return result;
      }

      // Function to apply sentence case conversion to elements with a specific class name
      function applySentenceCaseToClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let element of elements) {
          element.textContent = toSentenceCase(element.textContent);
        }
      }

      // Apply sentence case to elements with the class 'sentence-case'
      applySentenceCaseToClass("sentence-case");
    })
    .catch((error) => {
      console.error("Error loading country and city names:", error);
    });
});
