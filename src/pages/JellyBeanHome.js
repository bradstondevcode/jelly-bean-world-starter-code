import React, {Component } from 'react';
import Button from '@material-ui/core/Button';
import { Row, Container } from 'react-bootstrap';
import Matter from 'matter-js'
import {createVertexSetFromSVG} from '../services/SVGUtilities'
import MatterWrap from 'matter-wrap'
import {ReactComponent as JellyBeanLogo} from '../images/JellybeanSiteJellybeanWorldLogo.svg'
import {ReactComponent as JellyBeanButton} from '../images/Bean_1.svg'

var Engine, Render, World, Bodies, Mouse, Common, MouseConstraint, engine, world, render, runner, Runner, Composite = null

var vertexSets = null;

var jellyBeanInterval = null

let styles = {
	viewContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		justifyContent: 'center',
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
		marginTop: '5vh',
		border: '4px solid white'
	},
	jellyBeanButton: {
	    width: '15vw',
	    fill: 'red',
	    stroke: 'green'
	},
	jellyBeanButtonText: {
		position: 'absolute',
		display: 'flex',
		center: 0,
		fontSize: '1.5vw',
		fontWeight: 'bold'
	},
	bottomButtonRow: {
		display: 'flex',
		bottom: 0,
	},
	credits: {
		position: 'absolute',
		fontSize: '1.5vw',
		textAlign: 'center',
		bottom: '3vw',
		right: '3vw',
		color: '#E6E6E6'
	}
}

class JellyBeanHome extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    };

	}

	async componentDidMount(){

		var propsLocationState = this.props.location.state
		//Mimics Page Refreshing capability (Essentially a routing hack)
		if(propsLocationState){
			if(propsLocationState.refreshPage){
				this.startGame()
				return
			}

		}

		this.showJar()
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

	startGame(){
		this.props.history.push('/selectWorld');
	}

	async showJar() {

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

	    world = engine.world;

	    render = Render.create({
			element: this.refs.scene,
			engine: engine,
			options: {
				width: 600,
				height: 600,
				wireframes: false
			}
		})

		Render.run(render);

    	// create runner
	    runner = Runner.create();
	    Runner.run(runner, engine);

	    // add mouse control
	    var mouse = Mouse.create(render.canvas),
			mouseConstraint = MouseConstraint.create(engine, {
				mouse: mouse,
				constraint: {
				  stiffness: 0.2,
				  render: {
				    visible: false
				  }
				}
			}
		);

		//Create static bodies in scene
		Composite.add(world, [
	        Bodies.rectangle(0, 0, 250, 20, { isStatic: true, angle: Math.PI * 0.25, render: { fillStyle: '#84827B' } }),
	        Bodies.rectangle(175, 175, 150, 20, { isStatic: true, angle: Math.PI * 0.25, render: { fillStyle: '#84827B' } }),

	        Bodies.rectangle(600, 0, 250, 20, { isStatic: true, angle: -Math.PI * 0.25, render: { fillStyle: '#84827B' } }),
	        Bodies.rectangle(425, 175, 150, 20, { isStatic: true, angle: -Math.PI * 0.25, render: { fillStyle: '#84827B' } }),

	        Bodies.rectangle(400, 475, 300, 15, { isStatic: true, angle: Math.PI * 0.32, render: { fillStyle: '#84827B' } }),
	        Bodies.rectangle(200, 475, 300, 15, { isStatic: true, angle: -Math.PI * 0.32, render: { fillStyle: '#84827B' } }),

	        Bodies.rectangle(350, 550, 80, 20, { isStatic: true, angle: Math.PI * 0.25, render: { fillStyle: '#84827B' } }),
	        Bodies.rectangle(250, 550, 80, 20, { isStatic: true, angle: -Math.PI * 0.25, render: { fillStyle: '#84827B' } }),

	        Bodies.rectangle(325, 100, 80, 20, { isStatic: true, angle: Math.PI * 0.25, render: { fillStyle: '#84827B' } }),
	        Bodies.rectangle(275, 100, 80, 20, { isStatic: true, angle: -Math.PI * 0.25, render: { fillStyle: '#84827B' } }),
	    ]);


		World.add(world, mouseConstraint);

	    Matter.Events.on(mouseConstraint, "mousedown", function(event) {
	      // World.add(engine.world, Bodies.circle(150, 50, 10, { restitution: 1.0,}));
	    });

	    //Get path for jellybean svg asset
	    var jellyBeanSVGPath = './Bean_1_small.svg'

	    //Create the Vertexes needed for rendering jelly bean in scene
	    vertexSets = await createVertexSetFromSVG(jellyBeanSVGPath)

	    //Spawns this number of jellybeans
		var jellyBeansLeftToSpawn = 40

		//Spawn in JellyBeans at desired rate into scene until total jellybeans are spawned
		jellyBeanInterval = setInterval(
			() => {
				if(jellyBeansLeftToSpawn > 0) {

					var color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
					var jellyBean = Bodies.fromVertices(Common.random(0, 600), -50, vertexSets, {
			                    render: {
			                        fillStyle: color,
			                        strokeStyle: color,
			                        lineWidth: 1,

			                    },
			                    restitution: 0.7,
			                    frictionAir: 0.05,
			                    friction: 0
			                }, true)

					Composite.add(world, jellyBean);

					//Add world wrapping to each object ( as it is added into the world)
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
		, 1000)

	}

	render(){

		return (
			<Container style={styles.viewContainer}>

				<JellyBeanLogo style={styles.jellyBeanLogo}/>

				<div style={styles.physicsViewport} ref="scene" />

		    	<Row style={styles.bottomButtonRow}>
		    		<Button style={styles.jellyBeanButton} onClick={() => this.startGame()}>
		    			<JellyBeanButton/>
		    			<div style={styles.jellyBeanButtonText}>Start Game</div>
		    		</Button>
		    	</Row>

		    	<Container style={styles.credits}>
		            <Row>
			            Visual Design by
		            </Row>
		            <Row>
			            <a href="https://www.linkedin.com/in/kyle-smith-67393b80/">
			              Kyle Smith
			            </a>
		            </Row>
	            
	          </Container>

	    	</Container>
		);
	}
}

export default JellyBeanHome;