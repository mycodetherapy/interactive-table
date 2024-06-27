import React from 'react';
import './App.css';
import MailingsTable from './components/MailingTable/MailingsTable';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <MailingsTable />
      </div>
    </Provider>
  );
}

export default App;
