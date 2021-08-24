import dwollaService from "./dwollaService";
class DwollaApp extends React.Component {
  state = {
    webHook: "",
  };
  requestBody = {
    firstName: "Jane",
    lastName: "Merchant",
    email: "jmerchant@nomail.net",
    type: "receive-only",
    ipAddress: "99.99.99.99",
  };
  componentDidMount() {
    dwollaService.registerCustomer(this.requestBody);

 



  // request client token
  getToken ()

  createWebHook ().then() 
  retrieveWebHook().then(this.onRetrieveWebHookSuccess); 
  }
  onRetrieveWebHookSuccess = (response) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        webHook: response.url,
      };
    });
  };

  render() {
    return 1;
  }
}
export default DwollaApp;