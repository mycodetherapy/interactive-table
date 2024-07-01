import React from 'react';
import './App.css';
import MailingsTable from './components/MailingTable/MailingsTable';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Container } from '@mui/material';

function App() {
  return (
    <Provider store={store}>
      <main className='App'>
        <MailingsTable />
      </main>
    </Provider>
  );
}

export default App;
