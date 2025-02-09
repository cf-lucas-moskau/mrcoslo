import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { db } from "../firebase";
import { ref, get, set } from "firebase/database";

const SPREADSHEET_ID = "1AAHZUsOvR5K9XDKd23S5pFzvU-MdVCukD9kihTTaCWM";
const SHEET_ID = "0"; // First sheet
const RANGE = "A2:U100"; // Adjust range as needed
const CACHE_DURATION = 10 * 60 * 60 * 1000; // 10 hours in milliseconds

interface RaceData {
  month: string;
  country: string;
  name: string;
  info: string;
  date: string;
  distances: string;
  type: string;
  runners: string[];
}

interface CacheData {
  races: RaceData[];
  lastUpdated: number;
}

type SheetRow = (string | null)[];

async function fetchFromGoogleSheets(): Promise<RaceData[]> {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  console.log("Starting Google Sheets fetch");

  if (!apiKey) {
    console.error("API Key missing");
    throw new Error(
      "Google Sheets API key is not configured. Please check your environment variables."
    );
  }

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${apiKey}`;
    console.log("Fetching from URL:", url);

    const response = await fetch(url);
    const responseData = await response.json();

    if (!response.ok) {
      console.error("API Error Response:", responseData);
      throw new Error(
        `Failed to fetch spreadsheet data: ${
          responseData.error?.message || response.statusText
        }`
      );
    }

    if (!responseData.values) {
      console.error("No values in response:", responseData);
      throw new Error("No data found in spreadsheet");
    }

    const rows: SheetRow[] = responseData.values;
    console.log("Raw rows:", rows);

    const races = rows
      .filter((row: SheetRow) => {
        if (!row[0] || !row[2]) {
          console.debug("Filtering out row:", row);
          return false;
        }
        return true;
      })
      .map((row: SheetRow) => {
        // Ensure all required fields have default values
        const raceData: RaceData = {
          month: row[0]?.trim() || "",
          country: row[1]?.trim() || "",
          name: row[2]?.trim() || "",
          info: row[3]?.trim() || "",
          date: row[4]?.trim() || "",
          distances: row[5]?.trim() || "",
          type: row[6]?.trim() || "",
          runners: [], // Initialize empty array by default
        };

        // Process runners only if they exist
        const potentialRunners = [
          row[7],
          row[8],
          row[9],
          row[10],
          row[11],
          row[12],
          row[13],
          row[14],
          row[15],
          row[16],
          row[17],
          row[18],
          row[19],
        ];

        raceData.runners = potentialRunners
          .filter(
            (runner): runner is string =>
              typeof runner === "string" && runner.trim().length > 0
          )
          .map((runner) => runner.trim());

        console.debug("Processed race:", raceData);
        return raceData;
      });

    console.log("Total races processed:", races.length);
    return races;
  } catch (error) {
    console.error("Error in fetchFromGoogleSheets:", error);
    throw error;
  }
}

export async function fetchRaces(): Promise<{
  races: RaceData[];
  lastUpdated: number;
}> {
  console.log("Starting fetchRaces");
  const cacheRef = ref(db, "raceCache");

  try {
    // Get cached data
    const snapshot = await get(cacheRef);
    const cachedData: CacheData | null = snapshot.val();
    const now = Date.now();

    console.log("Cache status:", {
      exists: !!cachedData,
      lastUpdated: cachedData?.lastUpdated
        ? new Date(cachedData.lastUpdated).toISOString()
        : null,
      raceCount: cachedData?.races?.length || 0,
    });

    // Check if cache exists and is still valid
    if (
      cachedData?.races &&
      Array.isArray(cachedData.races) &&
      cachedData.lastUpdated &&
      now - cachedData.lastUpdated < CACHE_DURATION
    ) {
      console.log("Using cached data");
      return {
        races: cachedData.races,
        lastUpdated: cachedData.lastUpdated,
      };
    }

    console.log("Cache missing or expired, fetching new data");
    const races = await fetchFromGoogleSheets();

    if (!Array.isArray(races)) {
      console.error("Invalid races data:", races);
      throw new Error("Invalid data format received from Google Sheets");
    }

    // Get existing race data to preserve comments and excited fields
    const existingRacesSnapshot = await get(ref(db, "raceCache/races"));
    const existingRaces = existingRacesSnapshot.val() || {};

    // Merge new race data with existing data
    const mergedRaces = races.map((race, index) => {
      const existingRace = existingRaces[index];
      return {
        ...race,
        // Preserve existing comments and excited data if they exist
        comments: existingRace?.comments || [],
        excited: existingRace?.excited || {},
      };
    });

    const newCacheData: CacheData = {
      races: mergedRaces,
      lastUpdated: now,
    };

    console.log("Updating cache with merged data");
    await set(cacheRef, newCacheData);
    return newCacheData;
  } catch (error) {
    console.error("Error in fetchRaces:", error);

    // If we have cached data, return it even if expired
    const snapshot = await get(cacheRef);
    const cachedData: CacheData | null = snapshot.val();

    if (cachedData?.races && Array.isArray(cachedData.races)) {
      console.log("Returning expired cache data after error");
      return {
        races: cachedData.races,
        lastUpdated: cachedData.lastUpdated,
      };
    }

    console.error("No cached data available");
    throw error;
  }
}
