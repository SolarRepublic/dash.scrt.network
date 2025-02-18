import { createContext, useEffect, useRef, useState } from "react";
import { SecretNetworkClient } from "secretjs";
import { dAppsURL, shuffleArray, sortDAppsArray } from "shared/utils/commons";
import { tokens } from "shared/utils/config";

const APIContext = createContext(null);

const APIContextProvider = ({ children }: any) => {
  const [dappsData, setDappsData] = useState<any[]>([]);
  const [dappsDataSorted, setDappsDataSorted] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [prices, setPrices] = useState<any>([]);

  let coinGeckoIdsString: string = "";
  tokens.forEach((token, index) => {
    coinGeckoIdsString = coinGeckoIdsString.concat(token.coingecko_id);
    if (index !== tokens.length - 1) {
      coinGeckoIdsString = coinGeckoIdsString.concat(",");
    }
  });

  function fetchPrices() {
    let pricesApiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsString}&vs_currencies=USD`;
    fetch(pricesApiUrl)
      .then((resp) => resp.json())
      .then((result: { [coingecko_id: string]: { usd: number } }) => {
        const formattedPrices = Object.entries(result).map(
          ([coingecko_id, { usd }]) => ({
            coingecko_id,
            priceUsd: usd,
          })
        );
        setPrices(formattedPrices);
      });
  }

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchDappsURL = () => {
    fetch(dAppsURL)
      .then((response) => {
        if (!response.ok) throw new Error();
        else return response.json();
      })
      .then((jsonData) => {
        setDappsData(jsonData.data);
      })
      .catch((error) => {
        console.error(error);

        setTimeout(() => fetchDappsURL(), 3000);
      });
  };

  useEffect(() => {
    fetchDappsURL();
  }, []);

  useEffect(() => {
    if (dappsData && dappsDataSorted.length === 0 && dappsData?.length !== 0) {
      setDappsDataSorted(sortDAppsArray(dappsData));
      // Tag-Filter
      let allTags: string[] = [];

      dappsData.forEach((dapp) => {
        dapp.attributes.type
          .map((item: any) => item.name)
          .forEach((tag: any) => {
            if (!allTags.find((tagItem) => tagItem === tag)) {
              allTags.push(tag);
            }
          });
      });
      setTags(allTags.sort());
    }
  }, [dappsData]);

  const [coingeckoApiData_Day, setCoinGeckoApiData_Day] = useState();
  const [coingeckoApiData_Month, setCoinGeckoApiData_Month] = useState();
  const [coingeckoApiData_Year, setCoinGeckoApiData_Year] = useState();
  const [defiLamaApiData_Year, setDefiLamaApiData_Year] = useState();
  const [defiLamaApiData_TVL, setDefiLamaApiData_TVL] = useState();
  const [currentPrice, setCurrentPrice] = useState(Number);
  const [externalApiData, setExternalApiData] = useState();
  const [secretAnalyticslApiData, setSecretAnalyticslApiData] = useState();
  const [volume, setVolume] = useState(Number);
  const [marketCap, setMarketCap] = useState(Number);

  useEffect(() => {
    // Coingecko API
    let coingeckoApiUrl_Day = `https://api.coingecko.com/api/v3/coins/secret/market_chart?vs_currency=usd&days=1`;
    fetch(coingeckoApiUrl_Day)
      .then((response) => response.json())
      .then((response) => {
        setCoinGeckoApiData_Day(response);
      });

    let coingeckoApiUrl_Month = `https://api.coingecko.com/api/v3/coins/secret/market_chart?vs_currency=usd&days=30`;
    fetch(coingeckoApiUrl_Month)
      .then((response) => response.json())
      .then((response) => {
        setCoinGeckoApiData_Month(response);
      });

    let coingeckoApiUrl_Year = `https://api.coingecko.com/api/v3/coins/secret/market_chart?vs_currency=usd&days=365`;
    fetch(coingeckoApiUrl_Year)
      .then((response) => response.json())
      .then((response) => {
        setCoinGeckoApiData_Year(response);
      });

    let defiLamaApiUrl_Year = `https://api.llama.fi/charts/secret`;
    fetch(defiLamaApiUrl_Year)
      .then((response) => response.json())
      .then((response) => {
        setDefiLamaApiData_Year(
          response.map((x: any[]) => [
            parseInt((x as any).date) * 1000,
            (x as any).totalLiquidityUSD,
          ])
        );
      });

    let defiLamaApiUrl_TVL = `https://api.llama.fi/chains`;
    fetch(defiLamaApiUrl_TVL)
      .then((response) => response.json())
      .then((response) => {
        setDefiLamaApiData_TVL(
          response.filter((item: any) => item?.gecko_id === "secret")[0]?.tvl
        );
      });

    // Coingecko Market Price, Market Cap & Volume
    let coingeckoMarketCapVolumeUrl = `https://api.coingecko.com/api/v3/simple/price?ids=secret&vs_currencies=USD&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
    fetch(coingeckoMarketCapVolumeUrl)
      .then((response) => response.json())
      .then((response) => {
        setCurrentPrice(response.secret.usd);
        setMarketCap(response.secret.usd_market_cap);
        setVolume(response.secret.usd_24h_vol);
      });

    // Coingecko Market Price, Market Cap & Volume
    let mintscanApiDataUrl = `https://api.mintscan.io/v1/secret/status`;
    fetch(mintscanApiDataUrl)
      .then((response) => response.json())
      .then((response) => {
        setExternalApiData(response);
      });

    let secretAnalyticsApiDataUrl = `https://api.secretanalytics.xyz/network`;
    fetch(secretAnalyticsApiDataUrl)
      .then((response) => response.json())
      .then((response) => {
        setSecretAnalyticslApiData(response);
      });
  }, []);

  const providerValue = {
    dappsData,
    setDappsData,
    dappsDataSorted,
    setDappsDataSorted,
    tags,
    setTags,
    coingeckoApiData_Day,
    setCoinGeckoApiData_Day,
    coingeckoApiData_Month,
    setCoinGeckoApiData_Month,
    coingeckoApiData_Year,
    setCoinGeckoApiData_Year,
    defiLamaApiData_Year,
    setDefiLamaApiData_Year,
    defiLamaApiData_TVL,
    setDefiLamaApiData_TVL,
    currentPrice,
    setCurrentPrice,
    externalApiData,
    setExternalApiData,
    secretAnalyticslApiData,
    setSecretAnalyticslApiData,
    volume,
    setVolume,
    marketCap,
    setMarketCap,
    prices,
  };

  return (
    <APIContext.Provider value={providerValue}>{children}</APIContext.Provider>
  );
};

export { APIContext, APIContextProvider };
