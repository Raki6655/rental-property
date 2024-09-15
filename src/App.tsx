import logo from './logo.svg';
import './App.css';
import React, { Suspense, useContext, useEffect } from "react";
import { QueryClient } from "react-query";
import AppProvider from './store/AppProvider';
import { AppContext } from './store/AppContext';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Components/common/Header';
import { BASE_ROUTES } from './_constants/constants';

const queryClient = new QueryClient();

interface LoadComponentProps {
  component: React.ComponentType;
}
const HomePage = React.lazy(() => import('./Components/pages/HomePage'));


const LoadComponent: React.FC<LoadComponentProps> = ({ component: Component }) => (
  <Suspense fallback={<span>Loading...</span>}>
    <Component />
  </Suspense>
);

function App() {
  const currentState = useContext(AppContext);

  return (
    <div className="App">
      <AppProvider>
        <AppContext.Consumer>

          {(context) => {
            if (context?.validatingToken) {
              return <h1>App Loader ...</h1>;
            }

            return (
              <>
                <Header />
                <div className='bodyWrapper'>
                  <Routes>
                    <Route path={BASE_ROUTES.HOME} element={<LoadComponent component={HomePage} />}></Route>
                  </Routes>
                </div>
              </>
            );

          }}
        </AppContext.Consumer>
      </AppProvider>
    </div>
  );
}

export default App;
