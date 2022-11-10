import {Input,Button} from '@chakra-ui/react'
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
  } from '@chakra-ui/react'
import './check-voter.css'
const CheckVoterAddress = ({
	voterAddressToCheck,
	setVoterAddressToCheck,
	checkAddressVoter,
	voterStatus,
}) => {
	const handleNewAddressToCheckVote = (e) => {
		setVoterAddressToCheck(e.target.value);
	};
    const suc=  <Alert status='success'>
    <AlertIcon />
    account have access to vote
  </Alert>
	const err =  <Alert status='error'>
    <AlertIcon />
    An error has occured
  </Alert>
	return (
		<div>
			<h4>Check if an address have vote status</h4>
			<div className='checkVoter'>
				<Input
					value={voterAddressToCheck}
					onChange={handleNewAddressToCheckVote}
				/>
				<Button onClick={checkAddressVoter}
				colorScheme='blue'>Check right</Button>
			</div>
			{voterStatus !== 'An error has occured' && voterStatus && (
				
				<div style={{ paddingTop: '2em' }}>
					<p>{suc}</p>
					<p>Account: {voterAddressToCheck}</p>
					<p>Voted: {voterStatus?.voted?.toString()}</p>
					<p>Vote Weight: {Number(voterStatus?.weight?._hex)}</p>
				</div>
			)}{' '}
			{voterStatus === 'An error has occured' && <p>{err}</p>}
		</div>
	);
};

export default CheckVoterAddress;