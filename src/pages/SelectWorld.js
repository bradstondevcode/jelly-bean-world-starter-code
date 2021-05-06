import React, {Component } from 'react';
import Button from '@material-ui/core/Button';
import { Row, Container } from 'react-bootstrap';
import {getWorlds, createWorld} from '../services/CloudantDBService'
// import {getWorlds, createWorld} from '../services/JellyBeanAPIService' //Node Server Enpoint Service

import {ReactComponent as JellyBeanOverlay} from '../images/JellybeanSiteJellybeanCutout.svg'
import {ReactComponent as JellyBeanLogo} from '../images/JellybeanSiteJellybeanWorldLogo.svg'
import JellyBeanButtonImageYellow from "../images/Bean1Yellow.png";
import JellyBeanButtonImageGreen from "../images/Bean1Green.png";
import JellyBeanButtonImageOrange from "../images/Bean1Orange.png";

let styles = {
	viewContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		justifyContent: 'center',
		backgroundColor: '#212459'
	},
	beanOverlay: {
	    alignSelf: 'center',
	    position: 'absolute',
	    display: 'flex',
	    center: 0,
	    backgroundColor: '#171B3D'
	},
	jellyBeanLogo: {
		alignSelf: 'flex-start',
	    position: 'absolute',
	    display: 'flex',
	    top:'5vw',
	    left:'30vw',
	    width: '25vw',
	    height: '25vh'
	},
	jellyBeanButton: {
	    width: '9vw',
	    height: '6vw',
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
	jellyBeanButtonText: {
		position: 'absolute',
		display: 'flex',
		center: 0,
		fontSize: '1vw',
		fontWeight: 'bold'
	},
	centerButtonRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	}
}

class SelectWorld extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	worlds: [],
	    	totalWorlds: 0
	    };

	}

	async componentDidMount(){

		var propsLocationState = this.props.location.state
		//Mimics Page Refreshing capability (Essentially a routing hack)
		if(propsLocationState){
			if(propsLocationState.refreshPage){
				var worldName = propsLocationState.worldName
				console.log("Reloading" + worldName)
				this.showWorld(worldName)
				
				return
			}

		}

		//Load in world data
		this.loadWorlds()

	}

	async loadWorlds(){

		var requestResponse =  await getWorlds()

		//Check if response is non-null
		if(requestResponse){
			//check if response status is non-null
			if(requestResponse.status){

				if(requestResponse.status == 200){
					this.setState({worlds: requestResponse.data.rows, totalWorlds: requestResponse.data["total_rows"]})
				} else {
					console.log('Response Status ERROR!')
				}

			}else {
				console.log(requestResponse)
				console.log('ERROR! Status is null')
			}

		}else {
			console.log(requestResponse)
			console.log('ERROR! Response is null')
		}

	}

	logoutClicked() {
		this.props.history.push("/")
	}

	showWorld(worldName){
		this.props.history.push('/showWorld', {worldName: worldName});
	}

	refreshPage() {
		//Hack used for refreshing page. Forces a page reload after navigating back to previous page
		this.props.history.push('/', {refreshPage: true});
	}

	async createNewWorld() {
		var requestResponse =  await createWorld(this.state.totalWorlds)
		//Refresh page to reflect newly created world
		this.refreshPage()
	}

	render(){

		return (
			<Container style={styles.viewContainer}>

				<JellyBeanOverlay style={styles.beanOverlay}/>

				<JellyBeanLogo style={styles.jellyBeanLogo}/>

		    	<Row style={styles.centerButtonRow}>

					{this.state.worlds.map((worldData, index) => 
					
			    		<Button key={index} style={{...styles.jellyBeanButton, ...styles.jellyBeanButtonYellow}} onClick={() => this.showWorld(worldData.id)}>
			    			<div style={styles.jellyBeanButtonText}>{worldData.id}</div>
			    		</Button>
					
					)}

				</Row>

				<Row>

					<Button style={{...styles.jellyBeanButton, ...styles.jellyBeanButtonOrange}} onClick={() => this.refreshPage()}>
		    			<div style={styles.jellyBeanButtonText}>Refresh</div>
		    		</Button>


					<Button style={{...styles.jellyBeanButton, ...styles.jellyBeanButtonGreen}} onClick={() => this.createNewWorld()}>
		    			<div style={styles.jellyBeanButtonText}>Create World</div>
		    		</Button>

				</Row>

	    	</Container>
		);
	}
}

export default SelectWorld;