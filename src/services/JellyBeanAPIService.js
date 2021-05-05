import axios from 'axios'
import WorldTemplate from '../data/WorldTemplate.json'

//URL for Node API Server that manages Cloudand API calls(6 - Add Code Here)
const apiServerBaseURL = ''

//Get all Worlds data
export async function getWorlds(){

	return await axios.get(`${apiServerBaseURL}/getWorlds`,{},{
		headers:{
			"Access-Control-Allow-Origin": "*"
		}
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

//Get specific World
export async function getWorld(worldName){

	return await axios.post(`${apiServerBaseURL}/getWorld`,
		{
			worldName: worldName
		}
	)
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

//Create Template World Document in Cloudant DB
export async function createWorld(numOfWorlds){

	var newWorldTemplateData = WorldTemplate

	newWorldTemplateData["_id"] = `World ${numOfWorlds + 1}`

	return await axios.post(`${apiServerBaseURL}/createWorld`,
		{
			newWorldTemplateData: newWorldTemplateData
		}
	)
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

	return await axios.post(`${apiServerBaseURL}/deleteWorld`,
		{
			worldName: worldName,
			rev: rev
		}
	)
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

	var updatedWorldData = requestResponse.data


	updatedWorldData.numberJellyBeans = numOfJellyBeans

	return await axios.post(`${apiServerBaseURL}/updateJellyBeanCount`,
		{
			updatedWorldData: updatedWorldData,
		}
	)
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