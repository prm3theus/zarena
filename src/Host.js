import React, {useState, useEffect} from 'react'
import axios from 'axios'

function HostController(props){
	const [project, setProject] = useState('loading...')

	useEffect(async () => {
		// get project

		setInterval(async () => {
			const res = await axios.get('http://localhost:2022/project')
			console.log(res)
			setProject(res.data.project)
		}, 5000)
	})

	const advanceClick = async () => {
		console.log('advance')
		const res = await axios.get('http://localhost:2022/project/advance')
		console.log(res)
		setProject(res.data.project)
	}

	return(
		<>
			<p>project cursor</p>
			<p>current: {project}</p>
			<button onClick={advanceClick}>advance</button>
		</>
	)
}

function ProjectInput(props) {
	const [projects, setProjects] = useState([])
	
	const valueChange = (e) => {
		console.log(e.target.value.split(','))
		const rawProjects = e.target.value.split(',')
		setProjects(rawProjects)
	}

	const uploadWetware = async () => {
		const res = await axios.post('http://localhost:2022/projects', {projects: projects})
		console.log(res)
		props.setIsSet(true)
	}
	return(
		<>
			<textarea onChange={valueChange}></textarea>
			<br/>
			<button onClick={uploadWetware}>stage</button>
		</>
	)
}

function Host(){

	// set is set is set is set is yeti, action
	const [isSet, setIsSet] = useState(false)

	return (
		<div className="host">
			<div>host</div>
			{
				! isSet ? <ProjectInput setIsSet={setIsSet}/> : <HostController />
			}
		</div>
	)
}

export default Host;
