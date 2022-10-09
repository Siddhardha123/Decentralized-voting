import './AddVoter.css'
const AddVoter = ({ newVoter, setNewVoter, addNewVoter, newVoterStatus }) => {
	const handleNewVoter = (e) => {
		setNewVoter(e.target.value);
	};
	return (
		<div>
			<h4>Give right to vote</h4>
			<p>(only Owner can give vote right)</p>
			<div className="addvoterdiv">
				<input value={newVoter} onChange={handleNewVoter} />
				<button onClick={addNewVoter}>Give right</button>
			</div>
			{newVoterStatus && <p>Status: {newVoterStatus}</p>}
		</div>
	);
};

export default AddVoter;