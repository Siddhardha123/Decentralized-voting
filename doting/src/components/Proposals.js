import { parseName, parseBytes } from '../utils/decode';
import { Button} from '@chakra-ui/react'
const Proposals = ({ proposals, voteProposal }) => {
	return (
		<div>
			<h4>proposal:</h4>{' '}
			{proposals.map((proposal, index) => {
				const name = parseName(parseBytes(proposal.name));
				const voteCount = proposal.voteCount._hex;
				return (
					<div key={index} style={{ padding: '1rem 0' }}>
						🗳 {name} - {Number(voteCount)}
						<Button
						    colorScheme='blue'
							style={{ marginLeft: '2em' }}
							onClick={() => voteProposal(index)}>
							Vote
						</Button>
					</div>
				);
			})}
		</div>
	);
};

export default Proposals;