import React, { Component } from 'react';
import Navigation from "./components/navigation/navigation";
import Logo from "./components/logo/logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import Particles from 'react-particles-js';
// import Clarifai from 'clarifai';
import './App.css';
import "tachyons";

const particle = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 675,
      }
    },
    line_linked: {
      shadow: {
        // enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calcFaceLoc = (data) =>{
    const image = document.getElementById("imputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height)
    }
  }

  displayFace = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (eve) => {
    this.setState({input: eve.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log)
      }
      this.displayFace(this.calcFaceLoc(response.outputs[0].data.regions[0].region_info.bounding_box));
    }
  )
  .catch(error => console.log(error));
}

onRouteChange = (value) => {
  if (value==="signout"){
    this.setState(initialState);
  } else if (value==="home"){
    this.setState({isSignedIn: true});
  }
  this.setState({route: value});
}

render() {
  return (
    <div className="App">
      <Particles className="particles"
        params={particle}
      />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      {this.state.route === "home"
      ? <div>
        <Logo />
        <Rank
          name={this.state.user.name}
          entries={this.state.user.entries}
        />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onSubmit={this.onSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
      :(
        this.state.route === "signin"
        ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )
    }
  </div>
);
}
}

export default App;
