// Imports
import { TIME_OUT } from './config.js';

// Timeout Error Generator
const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

// Fetching Recipe from API
export const getJSON = async function (url) {
  try {
    const recipeResponse = await Promise.race([fetch(url), timeout(TIME_OUT)]);

    const recipeData = await recipeResponse.json();

    if (!recipeResponse.ok)
      throw new Error(`(${recipeResponse.status}): ${recipeData.message}`);

    return recipeData;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const recipeResponse = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIME_OUT),
    ]);

    const recipeData = await recipeResponse.json();

    if (!recipeResponse.ok)
      throw new Error(`(${recipeResponse.status}): ${recipeData.message}`);

    return recipeData;
  } catch (err) {
    throw err;
  }
};
