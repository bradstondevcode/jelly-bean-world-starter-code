import axios from 'axios'
import WorldTemplate from '../data/WorldTemplate.json'
import { encode } from 'js-base64';

//Using environemntal variables embedded in React build
const usersDBURL = process.env.REACT_APP_CLOUDANT_URL
const username = process.env.REACT_APP_CLOUDANT_USERNAME
const password = process.env.REACT_APP_CLOUDANT_PASSWORD

//Base64 Encoded username password creates authkey
const authKeyEncode = encode(`${username}:${password}`)

//Get all Worlds data
export async function getWorlds(){

	return axios({
		//1 - Add Code Here
	})
		.catch(function (error){
			console.log(error)
			if (error.response) {
		      // Server error response
		      console.log("Error Response")
		      return error.response
		    } else if (error.request) {
		      // No response from server
		      console.log("Error Request")
		      return error.request
		    } else {
		      // Some other error
		      console.log("Error Message")
		      return error.message
		    }
		})
}

//Get specific World
export async function getWorld(worldName){
	return axios({
		//2 - Add Code Here
	})
		.catch(function (error){
			console.log(error)
			if (error.response) {
		      // Server error response
		      console.log("Error Response")
		      return error.response
		    } else if (error.request) {
		      // No response from server
		      console.log("Error Request")
		      return error.request
		    } else {
		      // Some other error
		      console.log("Error Message")
		      return error.message
		    }
		})
}

//Create Template World Document in Cloudant DB
export async function createWorld(numOfWorlds){

	var newWorldTemplateData = WorldTemplate

	//Auto generate a world name based on number of existing worlds
	//TODO: Change logic. Fundamentally flawed
	newWorldTemplateData["_id"] = `World ${numOfWorlds + 1}`

	return axios({
		//3 - Add Code Here
	})
		.catch(function (error){
			if (error.response) {
		      // Server error response
		      return error.response
		    } else if (error.request) {
		      // No response from server
		      return error.request
		    } else {
		      // Some other error
		      return error.message
		    }
		})

}

//Delete world document from Cloudant DB
export async function deleteWorld(worldName){

	var requestResponse = await getWorld(worldName)

	var currentWorldData = requestResponse.data

	var rev = currentWorldData['_rev']

	return axios({
		//4 - Add Code Here
	})
		.catch(function (error){
			if (error.response) {
		      // Server error response
		      return error.response
		    } else if (error.request) {
		      // No response from server
		      return error.request
		    } else {
		      // Some other error
		      return error.message
		    }
		})

}

//Update world document with new jellybean count
export async function updateJellyBeanCount(worldName, numOfJellyBeans){

	var requestResponse = await getWorld(worldName)

	var currentWorldData = requestResponse.data


	currentWorldData.numberJellyBeans = numOfJellyBeans


	return axios({
		//5 - Add Code Here 
	})
		.catch(function (error){
			if (error.response) {
		      // Server error response
		      return error.response
		    } else if (error.request) {
		      // No response from server
		      return error.request
		    } else {
		      // Some other error
		      return error.message
		    }
		})
}