const puppeteer = require("puppeteer");

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();
  // Open a new page
  const page = await browser.newPage();
  // Navigate to the website
  await page.goto("https://www.facebook.com/mrcosl/upcoming_hosted_events");

  // Wait for a specific element to be visible
  await page.waitForSelector("img"); // Modify this selector to the element you're interested in

  const textContent = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("span")); // Adjust selector as needed
    return elements.map((element) => element.innerText);
  });

  const input = textContent.slice(15, textContent.length).join(",");
  console.log(input); // Logs an array of text content from each <p> tag

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are converting data I extracted from my website into an array of events. The data contains events, but they are formatted poorly. You extract the events and format them into a list of objects with the following properties: title, date, time, location. The title, date, time and location are all strings. You only return array of objects, nothing else!",
      },
      {
        role: "user",
        content:
          "Anmelden,Anmelden,Anmelden,Anmelden,Kontoinfo vergessen?,Mikkeller Running Club Oslo ,,1.856 „Gefällt mir“-Angaben • 2.186 Follower,,,,,Mehr,Beiträge,Info,Fotos,Videos,,,Veranstaltungen,,,Mehr,Bevorstehende Veranstaltungen,Vergangene Veranstaltungen,SO, 10. MÄRZ UM 11:00 CET UHR,SO, 10. MÄRZ UM 11:00 CET UHR,MRC Oslo: Long Run Sunday - 18-20 km (5:30 & 6:30 per km pace groups),MRC Oslo: Long Run Sunday - 18-20 km (5:30 & 6:30 per km pace groups),MRC Oslo: Long Run Sunday - 18-20 km (5:30 & 6:30 per km pace groups),Henry & Sally's· Oslo Veranstaltung von Mikkeller Running Club Oslo,Henry & Sally's · Oslo Veranstaltung von Mikkeller Running Club Oslo,  · , , · ,SA, 16. MÄRZ – 17. MÄRZ,SA, 16. MÄRZ – 17. MÄRZ,MRC Oslo goes Lisbon Half,MRC Oslo goes Lisbon Half,MRC Oslo goes Lisbon Half,Lissabon",
      },

      {
        role: "assistant",
        content: `[
            {
              "title": "MRC Oslo: Long Run Sunday - 18-20 km (5:30 & 6:30 per km pace groups)",
              "date": "SO, 10. MÄRZ",
              "time": "UM 11:00 CET UHR",
              "location": "Henry & Sally's· Oslo",
            },
            {
              "title": "MRC Oslo goes Lisbon Half",
              "date": "SA, 16. MÄRZ – 17. MÄRZ",
              "time": "",
              "location": "Lissabon",
            }
          ]
          `,
      },
      {
        role: "user",
        content: input,
      },
    ],
    model: "gpt-3.5-turbo-0125",
  });

  console.log(completion.choices[0].message.content);
  await browser.close();
})();
