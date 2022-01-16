// import './App.css';
import React, {useMemo, useState, useEffect, useRef} from 'react';
import * as THREE from 'three';
import '@zoralabs/zorb';
import ReactPlayer from "react-player";
import SuperfluidSDK from '@superfluid-finance/js-sdk';
import { Web3Provider } from '@ethersproject/providers';
import axios from 'axios'
// import { NFTPreview } from "@zoralabs/nft-components";
// import { NFTE } from '@nfte/react';
import Host from './Host.js'
import Hls from "hls.js";

let container;
const colors = [0xBB77E2, 0x83E558, 0xDC4392, 0x764ADB, 0xF27E76, 0x2E97EA, 0xC8DE3B];
let camera, scene, renderer;
const obj = [];

init();
animate();

var object

function init() {

  container = document.createElement( "div" );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set( -600, 0, 0 );


  // scene

  scene = new THREE.Scene();

  // Ground
  var groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x6C6C6C
  });
  let plane = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), groundMaterial);
  plane.rotation.y = -Math.PI / 2;
  plane.position.x = 500;
  plane.receiveShadow = true;

  scene.add(plane);

  // LIGHTS
  scene.add(new THREE.AmbientLight(0xFFFFFF));

  var light;

  light = new THREE.DirectionalLight(0xdfebff, 1.75);
  light.position.set(-1000, 0, 0);
  light.position.multiplyScalar(1.3);

  light.intensity = 1;

  light.castShadow = true;
  // light.shadowCameraVisible = true;

  light.shadowMapWidth = 1000;
  light.shadowMapHeight = 1000;

  var d = 500;

  light.shadowCameraLeft = -d;
  light.shadowCameraRight = d;
  light.shadowCameraTop = d;
  light.shadowCameraBottom = -d;

  light.shadowCameraFar = 4000;
  light.shadowDarkness = 0.1;

  scene.add(light);

  var manager = new THREE.LoadingManager();
  
  var group = new THREE.Group();
  scene.add(group);

  while(obj.length < 200){
    var item = new Tetrahedron();
    obj.push(item)
  }

  for (var i = 0; i < obj.length; i++) {
    group.add(obj[i].shape);
  };


  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.setClearColor( 0x000000 , 1 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );
  // controls = new THREE.OrbitControls(camera, document, renderer.domElement);
  window.addEventListener( "resize", onWindowResize, false );

}

function onWindowResize() {

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame( animate );
  render();

}

function render() {
  camera.lookAt( scene.position );
  renderer.render( scene, camera );
  for (var i = 0; i < obj.length; i++) {
      obj[i].animate();
    };
}


function Tetrahedron(){
  this.size = Math.random();

  this.color = colors[Math.floor(Math.random()*colors.length)];

  this.geometry = new THREE.SphereGeometry(10, 32, 32)
  this.material = new THREE.MeshLambertMaterial({color : this.color, shading: THREE.FlatShading});
  this.shape = new THREE.Mesh(this.geometry, this.material);
  this.shape.position.set(Math.floor(Math.random()*150)+300, 0, 0)
  this.circle_rotation = Math.random() * Math.PI * 2;
  this.shape.castShadow = true;
  this.shape.receiveShadow = true;
  this.circle = Math.floor((Math.random() * 100) + 300);

  this.animate = function(){
    this.shape.position.y = Math.sin(this.circle_rotation)*this.circle;
    this.shape.position.z = Math.cos(this.circle_rotation)*this.circle;
    this.shape.rotation.x += this.size*0.05;
    this.shape.rotation.z += this.size*0.1;
    this.circle_rotation+=0.002;
  }
}

// <button className="vote-button">👎</button>
// <button className="vote-button">👍</button>

function Input(props){
  const handleText = (e) => {
    console.log(e.target.value)
    props.setAddress(e.target.value)
  }
  return(
    <div className="address">
      <p>(zorb) address</p>
      <input className="address-input" onChange={handleText}></input>
      <br/>
      <br/>
      <button onClick={() => props.setLoggedIn(true)}>go</button>
    </div>
  )
}

function Zorb(props) {
  return(
    <div className="avi-container">
      <div className="avi">
        <zora-zorb address={props.address}></zora-zorb>
      </div>
    </div>
  )
}

function Streamer(props) {

  const downVote = async () => {
    console.log('down')

    const res = await axios.post('http://localhost:2022/vote', {vote: 0, eth: props.address})
    console.log(res)
  }
  const upVote = async () => {
    console.log('up')

    const res = await axios.post('http://localhost:2022/vote', {vote: 1, eth: props.address})
    console.log(res)
  }

  const trust = async () => {
    console.log('trust')
  }

  return(
    <>
      <div>
        <div className="left-shelf">
          <p>recommended</p>
          <img className="noft" src="https://i.ibb.co/LZW0p9f/Screen-Shot-2022-01-15-at-2-59-52-PM.png" />
        </div>
        <div className="stream-container">
            <VideoPlayer />
        </div>
        <div className="right-shelf">
          <p>showcase</p>
          <img className="noft" src="https://i.ibb.co/rGBHMwK/Screen-Shot-2022-01-15-at-3-00-52-PM.png" />
        </div>
      </div>
      <div className="voting">
        <button className="vote-button" onClick={downVote}>👎</button>
        <button className="vote-button" onClick={trust}>🤝</button>
        <button className="vote-button" onClick={upVote}>👍</button>
      </div>

      <div className="nft-shelf">
        
        
        {/*<NFTPreview
          href="https://zora.co/collections/zora/7438"
          id="7438"
          showBids
          showPerpetual
        />*/}
      </div>
    </>
  )
}
function VideoPlayer() {

  const [protec, setProtec] = useState(false)
  const [project, setProject] = useState('loading...')

  const videoRef = useRef(null);
  const src = "http://localhost:8935/stream/current.m3u8";

  useEffect(async () => {
    if(!protec){
      setInterval(async () => {
        const res = await axios.get('http://localhost:2022/project')
        console.log(res)
        setProject(res.data.project)
        setProtec(true)
      }, 2000)
    }

    let hls;
    if (videoRef.current) {
      const video = videoRef.current;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Some browers (safari and ie edge) support HLS natively
        video.src = src;
      } else if (Hls.isSupported()) {
        // This will run in all other modern browsers
        hls = new Hls({maxLoadingDelay: 10});
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        console.error("This is a legacy browser that doesn't support MSE");
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoRef]);

  return (
    <>
    <p>{project}</p>
    <video
      controls
      ref={videoRef}
      style={{ width: "100%", maxWidth: "1000px", width: '620px'}}
    />
    </>
  );
}

function BannerScroller(props){
  const [loadedProjects, setLoadedProjects] = useState(false)
  const [projects, setProjects] = useState([])
  useEffect(async () => {
    if(!loadedProjects){

      setInterval(async () => {
        const res = await axios.get('http://localhost:2022/projects')
        console.log(res.data.project)
        const projectsRaw = res.data.projects.map((el) => {
          return <div id="scroll-text">{el}&nbsp;| {Math.floor(Math.random() * 100)} 👍&nbsp;&nbsp;</div>
        })

        setProjects(projectsRaw)
      }, 5000)
      setLoadedProjects(true)
    }
  })

  return(
    <>
      <div id="scroll-container">
        {projects}
      </div>
    </>
  )
}

function StreamCreator(props){

  const [triggerState, setTriggerState] = useState('upgrade')
  const [streaming, setStreaming] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const [address, setAddress] = useState('')
  const [userObj, setUserObj] = useState({})
  const [sfObj, setSfObj] = useState({})

  const createSf = async () => {
    console.log('loading')
        const walletAddress = await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
        const sf = new SuperfluidSDK.Framework({
          ethers: new Web3Provider(window.ethereum),
          // tokens: ['fDAI']
        });


        await sf.initialize();
        const user = await sf.user({
          address: walletAddress[0],
          token: '0x59988e47A3503AaFaA0368b9deF095c818Fdca01'
        });

                setAddress(walletAddress[0])
        setSfObj(sf)
        setUserObj(user)

        setInterval(async () => {
          console.log('checking')
        // console.log((await sf.cfa.getAccountFlowInfo({superToken: '0x59988e47A3503AaFaA0368b9deF095c818Fdca01', account: walletAddress[0]})))

        }, 2000)
  }

  useEffect(() => {
    if(!isLoaded){
      try{
        createSf()
        setIsLoaded(true)
      }catch(e){
        console.log(e)
      }
    }
  }, [userObj, sfObj, address])

  const upgrade = async () => {

    // console.log('upgrade')

    // const provider = new Web3Provider(window.ethereum)

    // const sf = await Framework.create({
    //   networkName: "xdai",
    //   provider
    // });

    // const xDai = await sf.loadSuperToken("0x59988e47A3503AaFaA0368b9deF095c818Fdca01");
    // console.log(xDai)
    // const tx = await xDai.upgrade({ amount: '1000000000000000000' });
    // console.log(tx)

    setTriggerState('ready')
  }

  const stream = async () => {
    setTriggerState('streaming')

    const tx = await userObj.flow({
      recipient: '0x74Cf94e2421fc078d79DAE11893b99668449f2C3',
      // flowRate: 385802469135802
      flowRate: '450000000000'
    });

    console.log(tx)
    props.setStreaming(true)
  }

  const cancelStream = async () => {
    setTriggerState('ready')

    props.setStreaming(false)
    const deleteFlowOperation = await userObj.sf.cfa.deleteFlow({
      sender: address,
      receiver: '0x74Cf94e2421fc078d79DAE11893b99668449f2C3',
      superToken: '0x59988e47A3503AaFaA0368b9deF095c818Fdca01'
    });

    console.log(deleteFlowOperation);
  }

  const trigger = (state) => {
    switch(state) {
      case 'upgrade':
        // set upgrade
        console.log('need to update')
        return (<button onClick={upgrade}>upgrade</button>)
        break;
      case 'ready':

        return (<button onClick={stream}>stream</button> )
        break;
      case 'streaming':

        return (<button onClick={cancelStream}>cancel</button> )
        break;
    }
  }

  return(
    <div className="stream-controller">
      <p>
        start streaming @ $5 / hour
        
      </p>
      <p>first upgrade your token, then provide stream</p>
      <div>
        {
          trigger(triggerState)
        }
      </div>
    </div>
  )
}

//0x7d68319fe1DBa8767361b554EaCd16B99f9c6998

function HostButton(props){
  return(
    <div className="host-button-container">
      <button className="host-button" onClick={props.setHost}> 🌞 </button>
    </div>
  )
}
function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [address, setAddress] = useState('0x7d68319fe1DBa8767361b554EaCd16B99f9c6998')
  const [streaming, setStreaming] = useState(false)
  const [isHost, setIsHost] = useState(false)

  const setHost = () => {
    setIsHost(true)
  }
  return (
    <div className="App">
    
      {
        ! isHost ? <HostButton setHost={setIsHost}/> : ''
      }

      {/* zorb */}
      {
        ! loggedIn && ! isHost ? <Input setAddress={setAddress} setLoggedIn={setLoggedIn}/> : <Zorb address={address}/>
      }

      {/* stream controller */}
      {
        loggedIn && ! isHost ? <StreamCreator setStreaming={setStreaming}/> : ''
      }

      {/*streaming widget*/}
      {
        streaming && ! isHost ? <Streamer address={address}/> : ''
      }
      {
        isHost ? <Host /> : ''
      }
      <BannerScroller />
    </div>
  );
}

export default App;
