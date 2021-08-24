const dwollaService = {};
const appToken = "ADKLfXif8yScgOe1W1ftQhHqnQ8DBSUaxz4p2gPdhGVT96jjok";
dwollaService.registerCustomer = (requestBody) => {
  appToken.post("customers", requestBody).then(function (res) {
    res.headers.get("location"); // => 'https://api-sandbox.dwolla.com/customers/c7f300c0-f1ef-4151-9bbe-005005aa3747'
  });
};

dwollaService.CreateWebHook = () => {
  var requestBody = {
    url: "http://myawesomeapplication.com/destination",
    secret: "ADKLfXif8yScgOe1W1ftQhHqnQ8DBSUaxz4p2gPdhGVT96jjok",
  };

  appToken
    .post("webhook-subscriptions", requestBody)
    .then((res) => res.headers.get("location")); // => 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'
};
dwollaService.RetrieveWebHook = () => {
  var webhookSubscriptionUrl =
    "https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216";

  appToken.get(webhookSubscriptionUrl).then((res) => res.body.created); // => '2016-04-20T15:49:50.340Z'
};
export default dwollaService;