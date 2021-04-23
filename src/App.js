import React, {useState, useRef, useEffect} from 'react';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import PrimeReact from 'primereact/api';
import { AutoComplete } from 'primereact/autocomplete';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {


    let currencyNamesGlobal = [];

  const [text, setText] = useState('');
  const toastRef = useRef();

    const [convertedValue, setConvertedValue] = useState('');
    const [value1, setValue1] = useState('');
    const [value3, setValue3] = useState('');
    const [selectedCountry2, setSelectedCountry2] = useState(null);
    const [destinationCurrency, setSelectedDestinationCurrency] = useState(null);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState(null);

  // active ripple effect
  PrimeReact.ripple = true;



    useEffect(() => {

        getCountries();


    }, []);

    const getCountries = () => {
        return axios.get('http://api.currencylayer.com/list?access_key=1e8cd3ce10e28f54775c8989af651940&format=1')
            .then((res) => {

                let object1 = res.data.currencies;

                for (const [key, value] of Object.entries(object1)) {
                    currencyNamesGlobal.push(
                        {"name": `${key} - ${value}`, "unit": `${key}`}
                    );
                };

                setCountries(currencyNamesGlobal);


            });
    };

    const storeDataToServer = () => {
        console.log('inside store to server----');
        console.log(setConvertedValue);

        return axios.post('http://34d342e6229f.ngrok.io/dashboard/public/api/store/currency', { amount : value1, from : selectedCountry2.unit, to : destinationCurrency.unit, converted: 80, converted_to_usd: 80 })
            .then((res) => {

                console.log('Store--------/---------');

                console.log(res);


            });
    };

    const convertCurrency = () => {

        return axios.get(`https://free.currconv.com/api/v7/convert?q=${selectedCountry2.unit}_${destinationCurrency.unit}&compact=ultra&apiKey=2c47ef9027a093d41e2e`)
            .then((res) => {
                console.log(res);
                console.log(res.data);


                let objt = `${selectedCountry2.unit}_${destinationCurrency.unit}`;

                let total = res.data[objt] * value1;
                console.log('converted --------');
                console.log(total);

                setConvertedValue(total.toFixed(2));


            });
    };


    const searchCountry = (event) => {
        setTimeout(() => {
            let _filteredCountries;
            if (!event.query.trim().length) {
                _filteredCountries = [...countries];
            }
            else {
                _filteredCountries = countries.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredCountries(_filteredCountries);
        }, 250);
    }

  const onFormSubmit = async (e) => {

      e.preventDefault();

      await convertCurrency();

      await storeDataToServer();

      console.log(selectedCountry2);

  }

    const itemTemplate = (item) => {
        return (
            <div className="country-item">
                {/*<img alt={item.name} src={`showcase/demo/images/flag_placeholder.png`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${item.code.toLowerCase()}`} />*/}
                <div>{item.name}</div>
            </div>
        );
    }

  return (
    <div className="App">

      <Toast ref={toastRef} />

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <form className="p-d-flex p-jc-center p-mt-6" onSubmit={onFormSubmit}>
        {/*<InputText value={text} onChange={(e) => setText(e.target.value)} />*/}
        {/*<Button type="submit" label="Submit" icon="pi pi-check" className="p-ml-2"/>*/}

          <div>
              <h4>Amount</h4>
              <br/>
              <InputText value={value1} onChange={(e) => setValue1(e.target.value)}/>
          </div>
          <div>
            <h4>From</h4>
            <br/>
            <AutoComplete value={selectedCountry2} suggestions={filteredCountries} completeMethod={searchCountry} field="unit" dropdown forceSelection itemTemplate={itemTemplate} onChange={(e) => setSelectedCountry2(e.value)} />
          </div>
          <div>
              <h4>To</h4>
            <br/>
            <AutoComplete value={destinationCurrency} suggestions={filteredCountries} completeMethod={searchCountry} field="unit" dropdown forceSelection itemTemplate={itemTemplate} onChange={(e) => setSelectedDestinationCurrency(e.value)} />
          </div>
          <Button type="submit" label="Submit" icon="pi pi-check" className="p-ml-2"/>
      </form>

        <h1>{convertedValue}</h1>

    </div>
  );
}

export default App;
