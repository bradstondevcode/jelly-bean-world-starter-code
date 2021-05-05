# Jellybean World React App Starter code

## Cloundant DB Service Code Snippets


#### Get Worlds

```javascript
function getWorlds(){

	return axios({
		method: 'get',
		url: `${usersDBURL}/worlds/_all_docs`,
		headers: {'Authorization': `Basic ${authKeyEncode}`}
	})

}
```

#### Get World

```javascript
function getWorld(){

	return axios({
		method: 'get',
		url: `${usersDBURL}/worlds/${worldName}`,
		headers: {'Authorization': `Basic ${authKeyEncode}`}
	})

}
```

#### Create World

```javascript
function createWorld(){

	return axios({
		method: 'post',
		url: `${usersDBURL}/worlds`,
		headers: {'Authorization': `Basic ${authKeyEncode}`},
		data: newWorldTemplateData
	})

}
```


#### Delete World

```javascript
function deleteWorld(){

	return axios({
		method: 'delete',
		url: `${usersDBURL}/worlds/${worldName}?rev=${rev}`,
		headers: {'Authorization': `Basic ${authKeyEncode}`},
	})
}
```


#### Update Jellybean Count

```javascript
function updateJellyBeanCount(){
	return axios({
		method: 'put',
		url: `${usersDBURL}/worlds/${worldName}`,
		headers: {'Authorization': `Basic ${authKeyEncode}`},
		data: currentWorldData
	})

}
```