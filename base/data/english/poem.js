import forthGradePoem from './level4/poems';

let data = [
  {
    title: 'Run Chicken Run',
    text: `Run chicken run.
The farmer got the gun
The wife has the oven hot
And you are the one.
So run and run
So you will not be served
As my dinner today.
`
  },
  {
    title: 'Friend',
    author: 'Hannah',
    text: `You and I are friends
You laugh, I laugh
You cry, I cry
You scream, I scream
You run, I run
You jump, I jump
You jump off a bridge,
I'm going to miss you buddy.
`
  },
  {
    title: 'Chameleons',
    author: 'Kalai Selvi',
    text: `Chameleons on the neem tree
They are red
They are orange
Then, they are green
They are changing colours
What colour can you see?
Look at it
And tell me now.
`
  },
  {
    title: 'Friends',
    author: 'Kalai Selvi',
    text: `Make new friends
But keep the old.
One is silver
And the other is gold
A circle is round
And has no end.
That is how long,
I will be your friend.
Across the land
Across the sea
Friends forever,
We will always be!
`
  },
  {
    title: 'My Puppy',
    author: 'Kalai Selvi',
    text: `My little puppy 
lives near my door
He loves to jump
and runs around
He licks me now
He wags his tail with love.
When I throw the ball for him
He will pick and give it to me.
Ten or twenty or thirty
He never feels tired
to pick it for me.
`
  },
  {
    title: 'Kites',
    author: 'Kalai Selvi',
    text: `Red kites, blue kites
Flying by
Yellow kites, green kites
Sailing in the sky 
They fly high 
They fly low
Up in the clear blue sky
Their tails sway 
Here and there
Slowly, and slowly
They rise above the sky
They smile at the birds
Who flew nearby.
`
  },
  {
    title: 'Trees',
    author: 'Kalai Selvi',
    text: `Trees short, Trees tall
Trees large, trees small
Neem tree
Peepal tree
Banyan tree
Coconut tree
Mango tree
whatever tree I see
they are homes
For birds and bees!
Trees sway 
this way and that way
to cool and clean the air. 
`
  },
  {
    title: 'Sparrows',
    author: 'Kalai Selvi',
    text: `Little, little, sparrows
Flying here and there 
They talk and talk
Some happy talk
Do you want to know
What do they talk?
Come and watch here
they come together
To check their little house
built near my window.
`
  },
  {
    title: ' Spider on the way',
    author: 'Kalai Selvi',
    text: `A cute small spider
Walking on eight legs
Search for its prey
Waiting for hours
For a fly 
To be there
Small, small flies
So tasty to eat
The spider’s treat
`
  },
  {
    title: 'A Rainbow',
    author: 'Kalai Selvi',
    text: `On the evening sky
When cool wind blow
There came a rainbow
A bridge across the sky
Connecting two sides
Violet, indigo, blue, green
Yellow, orange, red
seven colours to count
`
  },
  {
    title: 'Full Moon',
    author: 'Kalai Selvi',
    text: `Look at the full moon
That brings a boon
With a little star
Shining below
Silver rays shine
Bright and white
`
  },
  {
    title: 'My Earth',
    author: 'Kalai Selvi',
    text: `Beautiful with blue sky
Sun shines in the day
When Moon comes in night
It makes dark sky bright
Green leaves on trees
Sway slowly in the breeze
Blades of grass on the way
Wants me to walk away
Every step as I walk
Must save every little thing.
`
  },
  {
    title: 'Thank You',
    author: 'Kalai Selvi',
    text: `Now and then
Learn to tell
“Thank you” 
Be thankful
For everything here
That makes your life
Good and fair!
`
  },
  {
    title: 'Help',
    author: 'Kalai Selvi',
    text: `Help her
Help him
Help an ant
Help a cat
Help a sheep
Help a crow
Help a pigeon
Whatever it may be
Learn to help
A person or a bird 
Or an animal
That is in need!
`
  },
  {
    title: 'Wash, Wash',
    author: 'Kalai Selvi',
    text: `Wash, wash, wash
Remember to wash
Both your hands
Before you eat
After you eat
Before you drink
Before you touch
Anything you get
Anything you give
Better to wash again
Again and again
To get rid of dust.
`
  },
  {
    title: 'A Cup of Water',
    author: 'Kalai Selvi',
    text: `Drink your cup of water
every time you feel
thirsty and dry!
Drops of water
builds life in you!
`
  },
  {
    title: 'Walk, Walk',
    author: 'Kalai Selvi',
    text: `It is your time
To walk, walk, walk
Stretch your legs
And your hands now
Allow your bones
To feel healthy
And strong always
`
  },
  {
    title: 'On the wall',
    author: 'Kalai Selvi',
    text: `A cute little lizard
Crawls on the wall
Above my head
Near the ceiling fan
Slowly, and slowly
It walks to catch
A tasty food to eat
For the morning breakfast
When I am not at home
It roams around free
Jumping on the chairs
Crawling on my desk
It even tries 
To open my book
A cute little lizard
For he thinks 
He is at home
And we live with him.
`
  },
  {
    title: 'Smile',
    author: 'Kalai Selvi',
    text: `It takes only seconds
To smile and smile
A smile can cross miles
Reaching anyone
To be your friend
Smile, smile, smile
For it can help you
To be your best!
`
  },
  {
    title: 'On my stairs',
    author: 'Kalai Selvi',
    text: `Hurry, hurry, hurry
A line of ants on the way
On the stairs
On the door
On the floor
They move very fast
To their nest -
Tiny bits of food
In their tiny mouths
Not looking around
Tiny little ants
March their way
Not talking or stopping
To store in their nest
Food for rainy days.
`
  },
  {
    title: 'Listen',
    author: 'Kalai Selvi',
    text: `Listen now dear
What your heart 
Tells you to do
Do it with love
Be it a drawing
Be it a play
Do what you want
To be your best
And it is a must
`
  },
  {
    title: 'On the way',
    author: 'Kalai Selvi',
    text: `I am on the way
My way to the land
Where it is spring
Flapping my wings
I fly on my way
When winter sets in
Making everything cold
Birds decide to fly
To reach a warm home
With food to eat
And a place to sleep!
To hatch new eggs
To raise our chicks
We fly thousands of miles
And reach with a smile!
`
  },
  {
    title: 'On the street',
    author: 'Kalai Selvi',
    text: `Bark, bark, bark
All night they bark
Making everyone
Not to have sleep
Dogs roam at night
And chase each other
Whatever it may be
Awake through the night
Dogs bark and bark
When morning sets in
Dogs find a place
To curl and sleep
`
  },
  {
    title: 'My day',
    author: 'Kalai Selvi',
    text: `It is my day
To be happy today
Tweet laddoos
Hot, hot vadas
Mummy makes them
For me 
And my friends
To eat and play
For today
Is our holiday.
`
  },
  {
    title: 'Swing',
    author: 'Kalai Selvi',
    text: `We all play
Swinging every day
On the swing
From the branch
Of our neem tree
Swish goes it
High up in the air
And then comes down
Is it not fair
To wait for my turn
Till my friend
Completes another round
`
  },
  {
    title: 'A Butterfly',
    author: 'Kalai Selvi',
    text: `A colorful butterfly
Flies in my garden
Going from one flower 
To another flower 
To taste sweet nectar
With pollen on petals
It flies in the morning
It flies in the evening
And sleeps in the night
On a bed of leaves.`
  },
  {
    title: 'A visitor',
    author: 'Kalai Selvi',
    text: `On a day last week
When a light rain
Started to bring in
A weather so comfortable
A strange visitor
Knocked our doors
“Knock, knock, knock
Is there someone there”
I peeped through
The hole on the door 
Surprise I opened the door
For a little dinosaur
Stood there with a look
For he wanted me 
To give my painting brush
To draw a picture
That looked like me!
`
  }
];

export default [...forthGradePoem, ...data];
