import React, { Component } from 'react';
import firebase, { auth, provider } from './firebase.js';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null,
    };
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email,
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: '',
    })
  }
  componentDidMount(){
    auth.onAuthStateChanged((user) => {
      if(user)
        this.setState({ user });
    })
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value',snapshot => {
      let items = snapshot.val();
      let newState = [];
      for(let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState,
      })
    })
  }
  removeItem(itemId){
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  login = () => {
    auth.signInWithPopup(provider)
        .then((res) => {
            const user = res.user;
            this.setState({
              user
            })
        })
  }
  logout = () => {
      auth.signOut().then(() => {
          this.setState({
              user: null
          })
      })
  }
  render() {
  return (
    <div className='app'>
      <header>
        <div className="wrapper">
          <h1>Fun Food Friends</h1>
          {this.state.user ?
            <button onClick={this.logout}>Logout</button>
          :
            <button onClick={this.login}>Log In</button>
          }
        </div>
      </header>
      {
        this.state.user?
        <div>
          <div className="user-profile">
            <img src={this.state.user.photoURL} alt={this.state.user.displayName} ></img>
          </div>
          <div className="container">
            <section className="add-item">
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.user.displayName || this.state.user.email}/>
                <input type="text" name="currentItem" placeholder="What are you bringin?" onChange={this.handleChange} value={this.state.currentItem}/>
                <button><i class="fa fa-plus" aria-hidden="true"></i></button>
              </form>
            </section>
            <section className="display-item">
              <div className="wrapper">
                <ul>
                  {
                    this.state.items.map((item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <p>brought by: {item.user}</p>
                          {
                            item.user === this.state.user.displayName || item.user === this.state.user.email ?
                            <button onClick={() => this.removeItem(item.id)}><i class="fa fa-minus  " aria-hidden="true"></i> </button>
                            :
                            ''
                          }
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </section>
          </div>
        </div>
        :
        <div className="wrapper">
          <p>You must be logged in to see the potluck list and submit to it.</p>
        </div>
      }
    </div>
  );
}
}
export default App;
