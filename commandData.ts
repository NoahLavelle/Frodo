import {ConnectFour} from './commands/connectFour';
import {Rps} from './commands/rps';
import {Akinator} from './commands/akinator';

const CommandHandlers = {
	'connectfour': (interaction) => {
		new ConnectFour(interaction);
	},
	'rps': (interaction) => {
		new Rps(interaction);
	},
	'akinator': (interaction) => {
		new Akinator(interaction);
	},
};

namespace CommandData {
    export const connectFourCommandData = {
    	name: 'connectfour',
    	description: 'A game of connect four against another player',
    	options: [
    		{
    			name: 'playertwo',
    			type: 'USER',
    			description: 'The user that you want to challenge',
    			required: true,
    		},
    	],
    };

	export const rpsCommandData = {
		name: 'rps',
		description: 'A game of rock paper scissors four against another player',
		options: [
			{
				name: 'playertwo',
				type: 'USER',
				description: 'The user that you want to challenge',
				required: true,
			},
		],
	};

	export const akinatorCommandData = {
		name: 'akinator',
		description: 'A game of akinator against the AI',
	};
}

export {CommandHandlers, CommandData};