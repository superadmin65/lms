let wasWere = `It *was* very hot yesterday.
*Were* you angry yesterday?
I *was* having fun at the park.
Where *were* you?
Why *were* you crying?
They *were* drinking water.
I *was* winning the race!
Where *were* you going?
I *was* so happy yesterday!
When *were* you at the park?
They *were* going to zoo.
Why *was* your brother sad?`;

let isAre = `Anil *is* swimming in the pool.
The school bell *is* ringing.
I *am* Anil.
Ships *are* sailing in the sea.
I *am* not a rabbit.
Birds *are* flying in the sky.
We *are* happy.
Raju and Anil *are* friends.
These children *are* playing in the garden.
The tiger *is* feeling hungry.
I *am* not an idiot.
This *is* a lotus flower.`;

//Fill in the blanks with the correct word given in bracket. (Homonyms)

let homonyms = `I am not *allowed (aloud) * to drink soda. 
My *aunt (ant) * bought me a new bike! 
I was so hungry. I *ate (eight) * my entire dinner. 
I got a new bat and *ball (bowl) * last week. 
What do you want to *be (bee)*  when you grow up? 
Eat that last green *bean (been)* on your plate. 
I *beat (beet) * you in the race. I was first. 
I have a teddy *bear (bare)* at home. 
I was stung by a *bee (be) *. 
Where have you *been (bean) * all this time? `;

let prepositions = `The key is *on (near, by) * the table. 
The fish is *inside  (outside, on) * the bowl.
I gave a present *to (for, by) * my mother. 
The cat is sitting *under (over, inside) * the table. 
Pick the flowers *from  ( to, by) * the plant.
Arrange your books *in (on, by) * your book shelf. 
The lion lives *in (on, near) * the forest. 
We go to school *by (on, to) * bus. 
The sun is *above (below, over) * the clouds. 
Be careful *with (in, on) * the glasses.`;

let passage1 = `John wanted to read *a (an, the)* comic book. *He (She, It) * went to the library. But *the (a, an)* library was closed.
*I (He, We) * am eight years old. John *is (are, am) * my friend. *He (She, It)* is also eight years old. *We (Us, Me)* go to school together.
Today, a group of dogs barked at *us (we, he)*. *We (He, She)* ran fast. 
*They (Them, We)* chased us. *We (Me, Us)*  climbed a tree to escape from *them (us, him)*. `;

let article = `Picasso was *an* artist.
He is *an* honest man.
I study at *a* small university in London.
We used to live in *the* city centre.
Are you *a* teacher?
It takes me *an* hour to get to work.
My cousin is *a* surgeon.
It looks like it's going to rain. Do you have *an* umbrella?
I have *a* one year old daughter.
Singer Justin comes from *an* ordinary family.
These days Angel enjoys *the* life of *a* Hollywood film star.
My brother lives in *an* apartment in *the* city centre.
School children in *the* UK have to wear *a* uniform.
Is there *a* petrol station near here?
It is very near here. Go straight on and it is on *the* left.
Is France *a* European country?
I've got *a* spare ticket for tonight's program. Do you want to come?
Simon phoned *the* police.
Do you want to go to *the* cinema tonight?
I am reading *a* really good book.`;

let question1 = `*What* is your name?
*Where* is your house?
*What* do you want?
*Why* are you crying?
*Where* is your book?
*What* is your age?
*Why* did you come late?
*Where* is he sitting?
*What* is the time now?
*Why* are you standing here?`;

export default {
  'was-were': {
    text: wasWere,
    options: 'was, were'
  },
  'is-am-are': {
    text: isAre,
    options: 'is, are, am'
  },
  article: {
    text: article,
    options: 'a, an, the'
  },
  homonyms: {
    text: homonyms
  },
  passage1: {
    text: passage1
  },
  question1: {
    text: question1,
    options: 'What, Where, Why'
  },
  prepositions: {
    text: prepositions,
    qText: 'Click on the blanks and select the most suitable  preposition.'
  }
};
