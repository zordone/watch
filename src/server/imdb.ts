import puppeteer from "puppeteer-core";

interface ImdbData {
  "@type": string;
  keywords: string;
  name: string;
  alternateName: string;
  genre: string | string[];
  description: string;
  image: string;
  datePublished: string;
  aggregateRating: {
    ratingValue: string;
    ratingCount: string;
  };
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36";
const HEADERS = {
  "Accept-Language": "en-US,en;q=0.9",
};
const SELECTOR = 'script[type="application/ld+json"]';

export const fetchImdbData = async (imdbId: string): Promise<ImdbData> => {
  const url = `https://www.imdb.com/title/${imdbId}/`;
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    // headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768, deviceScaleFactor: 1 });
  await page.setExtraHTTPHeaders(HEADERS);
  await page.setUserAgent({ userAgent: USER_AGENT });
  await page.goto(url, { waitUntil: ["load", "networkidle0"] });
  await page.waitForSelector(SELECTOR);
  const json = await page.$eval(SELECTOR, (el) => el.textContent ?? "");
  const data = JSON.parse(json) as ImdbData;
  await browser.close();
  return data;
};
