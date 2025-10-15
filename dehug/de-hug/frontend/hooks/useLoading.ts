import { useState } from 'react';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  
  return { isLoading, startLoading, stopLoading };
};