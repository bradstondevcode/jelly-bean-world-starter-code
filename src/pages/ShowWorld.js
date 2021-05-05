import React, {Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Row, Col, Container } from 'react-bootstrap';
import Matter from 'matter-js'
import {createVertexSetFromSVG} from '../services/SVGUtilities'
import MatterWrap from 'matter-wrap'

// import {getWorld, deleteWorld, updateJellyBeanCount} from '../services/CloudantDBService'
import {getWorld, deleteWorld, updateJellyBeanCount} from '../services/JellyBeanAPIService' //Node Server Enpoint Service

import {ReactComponent as JellyBeanLogo} from '../images/JellybeanSiteJellybeanWorldLogo.svg'
import JellyBeanButtonImageYellow from "../images/Bean1Yellow.png";
import JellyBeanButtonImageGreen from "../images/Bean1Green.png";
import JellyBeanButtonImageOrange from "../images/Bean1Orange.png";
import JellyBeanButtonImageGray from "../images/Bean1Gray.png";

var Engine, Render, World, Bodies, Mouse, Common, MouseConstraint, engine, world, render, runner, Runner, Composite = null

var vertexSets = null;

var jellyBeanInterval = null;

let styles = {
	viewContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		justifyContent: 'center',
	},
	titleText:{
		color: 'White',
		fontSize: '4vw',
		fontWeight: 'bold',
		marginBottom: 10,
	},
	beanOverlay: {
	    alignSelf: 'center',
	    position: 'absolute',
	    width: 1100,
	    display: 'flex',
	    center: 0,
	},
	jellyBeanLogo: {
		alignSelf: 'flex-start',
	    position: 'absolute',
	    display: 'flex',
	    top:'2vw',
	    left:'2vw',
	    width: '20vw',
	    height: '20vh'
	},
	physicsViewport: {
		border: '4px solid white'
	},
	jellyBeanButton: {
	    width: '13vw',
	    height: '8vw',
	    backgroundSize: '100% 100%',
     	backgroundPosition: 'center',
     	margin: 10
	},
	jellyBeanButtonYellow:{
		backgroundImage: `url(${JellyBeanButtonImageYellow})`,
	},
	jellyBeanButtonGreen:{
		backgroundImage: `url(${JellyBeanButtonImageGreen})`,
	},
	jellyBeanButtonOrange:{
		backgroundImage: `url(${JellyBeanButtonImageOrange})`,
	},
	jellyBeanButtonGray:{
		backgroundImage: `url(${JellyBeanButtonImageGray})`,
	},
	jellyBeanButtonText: {
		position: 'absolute',
		display: 'flex',
		center: 0,
		fontSize: '1.4vw',
		fontWeight: 'bold'
	},
	bottomButtonRow: {
		display: 'flex',
		alignItems: 'center',
		bottom: 0,
	},

	inputSection:{
		display:'flex',
		flexDirection:'column',
		marginRight: 10,
		padding: 8,
		borderWidth: 3
	},
	inputPrompt: {
		color: 'white'
	},
	inputTextField:{
		width: '5vw',
		paddingLeft: 5,
		backgroundColor: 'white'
	},
	inputButtonRow: {
		marginTop: 10,
		display: 'flex',
		justifyContent: 'center',

	},
	inputSubmitButton:{
		backgroundColor: '#F19648'
	}
}

class ShowWorld extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	worldData: {},
	    	inputtedNumOfJellyBeans: ''
	    };

	}

	async componentDidMount(){

		var propsLocationState = this.props.location.state

		//Get World name from props for retreiving correct world data from DB
		if(propsLocationState){
			var worldName = propsLocationState.worldName
			var worldDoc = await getWorld(worldName)
			this.setState({worldName: worldName, worldData: worldDoc.data}, () => this.showWorld())
		}

	}

	componentWillUnmount(){
		//Lines below clear Matter.js resources from memory
		clearInterval(jellyBeanInterval)
		World.clear(world);
        Render.stop(render);
        Runner.stop(runner)
		render.canvas.remove();
		// render.canvas = null; //Engine Developer recommends this command for memory management. Crashes app when used
		render.context = null;
		render.textures = {};
	}

	newUser(){
		this.props.history.push('/newUser');
	}

	showSelectWorld(){
		this.props.history.push('/selectWorld');
	}

	refreshPage() {
		//Hack used for refreshing page. Forces a page reload after navigating back to previous page. Must retain world Name in order to reload correct world
		this.props.history.push('/selectWorld', {refreshPage: true, worldName: this.state.worldName});
	}

	async deleteWorld(){
		var requestResponse =  await deleteWorld(this.state.worldName)
		//Navigate to show wold screen after delete
		this.showSelectWorld()
	}

	setInputtedNumOfJellyBeans(inputtedNumOfJellyBeans){
		//Set inputtedNumOfJellyBeans in input field
		this.setState({inputtedNumOfJellyBeans: inputtedNumOfJellyBeans})
	}

	async updateJellyBeanCount(){
		//Ensure that there is a value in field before attempting to update jelly bean count in DB
		if(this.state.inputtedNumOfJellyBeans.length > 0){
			var requestResponse =  await updateJellyBeanCount(this.state.worldName, this.state.inputtedNumOfJellyBeans)
			console.log(requestResponse)

			this.refreshPage()
		}
	}

	async showWorld() {

		var {worldData} = this.state

		console.log(worldData.renderOptions)

		//Needed for allowing world wrapping of objects
		Matter.use(MatterWrap)

		Engine = Matter.Engine
  		Render = Matter.Render
		World = Matter.World
		Bodies = Matter.Bodies
		Mouse = Matter.Mouse
		Common = Matter.Common
		MouseConstraint = Matter.MouseConstraint
        Runner = Matter.Runner
        Composite = Matter.Composite
        Bodies = Matter.Bodies
        World = Matter.World

	    engine = Engine.create({
	      // positionIterations: 20
	    });

	    engine.gravity.y = worldData.gravityY;

	    world = engine.world;

	    render = Render.create({
			element: this.refs.scene,
			engine: engine,
			options: worldData.renderOptions
		})

		Render.run(render);

	    runner = Runner.create();
	    Runner.run(runner, engine);

	    //Add Mouse controls for moving bodies
	    var mouse = Mouse.create(render.canvas),
			mouseConstraint = MouseConstraint.create(engine, {
				mouse: mouse,
				constraint: worldData.mouseConstraint
			}
		);

		var bodies = []

		worldData.bodies.map((body, index) => {
			bodies.push(Bodies.rectangle(body.xPos, body.yPos, body.width, body.height, body.options))
		})

		Composite.add(world, bodies);

		World.add(world, mouseConstraint);

	    Matter.Events.on(mouseConstraint, "mousedown", function(event) {
	      // Add code here for actions done on mouse button down (mouse click)
	    });

	    //Get path for jellybean svg asset
	    var jellyBeanSVGPath = './Bean_1_small.svg'

	    //Create the Vertexes needed for rendering jelly bean in scene
	    vertexSets = await createVertexSetFromSVG(jellyBeanSVGPath)

	    //Spawns this number of jellybeans (from DB document)
		var jellyBeansLeftToSpawn = worldData.numberJellyBeans

		//Spawn in JellyBeans at desired rate into scene until total jellybeans are spawned
		jellyBeanInterval = setInterval(
			() => {
				if(jellyBeansLeftToSpawn > 0) {

					var color = Common.choose(worldData.jellyBeanColors);
					var jellyBean = Bodies.fromVertices(Common.random(0, 600), worldData.jellyBeanSpawnY, vertexSets, {
			                    render: {
			                        fillStyle: color,
			                        strokeStyle: color,
			                        lineWidth: 1,

			                    },
			                    restitution: worldData.jellyBeanRestitution,
			                    frictionAir: worldData.jellyBeanFrictionAir,
			                    friction: worldData.jellyBeanFriction
			                }, true)

					Composite.add(world, jellyBean);

					//Add world wrapping to each object (as it is added into the world)
					jellyBean.plugin.wrap = {
			            min: { x: render.bounds.min.x, y: render.bounds.min.y },
			            max: { x: render.bounds.max.x, y: render.bounds.max.y }
			        };

					jellyBeansLeftToSpawn--
				} else{
					//When all bodies are added, clear interval
					clearInterval(jellyBeanInterval)
				}

			}
		, worldData.JellyBeanSpawnRateMS)

	}

	render(){
		var {worldName} = this.state

		return (
			<Container style={styles.viewContainer}>

				<JellyBeanLogo style={styles.jellyBeanLogo}/>

				<div style={styles.titleText}>Welcome to {worldName}</div>

				<div style={styles.physicsViewport} ref="scene" />

				<Col style={styles.inputSection}>

					<div style={styles.inputPrompt}>Enter a number below to change the amount of beans that spawn into the world</div>

					<Row style={styles.inputButtonRow}>
		    			<TextField
		    				style={styles.inputTextField}
		    				id="outlined-basic" 
		    				type="number" 
		    				value={this.state.inputtedNumOfJellyBeans} 
			    			onChange={(event) => this.setInputtedNumOfJellyBeans(event.target.value)}
			    			onKeyPress= {(event) => {
					            if (event.key === 'Enter') {
					              console.log('Enter key pressed');
					              this.updateJellyBeanCount()
					            }
						    }}
						    InputProps={{ disableUnderline: true }}
	    				/>

		    			<Button style={styles.inputSubmitButton} 
		    				onClick={() => this.updateJellyBeanCount()}>
		    					Submit
						</Button>

					</Row>

	    		</Col>

		    	<Row style={styles.bottomButtonRow}>

		    		<Button style={{...styles.jellyBeanButton, ...styles.jellyBeanButtonOrange}} onClick={() => this.refreshPage()}>
		    			<div style={styles.jellyBeanButtonText}>Refresh</div>
		    		</Button>

		    		<Button style={{...styles.jellyBeanButton, ...styles.jellyBeanButtonYellow}} onClick={() => this.showSelectWorld()}>
		    			<div style={styles.jellyBeanButtonText}>Go Back</div>
		    		</Button>

		    		<Button style={{...styles.jellyBeanButton, ...styles.jellyBeanButtonGray}} onClick={() => this.deleteWorld()}>
		    			<div style={styles.jellyBeanButtonText}>Delete World</div>
		    		</Button>

		    	</Row>		    	

	    	</Container>
		);
	}
}

export default ShowWorld;