document.querySelector("#decodeBtn").addEventListener("click", displayShifts);

async function loadDictionary() {
  try {
    let response = await fetch("en-US.dic");
    dictionary = await response.text();
  } catch (error) {
    console.error("Failed to load dictionary:", error);
  }
}

function isValidText(decryptedText) {
  let words = decryptedText.split(" ");
  for (let word of words) {
    let cleaned = word.toLowerCase().trim();
    if (!dictionary.includes(cleaned)) {
      return false;
    }
  }
  return true;
}

function caesarShift(text, shift) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let curChar = text[i];
    if (curChar >= "a" && curChar <= "z") {
        /* 
           char.charCodeAt(0) gets the ascii value of the char
           subtract 97 to get the range between 0 and 25
           add the shift amount to get the letter that corresponds to current
           % 26 to keep within the correct range
           add 97 again to get num back to correct ascii range for letters
           String.fromCharCode(...) converts ascii back to char 
        */
      let newChar = String.fromCharCode(
        ((curChar.charCodeAt(0) - 97 + shift) % 26) + 97
      );
      result += newChar;
    } else if (curChar >= "A" && curChar <= "Z") {
      let newChar = String.fromCharCode(
        ((curChar.charCodeAt(0) - 65 + shift) % 26) + 65
      );
      result += newChar;
    } else {
      result += curChar;
    }
  }
  return result;
}

function displayShifts() {
  let cipherText = document.querySelector("#cipherText").value.trim();
  if (!cipherText) {
    alert("Please enter a ciphertext to decode.");
    return;
  }

  let resultsDiv = document.querySelector("#results");
  resultsDiv.innerHTML = "";

  for (let shift = 0; shift < 26; shift++) {
    let decodedText = caesarShift(cipherText, shift);
    let isValid = isValidText(decodedText);
    let resultCard = document.createElement("div");
    resultCard.classList.add("card", "mb-3", "result-card");

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let shiftNumber = document.createElement("h5");
    shiftNumber.classList.add("card-title", "shift-number");
    shiftNumber.textContent = `Shift: ${shift}`;

    let resultText = document.createElement("p");
    resultText.classList.add("card-text", "shift-result");
    resultText.textContent = decodedText;

    if (isValid) {
      console.log(decodedText);
      resultText.classList.add("valid");

      // maybe add table if valid,
      // table would show the shift and what letters correspond to what,
      // can use the shiftNumber variable from loop to calculate letters
    } else {
      resultText.classList.add("invalid");
    }

    // https://dev.to/miacan2021/fade-in-animation-on-scroll-with-intersectionobserver-vanilla-js-4p27
    let observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(resultText);

    cardBody.appendChild(shiftNumber);
    cardBody.appendChild(resultText);
    resultCard.appendChild(cardBody);
    resultsDiv.appendChild(resultCard);
  }
}

window.onload = loadDictionary;
