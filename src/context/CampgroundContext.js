import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

const CampgroundContext = createContext();

export const useCampgroundContext = () => useContext(CampgroundContext);

export const CampgroundProvider = ({ children }) => {
  const [contextData, setContextData] = useState({
    pricing: {},
    siteTypes: [],
    rules: [],
    additionalServices: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricing, siteTypes, rules, additionalServices] = await Promise.all([
          mockApi.getPricing(),
          mockApi.getSiteTypes(),
          mockApi.getRules(),
          mockApi.getAdditionalServices()
        ]);

        setContextData({
          pricing,
          siteTypes,
          rules,
          additionalServices
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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