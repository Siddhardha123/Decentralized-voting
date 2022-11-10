import './AddVoter.css'
import {Input,Button} from '@chakra-ui/react'
const AddVoter = ({ newVoter, setNewVoter, addNewVoter, newVoterStatus }) => {
	const handleNewVoter = (e) => {
		setNewVoter(e.target.value);
	};
	return (
		<div>
			<h4>Give right to vote</h4>
			<p>(only Owner can give vote right)</p>
			<div className="addvoterdiv">
				<Input value={newVoter} onChange={handleNewVoter} />
				<Button onClick={addNewVoter}
				        colorScheme='blue'
				 >Give right</Button>
			</div>
			{newVoterStatus && <p>Status: {newVoterStatus}</p>}
		</div>
	);
};

export default AddVoter;