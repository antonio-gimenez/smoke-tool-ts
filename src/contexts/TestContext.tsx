/**
 * @abstract A custom hook for detecting key press events.
 * @description This hook will listen for key presses and call the handler function when the key is pressed.
 * @param key - The key to listen for.
 * @param handler - The function to be called when the key is pressed.  
 */

import api from "../services/use-axios";
import React, { createContext, useContext, useState } from "react";
import { AlertContext } from "./AlertContext";


const TestContext = createContext(
  {} as {
    tests: any[];
    page: number;
    totalCount: number;
    totalPages: number;
    fetch: (queryParams?: any) => void;
    isEmpty: boolean;
    isLoading: boolean;
  }
);

const defaultParams = {
  page: 1,
  status: ["Pending"],
};

interface Props {
  children: React.ReactNode;
  initialParams?: any;
}


interface axiosError {
  message: string;
  code: string;
}

interface QueryParams {
  page?: number;
  status?: string[];
  limit?: number;

}
const TestProvider = ({ children, initialParams = defaultParams }: Props) => {
  const [tests, setTests] = useState({ data: [], page: 1, totalCount: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const { addAlert } = useContext(AlertContext);

  const fetchTests = async (
    queryParams: QueryParams = initialParams
  ) => {
    // Set loading state to true
    setIsLoading(true);
    try {
      const response = await api.get(`tests`, {
        params: queryParams ?? initialParams,
      });
      const data = response.data;
      // Update state with fetched data
      setTests(data);
      setIsEmpty(data.data.length === 0);
    } catch (error) {
      const { message, code } = error as axiosError;

      addAlert({ message: "Error retrieving tests: " + message, type: "error", title: code, position: 'bottom-center' });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <TestContext.Provider
      value={{
        tests: tests.data,
        page: tests.page,
        totalCount: tests.totalCount,
        totalPages: tests.totalPages,
        fetch: fetchTests,
        isEmpty,
        isLoading
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export { TestContext, TestProvider };
