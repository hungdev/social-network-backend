
Start DB:
```
mongod --port 27017 --dbpath /Users/cee/Desktop/TeachRN/social/social/database
```
Connect DB:
```
mongo --port 27017 -u "hungvu" -p "vuhung" --authenticationDatabase "socialMongoDB"
```

lsof -i :27017

kill -9 [process]

===================================================
* Start

npm i -s express-generater -g
express --view=ejs Blog
edit to 
```
  "scripts": {
    "start": "nodemon ./bin/www --exec babel-node"
  },
```

npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/node nodemon

 create .babelrc file and write down:

```
{
  "presets": [
    "@babel/preset-env"
  ]
}

```
npm i
npm start

tab server Start DB:
mongod --port 27017 --dbpath /Users/cee/Desktop/Blog/Blog/database

client tab: 
mongo --port 27017

use socialMongoDB        (sử dụng mới)

db.createUser({
  user: "hungvu",
  pwd: "vuhung",
  roles: ["readWrite", "dbAdmin", "dbOwner"]
})



tab server: 

> tắt server để đăng nhập lại ở tab server dùng phím control + c

và gõ lệnh:

mongod --auth --port 27017 --dbpath /Users/cee/Desktop/TeachRN/social/social/database

tab client:
command + c

mongo --port 27017 -u "hungvu" -p "vuhung" --authenticationDatabase "socialMongoDB"

use socialMongoDB

show collections