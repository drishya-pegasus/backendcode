import React, { createContext, useState, useContext } from 'react';

const ShippingContext = createContext();

export const useShipping = () => useContext(ShippingContext);

export const ShippingProvider = ({ children }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const shippingCost = selectedDistrict === 'Kathmandu' ? 100 : 200;

  return (
    <ShippingContext.Provider value={{ selectedDistrict, setSelectedDistrict, shippingCost }}>
      {children}
    </ShippingContext.Provider>
  );
};
