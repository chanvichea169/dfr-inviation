async function fetchWithRetry(url, retries = 5, backoff = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("retry-after");
        const delay = retryAfterHeader 
          ? parseInt(retryAfterHeader, 10) * 1000 
          : backoff * Math.pow(2, i);

        console.warn(`[Retry] Rate limited (429) on ${url}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (response.status >= 500 && response.status < 600) {
        const delay = backoff * Math.pow(2, i);
        console.warn(`[Retry] Server error (${response.status}) on ${url}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (err) {
      const delay = backoff * Math.pow(2, i);
      console.warn(`[Retry] Network error on ${url}: ${err.message}. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return fetch(url);
}

async function fetchAllPages(url, name) {
  const pageSize = 200;
  let page = 1;
  const allItems = [];

  while (true) {
    const pageUrl = `${url}?page=${page}&page_size=${pageSize}`;
    const response = await fetchWithRetry(pageUrl);

    if (!response.ok) {
      console.log(`[${name}] Non-ok response: HTTP ${response.status} at page ${page}`);
      if (response.status === 404) {
        break;
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      break;
    }

    allItems.push(...data.items);

    console.log(
      `[${name}] Page ${page}: fetched ${data.items.length} items. Cumulative: ${allItems.length}`
    );

    if (data.items.length < pageSize) {
      console.log(`[${name}] Last page detected (items fetched ${data.items.length} < pageSize ${pageSize}). Breaking.`);
      break;
    }

    if (data.total_pages && page >= data.total_pages) {
      console.log(`[${name}] Reached total_pages limit (${data.total_pages}). Breaking.`);
      break;
    }

    page++;
    
    // Tiny delay to be gentle to the API
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`[${name}] Completed. Total fetched: ${allItems.length}`);
  return allItems;
}

async function run() {
  const urls = {
    village: "https://data.mef.gov.kh/api/v1/public-datasets/pd_66a8603a00604c000123e147/json"
  };

  console.log("--- TESTING ROBUST VILLAGE FETCH ---");
  const startTime = Date.now();
  const villages = await fetchAllPages(urls.village, "Village");
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`Finished fetching villages in ${duration}s. Success! Total villages: ${villages.length}`);
}

run();
