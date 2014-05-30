Expressjs middleware for testing multiple route handlers (think A/B testing). Middleware will round-robin each route handler for a given test, setting a cookie for each new request in order to match the user to the same handler on subsequent requests.

### Installation
```
$ npm install abn
```

### Usage
```javascript
var app = require('express')(),
    ab = require('abn');

//Cookies middlware is required for routes using abn middleware
app.use(require('cookies').express());

var homeAB = ab.test('home');

app.get('/', homeAB(), function (req, res) {
    res.end('home');
});

app.get('/', homeAB(), function (req, res) {
    res.end('home two!');
});

app.get('/', homeAB(), function (req, res) {
    res.end('home three!!!');
});

app.listen(3000);
```

Given the above, the first new user will be returned 'home', the next new user will be returned 'home two!', and the third 'home three!!!'. These users will continue to receive the same response on subsequent requests.