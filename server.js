/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs'); //讀取檔案
var path = require('path');//檔案路徑
var express = require('express');//node.js 主要套件
var bodyParser = require('body-parser');//解析http方法
var app = express(); //node.js 實作主要套件

var COMMENTS_FILE = path.join(__dirname, 'comments.json'); //讀取資料夾後把評論放到 comments.json

app.set('port', (process.env.PORT || 3000)); //設定埠號

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) { //中介軟體函數的回呼引數，依慣例，稱為 "next"。
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*'); //接受同源政策

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();//接著做底下的事
});

app.get('/api/comments', function(req, res) { //打路由
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) { //錯誤的話
      console.error(err); //印出錯誤代碼
      process.exit(1); //強制離開
    }
    res.json(JSON.parse(data)); //回應 解析過的json
  });
});

app.post('/api/comments', function(req, res) { //打路由
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {//錯誤的話
      console.error(err); //印出錯誤代碼
      process.exit(1); //強制離開
    }
    var comments = JSON.parse(data);  //回應 解析過的json
    // NOTE: In a real implementation, we would likely rely on a database or
    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    // treat Date.now() as unique-enough for our purposes.
    var newComment = { //把打過的資料存進陣列
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment); //放到comments
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) { //把資料放到 comments.json 
      if (err) {//錯誤的話
        console.error(err);//印出錯誤代碼
        process.exit(1); //強制離開
      }
      res.json(comments);//伺服器回應給前端
    });
  });
});


app.listen(app.get('port'), function() { //最後監聽的埠號,回乎函數
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
