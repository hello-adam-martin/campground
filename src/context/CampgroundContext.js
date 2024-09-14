import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteTypes, getAdditionalServices, getRules } from '../services/api';
import config from '../config/appConfig';

const CampgroundContext = createContext();

export const useCampgroundContext = () => useContext(CampgroundContext);

export const CampgroundProvider = ({ children }) => {
  const [contextData, setContextData] = useState({
    siteTypes: [],
    additionalServices: [],
    rules: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedSiteTypes, fetchedAdditionalServices, fetchedRules] = await Promise.all([
          getSiteTypes().catch(() => []),
          getAdditionalServices().catch(() => []),
          getRules().catch(() => [])
        ]);

        setContextData({
          siteTypes: fetchedSiteTypes.length > 0 ? fetchedSiteTypes : config.campground.siteTypes,
          additionalServices: fetchedAdditionalServices.length > 0 ? fetchedAdditionalServices : config.campground.additionalServices,
          rules: fetchedRules.length > 0 ? fetchedRules : config.campground.rules,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to config data if fetch fails
        setContextData({
          siteTypes: config.campground.siteTypes,
          additionalServices: config.campground.additionalServices,
          rules: config.campground.rules,
        });
      }
    };

    fetchData();
  }, []);

  const updateContext = (newData) => {
    setContextData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <CampgroundContext.Provider value={{ ...contextData, updateContext }}>
      {children}
    </CampgroundContext.Provider>
  );
};