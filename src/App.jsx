import React from 'react';
import { connect } from 'react-redux'
import { MainScreen } from './screens/MainScreen';
import { ErrorScreen } from './screens/ErrorScreen'
import axios from "axios";

/*const REACT_APP_APPLICATION_ID='0e8fc539-af8c-4f24-889c-f2d4e5ea455a'
const REACT_APP_APPLICATION_KEY='8a0aeccf9ea81d56f6546832d678b43bafefda09ae227950668a5021c957a70e12d9b09cb3bbb6'
const REACT_APP_API_BASE_URL='https://t87djgnrr2.execute-api.eu-west-1.amazonaws.com/develop'

const application = {
  id: REACT_APP_APPLICATION_ID,
  baseUrl: REACT_APP_API_BASE_URL,
  apiKey: REACT_APP_APPLICATION_KEY
}*/

const App = (props) => {

  /*React.useEffect(() => {
    axios({
        method: "post",
        url: `${application.baseUrl}/applications']`,
        headers: {
            "X-API-KEY": application.apiKey
        },
        data: {
            key: `public/applications/${application.id}`
        }
    })
    .then(response => {
        // Here you can set appData to state or redux
        console.log("appData:", response.data.body);
    })
    .catch(error => {
        console.error(error);
    });
  }, []);*/

  return props.state.isConnected?
    <MainScreen props = {props}/>
    : <ErrorScreen /> 
};

const mapStateToProps = (state, ownProps) => ({
  state
})

export default connect(mapStateToProps)(App)