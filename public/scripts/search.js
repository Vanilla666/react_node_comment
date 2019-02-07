var FilteredList = React.createClass({ //主要物件
    filterList: function(event){ //主要函數
      var updatedList = this.state.initialItems;//去拿初始化陣列(要收尋的對象)
      updatedList = updatedList.filter(function(item){ //filter 遍歷每個元素，回傳 true 時，目前的值會保留在陣列內，這會回傳一個新陣列，而不是修改原本的陣列
        return item.toLowerCase().search( //itema每個對象  toLowerCase()字串變小寫 search() 去作收尋
          event.target.value.toLowerCase()) !== -1; // event.target.value使用者所輸入的對象 !== -1 等於有找到符合對象
      });
      this.setState({items: updatedList});//就把符合的對象放到item
    },
    getInitialState: function(){ //組件初始化
       return {//初始陣列放要收尋的對象
         initialItems: [
           "Apples",
           "Broccoli",
           "Chicken",
           "Duck",
           "Eggs",
           "Fish",
           "Granola",
           "Hash Browns"
         ],
         items: [] //放收尋符合的
       }
    },
    componentWillMount: function(){ //組件即將掛載
      this.setState({items: this.state.initialItems}) //變更屬性 放符合的資料到items陣列
    },
    render: function(){
      return (
        <div className="filter-list">
          <form>
          <fieldset className="form-group">
          <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>  {/* 當按下觸發filterList函數 */}
           </fieldset>
          </form>
        <List items={this.state.items}/> {/* 動態更新介面 拿items資料 */}
        </div>
      );
    }
  });
  
  var List = React.createClass({
    render: function(){
      return (
        <ul className="list-group">
        {
          this.props.items.map(function(item) { //迭代 每個items資料(已經經過收尋條件的)
            return <li className="list-group-item" data-category={item} key={item}>{item}</li> //利用HTML 5，可以為元素添加data-*屬性，從而存儲自定義信息 key 要有獨特值 {item}印出最後符合的資料
          })
         }
        </ul>
      )  
    }
  });
  
  ReactDOM.render(<FilteredList/>, document.getElementById('content')); //收尋視窗,掛載到 div "content"