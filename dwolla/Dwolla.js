
import dwollaService from "./dwollaService";
 var dwolla = require('dwolla-v2');
 
 Dwolla = {};

  requestBody = {
    firstName: "Jane",
    lastName: "Merchant",
    email: "jmerchant@nomail.net",
    type: "receive-only",
    ipAddress: "99.99.99.99"
  };

  //const dwolla = window.dwolla;
  componentDidMount=()=> {
    dwollaService.registerCustomer(this.requestBody);
  };
 
//initialize client
 client = new dwolla.Client({
  key:  "UDnE5rGFSpgXjMBlfYFk9b56vLujnxly7U7VYwurN0PGMC63p3",//process.env.DWOLLA_APP_KEY,
  secret: "xTTh96MJVTUkn01zrJp4sG2KIi7l32YPMU0dPZt9cvzEa5EwFF",//process.env.DWOLLA_APP_SECRET,
  environment: 'sandbox',
});

  // request client token
  getToken = () => {
    // Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-node
    // This example assumes you've already initialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/pages/sdks.html
    client.auth
      .client()
      .then(function (appToken) {
        return appToken.get("/");
      })
      .then(function (res) {
           this.setState((prevState) => {
             return {
               ...prevState,
               token: JSON.stringify(res.body),
             };
           });
 
      });
  };

  createWebHook = () => {
    dwollaService.CreateWebHook();
  };
  retrieveWebHook = () => {
    dwollaService.RetrieveWebHook().then(this.onRetrieveWebHookSuccess);
  };
  onRetrieveWebHookSuccess = (response) => { 
    this.setState((prevState) => {
      return {
        ...prevState,
        webHook: response.url,
      };
    });
  };
export default Dwolla;
