import React, { Component } from 'react'
import logo from './logo.svg'
import './Home.css'
import { connect } from 'react-redux'
import cognitoUtils from '../lib/cognitoUtils'
import request from 'request'
import appConfig from '../config/app-config.json'
import axios from 'axios';

const mapStateToProps = state => {
  return { session: state.session }
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = { apiStatus: 'Not called' }
  }

  componentDidMount () {
console.log(">>>Calling api")

const api = 'https://2rw3qvzgl9.execute-api.us-west-1.amazonaws.com/dev/api/users/stafflist';


  
    if (this.props.session.isLoggedIn) {

      axios.get(api, {
        headers: {
          Authorization: `Bearer ${this.props.session.credentials.accessToken}`
        }
      }).then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      
      

     
      
      // fetch("https://2rw3qvzgl9.execute-api.us-west-1.amazonaws.com/dev/api/users/stafflist",{ 
      //   crossDomain:true,
      //   method: 'get', 
      //   headers: new Headers({
      //     Authorization: `Bearer ${this.props.session.credentials.accessToken}`,
      //     'Access-Control-Allow-Origin': "*",
      //   })})
      // .then(res =>{
      //   console.log(res.json())
      // })
      // .then(
      //   (result) => {
      //     this.setState({
      //       isLoaded: true,
      //       items: result.items
      //     });
      //   },
      //   // Note: it's important to handle errors here
      //   // instead of a catch() block so that we don't swallow
      //   // exceptions from actual bugs in components.
      //   (error) => {
      //     this.setState({
      //       isLoaded: true,
      //       error
      //     });
      //   }
      // )

      
      // Call the API server GET /users endpoint with our JWT access token
      const options = {
        url: api,
        headers: {
          Authorization: `Bearer ${this.props.session.credentials.accessToken}`
        }
      }

      this.setState({ apiStatus: 'Loading...' })
      request.get(options, (err, resp, body) => {
        let apiStatus, apiResponse
        if (err) {
          // is API server started and reachable?
          apiStatus = 'Unable to reach API'
          console.error(apiStatus + ': ' + err)
        } else if (resp.statusCode !== 200) {
          // API returned an error
          apiStatus = 'Error response received'
          apiResponse = body
          console.error(apiStatus + ': ' + JSON.stringify(resp))
        } else {
          apiStatus = 'Successful response received.'
          apiResponse = body
        }
        this.setState({ apiStatus, apiResponse })
      })
    }
  }

  onSignOut = (e) => {
    e.preventDefault()
    cognitoUtils.signOutCognitoSession()
  }

  render () {
    return (
      <div className="Home">
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          { this.props.session.isLoggedIn ? (
            <div>
              <p>You are logged in as user {this.props.session.user.userName} ({this.props.session.user.email}).</p>
              <p></p>
              <div>
                <div>API status: {this.state.apiStatus}</div>
                <div className="Home-api-response">{this.state.apiResponse}</div>
              </div>
              <p></p>
              <a className="Home-link" href="#" onClick={this.onSignOut}>Sign out</a>
            </div>
          ) : (
            <div>
              <p>You are not logged in.</p>
              <a className="Home-link" href={cognitoUtils.getCognitoSignInUri()}>Sign in</a>
            </div>
          )}
         
        </header>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Home)
