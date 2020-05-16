//import { ask } from 'stdio';

import stdio from 'stdio';


async function main () {
    const name = await ask('What is your name?');
    const age = await ask('How old are you?');
    const gender = await ask('What is your gender?', { options: ['male', 'female'] });
    console.log('Your name is "%s". You are a "%s" "%s" years old.', name, gender, age);
}
 
main()
  .then(() => console.log('Finished'))
  .catch(error => console.warn(error));