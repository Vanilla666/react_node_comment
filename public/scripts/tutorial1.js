
var CommentBox = React.createClass({ //創建一個 react 組件 CommentBox

    loadCommentsFromServer: function () {
        $.ajax({ //用 jq ajax 打內部路由拿資料 
            url: this.props.url, //this.props.url鳩收外部輸入 url="/api/comments"
            dataType: 'json', //炫覽資料格式
            cache: false, //是否要暫存
            success: function (data) {//成功時把拿到的資料印出
                console.log(data);
                this.setState({ data: data });// 更新資料 key :value
            }.bind(this), //綁定到CommentBox這個物件 
            error: function (xhr, status, err) { //失敗時印出錯誤資訊
                console.error(this.props.url, status, err.toString());
            }.bind(this)  //綁定到CommentBox這個物件  
        });
    },

    handleCommentSubmit: function (comment) { // comment =  this.props.onCommentSubmit({ author: author, text: text }) 把資料打包成json 傳回給父組件
        var comments = this.state.data; //獲得更新現在資料
        var newComments = comments.concat([comment]); //把資料放到newComments陣列
        this.setState({ data: newComments }); //動態更新 data :資料放到newComments陣列
        $.ajax({ //用 jq ajax 打內部路由拿資料 
            url: this.props.url, //this.props.url鳩收外部輸入 url="/api/comments"
            dataType: 'json',  //炫覽資料格式
            type: 'POST', //傳送方式post 
            data: comment,//傳遞打包好的json格式資料
            success: function (data) {//成功時把拿到的資料印出
                console.log(data);
                this.setState({ cc: data }); // 更新資料 key :value
            }.bind(this), //綁定到CommentBox這個物件 
            error: function (xhr, status, err) { //失敗時印出錯誤資訊
                console.error(this.props.url, status, err.toString());
            }.bind(this)  //綁定到CommentBox這個物件 
        });
    },

    getInitialState: function () { //getInitialState() 在生命週期裡只執行一次，並設置組件的初始狀態 
        return { data: [] }; //一開始資料為空陣列
    },
    componentDidMount: function () { //componentDidMount是一個當組件被渲染時被React自動調用的方法
        this.loadCommentsFromServer(); //一開始就先調用避免一開始沒資料
        setInterval(this.loadCommentsFromServer, this.props.pollInterval); //異步調用函數 (調用函數,每2秒) 
    },
    render: function () { //炫覽
        // var _data = this.props.data_comment; // this.props.data_comment 接收外來輸入的屬性
        // console.log(_data); //印出資料
        return ( //返回的炫覽
            <div className="commentBox"> {/* className 套用的CSS */}
                <h1>Comments</h1>
                <CommentList data={this.state.data} /> {/* 自定義xx屬性 {this.props.data_comment}放資料傳遞過去 自定義好後就可以使用自訂義組件 */}
                <CommentForm onCommentSubmit={this.handleCommentSubmit} /> {/* 傳遞一個新的回調函數（handleCommentSubmit）到子組件完成這件事，綁定它到子組件的onCommentSubmit事件上。無論事件什麼時候觸發，回調函數都將被調用 */}
            </div>
        );
    }
});

var CommentList = React.createClass({ //創建一個 react 組件 CommentList
    render: function () {
        var commentNodes = this.props.data.map(function (comment, i) { //迭代每個接收的數據,做回乎函數 comment 指的是接收的數據this.props.data_comment i指的是索引值
            return (
                <Comment key={i} author={comment.author}> {/* author 屬性 接收迭代屬性 */}
                    {comment.text} {/* text 屬性 接收迭代屬性 */}
                </Comment>
            );
        });
        return ( // 最後把資料拿到後印出
            <div className="commentList">
                {commentNodes} {/* 最後印出迭代每個資料 */}
            </div>
        );
    }
});

var CommentForm = React.createClass({ //創建一個 react 組件 CommentForm

    getInitialState: function () { //getInitialState() 在生命週期裡只執行一次，並設置組件的初始狀態 
        return { author: '', text: '' };
    },
    handleAuthorChange: function (e) { //e 當下物件觸發的這件事
        this.setState({ author: e.target.value }); //物件內部屬性 State 當有輸入時 放入到 author
    },
    handleTextChange: function (e) { //e 當下物件觸發的這件事
        this.setState({ text: e.target.value });  //物件內部屬性 State 當有輸入時 放入到 text
    },
    handleSubmit: function (e) { //處理提交事件
        e.preventDefault(); //避免畫面跳轉
        var author = this.state.author; // 從組件獲取真實DOM的節點，這時就要用到React.findDOMNode this.refs.[refName] 就指向這個虛擬DOM 的子節點，最後通過React.findDOMNode 方法獲取真實DOM 的節點
        var text = this.state.text;// 從組件獲取真實DOM的節點，這時就要用到React.findDOMNode this.refs.[refName] 就指向這個虛擬DOM 的子節點，最後通過React.findDOMNode 方法獲取真實DOM 的節點
        if (!text || !author) { //如果有一個不存在
            return; //就跳離
        }
        // TODO: send request to the server
        this.props.onCommentSubmit({ author: author, text: text }); //處理外部 (this.props.on)CommentSubmit事件 把資料打包成json 傳回給父組件
        this.state.author.trim();  //清空輸入有空白
        this.state.text.trim();  //清空輸入有空白
        this.setState({ author: '', text: '' }); //清空輸入
        return;
    },
    render: function () { //炫覽
        return ( //返回的炫覽
            <form className="commentForm" onSubmit={this.handleSubmit}> {/* className 套用的CSS */}
                <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />  {/* 輸入的名字  ref="author" 讓虛擬DOM可以獲得實際DOM的值*/}
                <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} />  {/* 輸入的評論 ref="text" 讓虛擬DOM可以獲得實際DOM的值 */}
                <input type="submit" value="Post" /> {/* 繳交方式 post */}
            </form>
        );
    }
});

var Comment = React.createClass({ //創建一個 react 組件 Comment
    render: function () {//炫覽
        return (//返回的炫覽
            <div className="comment"> {/* 從父級傳來的數據在子組件裡作為'屬性'可供使用。這些'屬性'可以通過this.props訪問。 */}
                <h2 className="commentAuthor">
                    {this.props.author} {/* 我們以this.props.author訪問傳遞給組件的命名屬性  this.props.author定義屬性後等待外部輸入之後炫覽出來*/}
                </h2>
                {marked(this.props.children.toString())} {/* 以this.props.children訪問任何嵌套的元素   toString()為了使markdown 理解的原始字符串*/}
            </div>
        );
    }
});

ReactDOM.render( //炫覽的 react 元件
    <CommentBox url="/api/comments" pollInterval={2000} />, //  自訂義屬性data_comment,pollInterval {data} {放表達式或React組件} {2000}每2秒
    document.getElementById('content') //放在 div id=content
);

//React 中都是關於模塊化、可組裝的組件。以我們的評論框為例，我們將有如下的組件結構：
//    - CommentBox
//   - CommentList
//     - Comment
//   - CommentForm